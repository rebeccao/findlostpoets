import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import debounce from 'lodash/debounce';
import type { Poet } from '@prisma/client';
import Navbar from '~/components/navbar';
import SidebarPanel from '~/components/sidebar/sidebar-panel';
import LoadingAnimation from '~/components/loading-animation';
import { sidebarItems } from '~/components/sidebar/sidebar-data';
import ImageCard from '~/components/image-card';
import PoetModal from '~/components/modals/poetmodal';
import PoemModalMobile from '~/components/modals/poemmodal';
import ErrorBoundary from '~/components/error-boundary';
import { customLog } from '~/root';

const PAGE_SIZE = 24;
const BUFFER_SIZE = PAGE_SIZE * 3;
const DATABASE_SIZE = 28170;

export interface NavbarProps {
  toggleSidebar: () => void;
	className?: string;  								// Optional string for CSS classes
	count?: number;   				   				// Optional count to display poet count after performSearch
	searchCriteriaArray: string[];			// Search criteria string
	onTopCollectorSelect: (topCollector: { key: string; value: string }) => void; // New prop for the callback
}

export type SearchCriteria = {
  where?: { [key: string]: any };
  skip: number;
  take?: number;
  orderBy?: { [key: string]: 'asc' | 'desc' }[];
};

interface LoaderData {
  poets?: Poet[];  // Optional to handle cases where no poets data might be returned
	count?: number;  // Optional count of poets
	error?: string;  // Optional string for when there are errors
	detail?: string; // Optional detailed error message
}

export const loader: LoaderFunction = async ({ request }) => {
	try {
		const url = new URL(request.url);
		let dbQuery: SearchCriteria = { orderBy: [{ pid: 'asc' }], skip: 0, take:PAGE_SIZE }; // query on first load
		
		const searchQuery = url.searchParams.get("query");
		customLog('IndexLoader', '++++++  Index loader: Received searchQuery:', searchQuery);

		if (searchQuery) {
			try {
				const parsedQuery: SearchCriteria = JSON.parse(decodeURIComponent(searchQuery));
				dbQuery = { ...dbQuery, ...parsedQuery };
			} catch (error) {
				console.error('Error parsing search query:', error);
			}
		}		

		const poets = await prisma.poet.findMany({ ...dbQuery });
		const count = await prisma.poet.count({ where: dbQuery.where });

		return json({ poets, count, isEmpty: poets.length === 0 });
	} catch (error: unknown) {
			console.error('Loader error:', error);
        return json({
            error: "Server error occurred. Please try again later.",
            detail: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
	}
};

// SidebarPanel states
export interface State {
  searchTrait: { searchTraitKey: string; searchTraitValue: string | number };
  selectedRareTrait: string | null;
  selectedRangeTrait: string | null;
  rangeValues: Record<string, { min?: number; max?: number }>;
  selectedClasses: string[] | null;
  selectedNamedTrait: boolean | null;
}

// SidebarPanel actions
export type Action =
  | { type: 'SET_SEARCH_TRAIT'; payload: { searchTraitKey: string; searchTraitValue: string | number } }
  | { type: 'SET_SELECTED_RARE_TRAIT'; payload: string | null }
  | { type: 'SET_SELECTED_RANGE_TRAIT'; payload: string | null }
  | { type: 'SET_RANGE_VALUES'; payload: { key: string; value: { min?: number; max?: number } } }
  | { type: 'SET_SELECTED_CLASSES'; payload: string[] | null }
  | { type: 'SET_SELECTED_NAMED_TRAIT'; payload: boolean | null };

const firstTraitDbField = sidebarItems.find(item => item.type === "traitSearch")?.expandedSidebarItems[0].dbField || '';
const initialState: State = {
  searchTrait: { searchTraitKey: firstTraitDbField, searchTraitValue: '' },
  selectedRareTrait: null,
  selectedRangeTrait: null,
  rangeValues: {},
  selectedClasses: null,
  selectedNamedTrait: null,
};

// A reducer function to handle all the search states in SidebarPanel
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SEARCH_TRAIT':
      return { ...state, searchTrait: action.payload };
    case 'SET_SELECTED_RARE_TRAIT':
      return { ...state, selectedRareTrait: action.payload };
    case 'SET_SELECTED_RANGE_TRAIT':
      return { ...state, selectedRangeTrait: action.payload };
			case 'SET_RANGE_VALUES':
				return {
					...state,
					rangeValues: {
						...state.rangeValues,
						[action.payload.key]: {
							...state.rangeValues[action.payload.key],
							...action.payload.value,
						},
					},
				};
    case 'SET_SELECTED_CLASSES':
      return { ...state, selectedClasses: action.payload };
    case 'SET_SELECTED_NAMED_TRAIT':
      return { ...state, selectedNamedTrait: action.payload };
    default:
      return state;
  }
}

function Index() {
	type Direction = 'forward' | 'backward';

	const fetcher = useFetcher();
	const initialData = useLoaderData<typeof loader>();
	const [fetcherData, setFetcherData] = useState<LoaderData | null>(null);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [poetCount, setPoetCount] = useState<number | null>(initialData.count);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const [showPoetModal, setShowPoetModal] = useState<Poet | null>(null);
	const [showPoemModal, setShowPoemModal] = useState<string | null>(null);

  const [currentDbQuery, setCurrentDbQuery] = useState<SearchCriteria>({ orderBy: [{ pid: 'asc' }], take: PAGE_SIZE, skip: 0 });
	const [poetSlidingWindow, setPoetSlidingWindow] = useState<Poet[]>(initialData.poets || []);
	const [windowIndices, setWindowIndices] = useState({ backwardIndex: 1, forwardIndex: 24 });
	const [poetSlidingWindowUpdated, setPoetSlidingWindowUpdated] = useState<boolean>(false);
	const [fetchDirection, setFetchDirection] = useState<Direction>('forward');
	
	const forwardSentinelRef = useRef<HTMLDivElement | null>(null);
	const backwardSentinelRef = useRef<HTMLDivElement | null>(null);
	const forwardGlobalObserver = useRef<IntersectionObserver | null>(null);
	const backwardGlobalObserver = useRef<IntersectionObserver | null>(null);

	/*************** Infinite scroll logic ****************/

	// fetcher.data useEffect
	// In the useFetcher hook, the fetcher.data property is automatically managed
	// by Remix based on the lifecycle of the fetch operation and it can not directly
	// be set to null. Copy it to a fetcherData state and use that state to control
	// the infinite scrolling
  useEffect(() => {
    // Assert the type of fetcher.data to LoaderData right when it's retrieved
		// Now TypeScript knows the structure of 'data', including its 'error' and 'poets' fields
    const data = fetcher.data as LoaderData | undefined;
  
    if (data) {
			console.log("useEffect fetcher.data");
			if ('error' in data && data.error) {
				// Log the detailed error message if available or provide a generic error message
				console.error("Error fetching poets:", data.detail || 'Unknown error occurred.');
				setFetchError(data.detail || 'An error occurred while fetching poets. Please try again later.');
			} else if (data.poets) {
				// Handle successful data fetch
				if (data.poets.length > 0) {
					setFetcherData(data); // Store the data
					setFetchError(null); // Clear any previous errors
					if (data.count !== undefined) {
						setPoetCount(data.count);
					}
				} else {
					// Handle case where no poets are found
					setFetchError('No poets found. Please adjust your search criteria.');
					setPoetCount(null);
				}
			}
    }
	}, [fetcher.data]);


	// fetchMorePoets
	const fetchMorePoets = useCallback((direction: Direction, nextSkip: number) => {
		const newQuery: SearchCriteria = {
			...currentDbQuery, 
			skip: direction === 'forward' ? nextSkip : Math.max(0, nextSkip),
			take: PAGE_SIZE,
		};

		setCurrentDbQuery(newQuery);
		setFetchDirection(direction);
		//console.log("        --> fetchMorePoets direction = ", direction, "newQuery = ", JSON.stringify(newQuery, null, 2));
		console.log("        --> fetchMorePoets direction = ", direction, "newQuery = ", newQuery);

		if (forwardGlobalObserver.current) {
			forwardGlobalObserver.current.disconnect(); // Temporarily disconnect
			//console.log("fetchMorePoets --- forwardGlobalObserver.current.disconnect() = ", forwardGlobalObserver.current);
		}

		if (backwardGlobalObserver.current) {
			backwardGlobalObserver.current.disconnect(); // Temporarily disconnect
			//console.log("fetchMorePoets --- backwardGlobalObserver.current.disconnect() = ", backwardGlobalObserver.current);
		}
	
		const queryString = JSON.stringify(newQuery);
		const dbQueryString = new URLSearchParams({ query: queryString }).toString();
		fetcher.load(`?index&${dbQueryString}`);
	}, [currentDbQuery, fetcher]);

	// setupObserver callback
	const setupObserver = useCallback(() => {
		if (poetSlidingWindow.length > 0) {
			console.log("********  setupObserver  fetchDirection = ", fetchDirection);
			console.log("******************************************************************************************************************************************");
			
			// Disconnect the current global observers if they exist
			if (backwardGlobalObserver.current) {
				backwardGlobalObserver.current.disconnect(); // Temporarily disconnect
			}
			if (forwardGlobalObserver.current) {
				forwardGlobalObserver.current.disconnect(); // Temporarily disconnect
			}

			const observerCallback = debounce((entries: IntersectionObserverEntry[]) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && fetcher.state !== 'loading') {
						if (entry.target === forwardSentinelRef.current && poetSlidingWindow.length > 0 && hasMore) {
							
							console.log("observerCallback -- isIntersecting forwardSentinel -- fetchDirection=", fetchDirection, "-- entry.target =", entry.target?.getAttribute('data-pid'), "-- backwardSentinelRef =",  backwardSentinelRef.current?.getAttribute('data-pid'), "-- forwardSentinelRef =",  forwardSentinelRef.current?.getAttribute('data-pid'));
							console.log("                 -- windowIndices.backwardIndex =", windowIndices.backwardIndex, "windowIndices.forwardIndex =", windowIndices.forwardIndex);
							let nextSkip = currentDbQuery.skip + PAGE_SIZE;
							// Switched directions from backward to forward, set nextSkip to end of poetSlidingWindow
							if (fetchDirection === 'backward') {
								console.log("                -- #####  (fetchDirection === backward ######");
								nextSkip = currentDbQuery.skip + (3 * PAGE_SIZE);
								console.log("                -- (fetchDirection switched to backward - nextSkip = currentDbQuery.skip + (3 * PAGE_SIZE) = ", nextSkip = currentDbQuery.skip + (3 * PAGE_SIZE));
							}
							console.log("                 -- currentDbQuery.skip = ", currentDbQuery.skip, "nextSkip = ", nextSkip);
							fetchMorePoets('forward', nextSkip); // Fetch next page

						} else if (entry.target === backwardSentinelRef.current && poetSlidingWindow[0].pid !== 1 && poetSlidingWindow.length > 0) {

							console.log("observerCallback -- isIntersecting backwardSentinel -- fetchDirection=", fetchDirection, "-- entry.target =", entry.target?.getAttribute('data-pid'), "-- backwardSentinelRef =",  backwardSentinelRef.current?.getAttribute('data-pid'), "-- forwardSentinelRef =",  forwardSentinelRef.current?.getAttribute('data-pid'));
							console.log("                 -- windowIndices.backwardIndex =", windowIndices.backwardIndex, "windowIndices.forwardIndex =", windowIndices.forwardIndex);
							//const firstPoetIndexOriginal = poetSlidingWindow[0].pid; 
							const firstPoetIndex = windowIndices.backwardIndex;
							//console.log("                 -- firstPoetIndexOriginal = ", firstPoetIndexOriginal, "firstPoetIndex = ", firstPoetIndex, "currentDbQuery.skip = ", currentDbQuery.skip);
							console.log("                 -- firstPoetIndex = ", firstPoetIndex, "currentDbQuery.skip = ", currentDbQuery.skip);
							const newFirstPoetIndex = firstPoetIndex - PAGE_SIZE;
							if (newFirstPoetIndex > 0) {
								const backwardSkip = newFirstPoetIndex - 1;
								console.log("                 -- backwardSkip = ", backwardSkip);
								fetchMorePoets('backward', backwardSkip); // Fetch page to append at beginning of poetSlidingWindow
							}
						}
					}
				});
			}, 300);

			//const observerOptions = {	root: null,	rootMargin: '0px 0px 200px 0px', // top right bottom left	threshold: 0, };
			const observerOptions = {
				root: null, // observing entire viewport
				rootMargin: '200px 0px 0px 0px', // gives some margin to start loading before reaching sentinel
				threshold: 0.1 // 10%
			};
			forwardGlobalObserver.current = new IntersectionObserver(observerCallback, observerOptions);  //{ threshold: 0.1 });
			backwardGlobalObserver.current = new IntersectionObserver(observerCallback, observerOptions);  //{ threshold: 0.1 });

			if (forwardSentinelRef.current) {
				forwardGlobalObserver.current.observe(forwardSentinelRef.current);
			}

			if (backwardSentinelRef.current) {
				backwardGlobalObserver.current.observe(backwardSentinelRef.current);
			}
		}
	}, [currentDbQuery, poetSlidingWindow, fetchMorePoets, fetcher.state]);

	// Reset Observers useEffect - Reset the observers after returning from the Poet or Poem Modal views.
	// Otherwise the scrolling will no longer work. 
	useEffect(() => {
		console.log("forwardSentinelRef.current useEffect");
    if (forwardSentinelRef.current && backwardSentinelRef.current) {
        forwardGlobalObserver.current?.observe(forwardSentinelRef.current);
        backwardGlobalObserver.current?.observe(backwardSentinelRef.current);
    }
	}, [forwardSentinelRef.current, backwardSentinelRef.current]);		

	// InitialData useEffect
	useEffect(() => {
		if (initialData.poets.length > 0) {
      // Ensure observer is setup only after initial data is loaded
      // and if globalObserver is initialized 
      if (!forwardGlobalObserver.current && initialData.poets.length === PAGE_SIZE) {
				setCurrentDbQuery({ ...currentDbQuery, skip: PAGE_SIZE, take: PAGE_SIZE });		// Update current query skip
				console.log("useEffect InitialData CALLING setupObserver setupObserver forward, currentDbQuery = ", currentDbQuery);
				console.log("    poetSlidingWindow", poetSlidingWindow.map(poet => poet.pid).join(", "));
				console.log("InitialData useEffect calling setupObserver");
				setupObserver();
      }
    }
	}, [initialData.poets, currentDbQuery]); // Depends on the initial poets list.

	// Append fetcherData useEffect
	useEffect(() => {
		if (fetcherData && !fetcherData.error) {
			// Make sure poets is actually an array before proceeding.
			const poetsArray = fetcherData.poets || []; // Default to an empty array if undefined

			if (poetsArray.length > 0) {
				console.log("useEffect Append fetcherData -- poetsArray.length =", poetsArray.length);
				setHasMore(poetsArray.length == PAGE_SIZE);
				setPoetSlidingWindow((prevPoets) => {
					let updatedPoets: Poet[] = [];
					let newBackwardIndex = windowIndices.backwardIndex;
          let newForwardIndex = windowIndices.forwardIndex;
					
					if (fetchDirection === 'forward') {
						updatedPoets = [...prevPoets, ...poetsArray];
						newForwardIndex = windowIndices.forwardIndex + poetsArray.length;
						if (updatedPoets.length > BUFFER_SIZE && poetsArray.length == PAGE_SIZE) {
								// Trim from the beginning when moving forward
								updatedPoets = updatedPoets.slice(-BUFFER_SIZE);
								newBackwardIndex = newForwardIndex - BUFFER_SIZE + 1;
						}
					} else {						// fetchDirection === 'backward'
						updatedPoets = [...poetsArray, ...prevPoets];
						newBackwardIndex = windowIndices.backwardIndex - poetsArray.length;
						if (updatedPoets.length > BUFFER_SIZE && poetsArray.length == PAGE_SIZE) {
							// Trim from the end when moving backward
							updatedPoets = updatedPoets.slice(0, BUFFER_SIZE);
							newForwardIndex = newBackwardIndex + BUFFER_SIZE - 1;
						}
					}
					setWindowIndices({ backwardIndex: newBackwardIndex, forwardIndex: newForwardIndex });
					return updatedPoets;
				});
				setPoetSlidingWindowUpdated(true);
				setFetcherData(null);
			} 
			setFetchError(null);
		}
	}, [fetcherData, fetchDirection]);
	
	// poetSlidingWindow updated useEffect
	useEffect(() => {
		if (poetSlidingWindowUpdated && poetSlidingWindow.length > 0) {
			setPoetSlidingWindowUpdated(false);
			console.log("useEffect poetSlidingWindow updated CALLING setupObserver --  backwardSentinelRef =",  backwardSentinelRef.current?.getAttribute('data-pid'), "forwardSentinelRef =",  forwardSentinelRef.current?.getAttribute('data-pid'));
			console.log("                                    -- windowIndices.backwardIndex =", windowIndices.backwardIndex, "windowIndices.forwardIndex =", windowIndices.forwardIndex);
			console.log("    poetSlidingWindow", poetSlidingWindow.map(poet => poet.pid).join(", "));
			console.log("poetSlidingWindow updated useEffect calling setupObserver");
			setupObserver();
		}
	}, [poetSlidingWindow, poetSlidingWindowUpdated]);


	/*************** SidebarPanel callback logic ****************/

	const [state, dispatch] = useReducer(reducer, initialState);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), [setSidebarOpen]);

	const [navbarSearchCriteriaArray, setNavbarSearchCriteriaArray] = useState<string[]>([]); 

	// searchButtonPressed is used to conditionally control displaying the Rare Trait count on the ImageCard 
	const [searchButtonPressed, setSearchButtonPressed] = useState(false);

	// Callback from SidebarPanel when the user clicks the Search button or Clear button
	const performSearch = (query: SearchCriteria) => {
		// Signal that a search has been initiated. This state conditionally controls displaying the Rare Trait count on the ImageCard 
		setSearchButtonPressed(true);

		// Reset all the states and fetch the new query
		query.take = PAGE_SIZE;

		setPoetCount(null);
		if (query.where !== undefined) {			// All user searches include where:, start at the beginning
			query.skip = 0
			// Clear and then set the search criteria string that will be displayed in the navbar
			setNavbarSearchCriteriaArray([]);
			formatSearchCriteriaArray();
		} else {															// User pressed Clear button, skip to a random place in the DB 
			const newPage = (Math.floor(Math.random() * (DATABASE_SIZE-100)/PAGE_SIZE));
			query.skip = (newPage - 1) * PAGE_SIZE;
			// Clear the search criteria string that will be displayed in the navbar
			setNavbarSearchCriteriaArray([]);
		}

		// Reset all state
		setHasMore(true);
		setFetcherData(null);
		setFetchDirection('forward');
		setPoetSlidingWindow([]);
		setWindowIndices({ backwardIndex: 1, forwardIndex: 0 });

		// Update currentDbQuery
		setCurrentDbQuery(query);
		console.log('**************************** performSearch: query));', JSON.stringify(query, null, 2));
		
		const queryString = JSON.stringify(query);
  	const dbQueryString = new URLSearchParams({ query: queryString }).toString();
		
		// Use fetcher.load to initiate the request to fetch poets and count
		fetcher.load(`?index&${dbQueryString}`);              // Note: the following doesn't work: fetcher.load(`/?${queryString}`);
  };

	const resetSearchState = () => {
    const updatedSearchTrait = {
      searchTraitKey: state.searchTrait.searchTraitKey.toString(),
      searchTraitValue: '',
    };
    dispatch({ type: 'SET_SEARCH_TRAIT', payload: updatedSearchTrait });

    // Deselect the selected rare trait, if any
    if (state.selectedRareTrait) {
      dispatch({ type: 'SET_SELECTED_RARE_TRAIT', payload: null });
    }

    // Reset the selected range trait and clear min/max values
    if (state.selectedRangeTrait) {
      dispatch({ type: 'SET_SELECTED_RANGE_TRAIT', payload: null });
      // Iterate over the keys in rangeValues and reset their min/max values
      Object.keys(state.rangeValues).forEach(key => {
        dispatch({ type: 'SET_RANGE_VALUES', payload: { key, value: { min: undefined, max: undefined } } });
      });
    }

    // Deselect the selected classes, if any
    if (state.selectedClasses) {
      dispatch({ type: 'SET_SELECTED_CLASSES', payload: [] });
    }

    // Deselect the selected named trait
    dispatch({ type: 'SET_SELECTED_NAMED_TRAIT', payload: null });
  };

	const formatSearchCriteriaArray = () => {
		setNavbarSearchCriteriaArray([]);
		sidebarItems.map((sidebarItem, index) => {
			// Search By Trait
			if (sidebarItem.type === "traitSearch" && state.searchTrait.searchTraitValue || state.searchTrait.searchTraitValue === 0) {
				const selectedTrait = sidebarItem.expandedSidebarItems.find(item => item.dbField === state.searchTrait.searchTraitKey); 
				if (selectedTrait?.title === "Wallet") {
					const address = state.searchTrait.searchTraitValue.toString();
					setNavbarSearchCriteriaArray(prev => [...prev, `${selectedTrait?.title}:${`${address.slice(0, 6)}...${address.slice(-4)}`}`]);
				} else {
					setNavbarSearchCriteriaArray(prev => [...prev, `${selectedTrait?.title}:${state.searchTrait.searchTraitValue}`]);
				}
			}

			// Sort By Rare Trait
			if (sidebarItem.type === "sort" && state.selectedRareTrait) {
				const selectedTrait = sidebarItem.expandedSidebarItems.find(item => item.dbField === state.selectedRareTrait); 
				setNavbarSearchCriteriaArray(prev => [...prev, `Rarest ${selectedTrait?.title}`]);
			}

			// Search By Range Trait
			if (sidebarItem.type === "range" && state.selectedRangeTrait) {
				const selectedTrait = sidebarItem.expandedSidebarItems.find(item => item.dbField === state.selectedRangeTrait); 
				const selectedRange = state.rangeValues[state.selectedRangeTrait] || {};
				const min = selectedRange.min ?? selectedTrait?.min;
 		 		const max = selectedRange.max ?? selectedTrait?.max;
				setNavbarSearchCriteriaArray(prev => [...prev, `${selectedTrait?.title}:${min}-${max}`]);
			}

			// Search By Classes
			if (sidebarItem.type === "class" && state.selectedClasses && state.selectedClasses.length > 0) {
				const classString = state.selectedClasses.map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('|');
				setNavbarSearchCriteriaArray(prev => [...prev, `${classString}`]);
			}

			// Search By Named Trait
			if (sidebarItem.type === "named" && state.selectedNamedTrait !== null) {
				setNavbarSearchCriteriaArray(prev => [...prev, `${state.selectedNamedTrait ? "Named" : "No Name"}`]);
			}
		})
		console.log("Index formatSearchCriteriaArray navbarSearchCriteriaArray - ", navbarSearchCriteriaArray);
	}

	/*************** Navbar callback ****************/

	const [selectedTopCollector, setSelectedTopCollector] = useState<{ key: string; value: string } | null>(null);
	const [performSearchTrigger, setPerformSearchTrigger] = useState(false);

  const handleTopCollectorSelect = (topCollector: { key: string; value: string }) => {
    setSelectedTopCollector(topCollector);
    console.log('Index Selected topCollector from TopCollectorsModal:', topCollector);
  };

	useEffect(() => {
		console.log('Index selectedTopCollector:', selectedTopCollector);
		if(selectedTopCollector) {
			// Reset all search states
			resetSearchState();

			// Update the state for searchTraitKey and searchTraitValue
			const updatedSearchTrait = {
				searchTraitKey: selectedTopCollector.key,
				searchTraitValue: selectedTopCollector.value,
			};
			dispatch({ type: 'SET_SEARCH_TRAIT', payload: updatedSearchTrait });

			// Trigger the performSearch in the next useEffect in order to allow SET_SEARCH_TRAIT to get set
      setPerformSearchTrigger(true);
		}
	}, [selectedTopCollector]);

	useEffect(() => {
    if (performSearchTrigger && selectedTopCollector) {
			let dbQuery: SearchCriteria = {
				skip: 0,
				take: 24,
			}
			dbQuery.where = { AND: [{ [selectedTopCollector.key]: { equals: selectedTopCollector.value, mode: "insensitive" }}]};
			dbQuery.orderBy = [{ "pid": "asc" }];

			performSearch(dbQuery);
			setPerformSearchTrigger(false); // Reset the trigger
		}
	}, [performSearchTrigger, state.searchTrait.searchTraitKey, state.searchTrait.searchTraitValue]);

	/*************** PoetDetails logic ****************/

	// useEffect to resolve the issue with the infinite scrolling not occurring after returning from the PoetModal
	useEffect(() => {
    if (showPoetModal === null && showPoemModal === null) {
			console.log("Fix Infinite Scroll Breaking useEffect calling setupObserver");
      setupObserver();
    }
  }, [showPoetModal, showPoemModal]);

	// Handles user hitting the browser back and forward buttons
	useEffect(() => {
		const handlePopState = (event: PopStateEvent) => {
			const state = event.state;
			if (state?.poetPid) {
				// Find the poet in memory
				const foundPoet = poetSlidingWindow.find(p => p.pid === state.poetPid);
	
				if (foundPoet) {
					if (window.innerWidth >= 1024) {
						setShowPoetModal(foundPoet);
					} else {
						setShowPoemModal(foundPoet.poem);
					}
				} else {
					// If not found (maybe scrolled out of buffer), just close modal safely
					setShowPoetModal(null);
					setShowPoemModal(null);
				}
			} else {
				// No poetPid? Just close
				setShowPoetModal(null);
				setShowPoemModal(null);
			}
		};
	
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [poetSlidingWindow]);

	const handleShowingPoetDetail = (poet: Poet) => {

		// Prewarm the Cloudflare cache in the background
		const g1 = poet.g1Url.replace('https://ipfs.io/ipfs/', 'https://findlostpoets.xyz/ipfs/') + '?resize=600&format=jpg';

		// **IMPORTANT:** Add the cacheBuster to the prewarm URL for Discord aggressive caching
    // This matches the construct the URL in poet.$pNam.tsx's meta function
    const cacheBuster = Date.now(); // Or use a static version like '&v=1' if you manage versions manually
    const compositeImageUrl = `https://og-composite-worker.findlostpoets.workers.dev/?g0=${encodeURIComponent(poet.g0Url)}&g1=${encodeURIComponent(g1)}&name=${encodeURIComponent(poet.pNam)}&_=${cacheBuster}`;
		
		const prewarm = () => {
			void fetch(compositeImageUrl, { 
				method: 'GET', 
				headers: { 'User-Agent': 'Mozilla/5.0 (Prewarm)' } 
			});
		};

		// Run non-critical prewarm task when the browser is idle, if browser supports it
		if ('requestIdleCallback' in window) {
      requestIdleCallback(prewarm);
    } else {
      setTimeout(prewarm, 300);
    }

		// Save current scroll position
		sessionStorage.setItem('lastScrollPosition', window.scrollY.toString());

		// Only push URL (browser will handle fetching the page if needed)
		window.history.pushState({}, '', `/poet/${encodeURIComponent(poet.pNam)}`);

		window.innerWidth >= 1024 ? setShowPoetModal(poet) : setShowPoemModal(poet.poem);
	};

	const handleReturnFromPoetDetail = () => {
		// Revert the fake route
		window.history.pushState({}, '', '/');

		window.innerWidth >= 1024 ? setShowPoetModal(null) : setShowPoemModal(null);
		// Restore scroll position if available
		requestAnimationFrame(() => {
			const lastScrollPosition = sessionStorage.getItem('lastScrollPosition');
			if (lastScrollPosition) {
					window.scrollTo(0, parseInt(lastScrollPosition));
					sessionStorage.removeItem('lastScrollPosition');
			}
		});
  };
	
	if (showPoetModal) {
		return (
			<div>
				<PoetModal
					poet={showPoetModal} 
					hasPoem={showPoetModal.lexCnt > 0} 
					onReturn={handleReturnFromPoetDetail} 
				/>
			</div>
		);
	}

	if (showPoemModal) {
		return (
			<div>
				<PoemModalMobile
					poem={showPoemModal} 
					onReturn={handleReturnFromPoetDetail} 
				/>
			</div>
		);
	}

	// Extract title from sidebarItems based on item.type === 'sort' and expanded item.dbField
	//const selectedRareTraitLabel = sidebarItems.find(item => item.type === 'sort')?.expandedSidebarItems.find(item => item.dbField === selectedRareTrait)?.title;
	// Example logic to convert 'brdCnt' into 'brd', etc.
	const selectedRareTraitLabel = state.selectedRareTrait ? state.selectedRareTrait.replace("Cnt", "") : undefined;

  return (
		<ErrorBoundary>
			<div className="flex min-h-screen bg-closetoblack text-pearlwhite">
				{sidebarOpen && (
					<section className="fixed left-0 top-14 bottom-0 w-80 z-5 h-[calc(100vh-56px)]">
						<SidebarPanel state={state} dispatch={dispatch} performSearch={performSearch} resetSearchState={resetSearchState}/>
					</section>
				)}
				<div className="flex flex-col w-full">
					<Navbar 
						toggleSidebar={toggleSidebar} 
						className="navbar" 
						count={poetCount ? poetCount : undefined} 
						searchCriteriaArray={navbarSearchCriteriaArray} 
						onTopCollectorSelect={handleTopCollectorSelect} // Pass the callback to Navbar
          />

					<div className={`transition-all duration-400 ease-in-out ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
						<div className="mt-4 mb-4 px-4">
							{/* Display loading state */}
							{fetcher.state === 'loading' && <LoadingAnimation />}

							{/* Display error state */}
							{fetchError && (
								<div className="flex flex-col justify-start min-h-screen p-4">
									<div className="rounded-md bg-lightmedgray border-l-4 border-deepCrimson text-verydarkgray px-6 py-8" role="alert">
										<p>{fetchError}</p>
									</div>
								</div>
							)}

							<div className="grid-container">
								<div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4">
									{/* Poets mapping */}
									{poetSlidingWindow?.map((poet: Poet, index: number) => (
										<div 
											key={poet.pid} 
											id={`poet-${poet.pid}`} 
											onClick={() => handleShowingPoetDetail(poet)} 
											className="cursor-pointer flex"
										>
											<ImageCard 
												key={poet.pid} 
												poet={poet}
												// Assign ref to the first poet or the last poet
												ref={index === poetSlidingWindow.length - (2*PAGE_SIZE) ? backwardSentinelRef : index === poetSlidingWindow.length - 1 ? forwardSentinelRef : undefined}
												// Dynamically access the Poet property
												rarityTraitLabel={searchButtonPressed ? `${poet[selectedRareTraitLabel as keyof Poet]}` : undefined}
												// Dynamically access the rarity count
												rarityCount={searchButtonPressed && state.selectedRareTrait ? poet[state.selectedRareTrait as keyof Poet] as number : undefined}
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ErrorBoundary>
  );
}

export default Index;