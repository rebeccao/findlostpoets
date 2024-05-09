import { useState, useEffect, useRef, useCallback } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import type { Poet } from '@prisma/client';
import '~/tailwind.css';
import Navbar from '~/components/navbar';
import SidebarPanel from '~/components/sidebar/sidebar-panel';
import { sidebarItems } from '~/components/sidebar/sidebar-data';
import ImageCard from '~/components/image-card';
import PoetDetail from '~/components/detail/poetdetail';
import ErrorBoundary from '~/components/error-boundary';

const PAGE_SIZE = 24;
const BUFFER_SIZE = PAGE_SIZE * 3;
const DATABASE_SIZE = 28170;

export interface NavbarProps {
  toggleSidebar: () => void;
	className?: string;  // Optional string for CSS classes
}

export interface SidebarProps {
	searchTrait: Record<string, string | number>;
	selectedRareTrait: string | null; 
	selectedRangeTrait: string | null; 
	rangeValues: Record<string, { min?: number; max?: number }>;
	onSearchTraitChange: (searchTraitState: { searchTraitKey: string; searchTraitValue: string | number }) => void;
	onRareTraitChange: (selectedDbField: string | null) => void;
	onRangeTraitSelect: (selectedDbField: string | null) => void; 
	onRangeChange: (selectedDbField: string | null, min?: number, max?: number) => void;
	performSearch: (dbQuery: SearchCriteria) => void;
}

export type SearchCriteria = {
  where?: { [key: string]: any };
  skip: number;
  take?: number;
  orderBy?: { [key: string]: 'asc' | 'desc' }[];
};

interface LoaderData {
  poets?: Poet[];  // Make optional to handle cases where no poets data might be returned
	error?: string;  // Optional string for when there are errors
	detail?: string; // Optional detailed error message
}

export const loader: LoaderFunction = async ({ request }) => {

	try {
		const url = new URL(request.url);

		let dbQuery: SearchCriteria = { orderBy: [{ pid: 'asc' }], skip: 0, take:PAGE_SIZE }; // query on first load
		
		const searchQuery = url.searchParams.get("query");
		console.log('++++++++  Index loader: Received searchQuery:', searchQuery);

		if (searchQuery) {
			try {
				const parsedQuery: SearchCriteria = JSON.parse(decodeURIComponent(searchQuery));
				// see if it works after removing the merge of the 2 queries. Have a conditional to do the query instead
				dbQuery = { ...dbQuery, ...parsedQuery };
			} catch (error) {
				console.error('Error parsing search query:', error);
			}
		}		

		const poets = await prisma.poet.findMany({ ...dbQuery });
		return json({ poets, isEmpty: poets.length === 0 });
	} catch (error: unknown) {
			console.error('Loader error:', error);
        return json({
            error: "Server error occurred. Please try again later.",
            detail: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
	}
};

function Index() {
	const fetcher = useFetcher();
	const initialData = useLoaderData<typeof loader>();
	const [activatePoetDetail, setActivatePoetDetail] = useState<Poet | null>(null);

  //console.log("******************* const poets: Poet[] = data.poets, fetcher.data ", fetcher.data); 
	//console.log("******************* const poets: Poet[] = data.poets, initialData.poets.length", initialData.poets.length); 

	type Direction = 'forward' | 'backward';

  const [currentDbQuery, setCurrentDbQuery] = useState<SearchCriteria>({ orderBy: [{ pid: 'asc' }], take: PAGE_SIZE, skip: 0 });
	const [poetSlidingWindow, setPoetSlidingWindow] = useState<Poet[]>(initialData.poets || []);
	const [poetSlidingWindowUpdated, setPoetSlidingWindowUpdated] = useState<boolean>(false);
	const [fetcherData, setFetcherData] = useState<LoaderData | null>(null);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [fetchDirection, setFetchDirection] = useState<Direction>('forward');
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [searchPerformed, setSearchPerformed] = useState(false);
	
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
    const data = fetcher.data as LoaderData | undefined;
    
    // Now TypeScript knows the structure of 'data', including its 'error' and 'poets' fields
    if (data) {
			if ('error' in data && data.error) {
				// Log the detailed error message if available or provide a generic error message
				console.error("Error fetching poets:", data.detail || 'Unknown error occurred.');
				setFetchError(data.detail || 'An error occurred while fetching poets. Please try again later.');
			} else if (data.poets) {
				// Handle successful data fetch
				if (data.poets.length > 0) {
					setFetcherData(data); // Store the data
					setHasMore(data.poets.length === PAGE_SIZE); // Determine if there are more poets to load
					setFetchError(null); // Clear any previous errors
				} else {
					// Handle case where no poets are found
					setFetchError('No poets found. Please adjust your search criteria.');
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
		//console.log("<--------> fetchMorePoets direction = ", direction, "newQuery = ", JSON.stringify(newQuery, null, 2));
		console.log("<--------> fetchMorePoets direction = ", direction, "newQuery = ", newQuery);

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
			console.log("********  setupObserver  fetchDirection = ", fetchDirection, "        currentDbQuery.skip = ", currentDbQuery.skip);

			// Disconnect the current global observers if they exist
			if (backwardGlobalObserver.current) {
				backwardGlobalObserver.current.disconnect(); // Temporarily disconnect
			}
			if (forwardGlobalObserver.current) {
				forwardGlobalObserver.current.disconnect(); // Temporarily disconnect
			}

			const observerCallback = (entries: IntersectionObserverEntry[]) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target === forwardSentinelRef.current && poetSlidingWindow.length > 0) {

							console.log("observerCallback -- entry.isIntersecting=", entry.isIntersecting, "-- fetchDirection=", fetchDirection, "-- entry.target=data-pid=", entry.target?.getAttribute('data-pid'), "   backwardSentinelRef data-pid=",  backwardSentinelRef.current?.getAttribute('data-pid'), "forwardSentinelRef data-pid=",  forwardSentinelRef.current?.getAttribute('data-pid'));
							console.log("                 poetSlidingWindow indexes ", poetSlidingWindow[0].pid, "  - ", poetSlidingWindow[poetSlidingWindow.length-1].pid);
							let nextSkip = currentDbQuery.skip + PAGE_SIZE;
							// Switched directions, set nextSkip to end of poetSlidingWindow
							if (fetchDirection === 'backward') {
								nextSkip = currentDbQuery.skip + (3 * PAGE_SIZE);
							}
							console.log("                 poetSlidingWindow currentDbQuery.skip = ", currentDbQuery.skip, "nextSkip = ", nextSkip);
							fetchMorePoets('forward', nextSkip); // Fetch next page

						} else if (entry.target === backwardSentinelRef.current && poetSlidingWindow[0].pid !== 1 && poetSlidingWindow.length > 0) {

							console.log("observerCallback -- entry.isIntersecting=", entry.isIntersecting, "-- fetchDirection=", fetchDirection, "-- entry.target=data-pid=", entry.target?.getAttribute('data-pid'), "   backwardSentinelRef data-pid=",  backwardSentinelRef.current?.getAttribute('data-pid'), "forwardSentinelRef data-pid=",  forwardSentinelRef.current?.getAttribute('data-pid'));
							console.log("                 poetSlidingWindow indexes ", poetSlidingWindow[0].pid, "  - ", poetSlidingWindow[poetSlidingWindow.length-1].pid);
							const firstPoetIndex = poetSlidingWindow[0].pid; 
							console.log("                 firstPoetIndex = ", firstPoetIndex, "currentDbQuery.skip = ", currentDbQuery.skip);
							const expectedPrevFirstPoetIndex = firstPoetIndex - PAGE_SIZE;
							if (expectedPrevFirstPoetIndex > 0) {
								const prevSkip = expectedPrevFirstPoetIndex - 1;
								console.log("                 poetSlidingWindow prevSkip = ", prevSkip);
								fetchMorePoets('backward', prevSkip); // Fetch previous page
							}
						}
					}
				});
			};

			//const observerOptions = {	root: null,	rootMargin: '0px 0px 200px 0px', // top right bottom left	threshold: 0, };
			const forwardObserver = new IntersectionObserver(observerCallback, { threshold: 0.1 });// observerOptions);  //{ threshold: 0.1 });
			const backwardObserver = new IntersectionObserver(observerCallback, { threshold: 0.1 });// observerOptions);  //{ threshold: 0.1 });

			if (forwardSentinelRef.current) {
				forwardObserver.observe(forwardSentinelRef.current);
			}

			if (backwardSentinelRef.current) {
				backwardObserver.observe(backwardSentinelRef.current);
			}

			// Assigning observers to globalObservers for later access
			backwardGlobalObserver.current = backwardObserver;
			forwardGlobalObserver.current = forwardObserver;
		}
	}, [currentDbQuery.skip, poetSlidingWindow, fetchDirection, fetchMorePoets]);

	// InitialData useEffect
	useEffect(() => {
		if (initialData.poets.length > 0) {
      // Ensure observer is setup only after initial data is loaded
      // and if globalObserver is initialized 
      if (!forwardGlobalObserver.current && initialData.poets.length === PAGE_SIZE) {
				setCurrentDbQuery({ ...currentDbQuery, skip: PAGE_SIZE, take: PAGE_SIZE });		// Update current query skip
				console.log("InitialData useEffect setupObserver forward, currentDbQuery = ", currentDbQuery);
				setupObserver();
      }
    }
	}, [initialData.poets, currentDbQuery, setupObserver]); // Depends on the initial poets list.

	// Append fetcherData useEffect
	useEffect(() => {
		if (fetcherData && !fetcherData.error) {
			// Make sure poets is actually an array before proceeding.
			const poetsArray = fetcherData.poets || []; // Default to an empty array if undefined

			if (poetsArray.length > 0) {
					
				setPoetSlidingWindow((prevPoets) => {
					let updatedPoets: Poet[] = [];
					
					if (fetchDirection === 'forward') {
						updatedPoets = [...prevPoets, ...poetsArray];
						if (updatedPoets.length > BUFFER_SIZE) {
								// Trim from the beginning when moving forward
								console.log("---- Append fetcherData useEffect -- SLICE first page -- updatedPoets.length", updatedPoets.length);
								updatedPoets = updatedPoets.slice(-BUFFER_SIZE);
						}
					} else {						// fetchDirection === 'backward'
						updatedPoets = [...poetsArray, ...prevPoets];
						if (updatedPoets.length > BUFFER_SIZE) {
							// Trim from the end when moving backward
							console.log("---- Append fetcherData useEffect -- SLICE last page");
							updatedPoets = updatedPoets.slice(0, BUFFER_SIZE);
						}
					}
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
		if (poetSlidingWindowUpdated && hasMore && poetSlidingWindow.length > 0) {
			setPoetSlidingWindowUpdated(false);
			console.log("poetSlidingWindow updated useEffect CALLING setupObserver -- poetSlidingWindow indexes ", poetSlidingWindow[0].pid, "-", poetSlidingWindow[poetSlidingWindow.length-1].pid);
			setupObserver();
		}
	}, [poetSlidingWindow, poetSlidingWindowUpdated, hasMore, setupObserver]);


	/*************** SidebarPanel callback logic ****************/

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

	const initialTraitDbField = sidebarItems[0].expandedSidebarItems[0].dbField;
	const [searchTrait, setSearchTrait] = useState<{ searchTraitKey: string; searchTraitValue: string | number }>({ searchTraitKey: initialTraitDbField, searchTraitValue: '' });
	const [selectedRareTrait, setSelectedRareTrait] = useState<string | null>(null);
	const [selectedRangeTrait, setSelectedRangeTrait] = useState<string | null>(null);
	const [rangeValues, setRangeValues] = useState<Record<string, { min?: number; max?: number }>>({});

	// searchButtonPressed is used to conditionally control displaying the Rare Trait count on the ImageCard 
	const [searchButtonPressed, setSearchButtonPressed] = useState(false);

	// Callback from SidebarPanel when the user clicks the Search button or Clear button
	const performSearch = (query: SearchCriteria) => {

		// Signal that a search has been initiated. This state conditionally controls displaying the Rare Trait count on the ImageCard 
		setSearchButtonPressed(true);

		// Reset all the states and fetch the new query
		query.take = PAGE_SIZE;

		if (query.where !== undefined) {			// All new searches include where:, start at the beginning
			query.skip = 0
			console.log("performSearch query.skip = ", query.skip);
		} else {															// User pressed Clear button, skip to a random place in the DB 
			const newPage = (Math.floor(Math.random() * (DATABASE_SIZE-100)/PAGE_SIZE));
			query.skip = (newPage - 1) * PAGE_SIZE;
			console.log("performSearch query.skip = ", query.skip, "newPage = ", newPage);
		}

		// Reset state
		setHasMore(true);
		setFetcherData(null);
		setFetchDirection('forward');
		setPoetSlidingWindow([]);

		setCurrentDbQuery(query);
		console.log('**************************** performSearch: query));', JSON.stringify(query, null, 2));
		
		const queryString = JSON.stringify(query);
  	const dbQueryString = new URLSearchParams({ query: queryString }).toString();
		
		// Use fetcher.load to initiate the request
		fetcher.load(`?index&${dbQueryString}`);              // Note: the following doesn't work: fetcher.load(`/?${queryString}`);
  };

	// Callback from SidebarPanel when the user selects a searchTrait and sets its value
	const handleSearchTraitChange = (searchTraitState: { searchTraitKey: string; searchTraitValue: string | number }) => {
		if (typeof searchTraitState.searchTraitValue === 'string') {
			//searchTraitState.searchTraitValue = searchTraitState.searchTraitValue.trim();
		}
    setSearchTrait(searchTraitState);
		console.log("Index: handleSearchTraitChange searchTraitState: ", searchTraitState);
  };

	// Callback from SidebarPanel when the user selects the rare trait checkbox
  const handleRareTraitChange = (selectedDbField: string | null) => {
		// Toggle selection: if the same trait is selected again, deselect it; otherwise, update the selection
		setSelectedRareTrait(prev => (prev === selectedDbField ? null : selectedDbField));
		// Reset searchButtonPressed to false to clear rarityTraitLabel and rarityCount until next search
		setSearchButtonPressed(false);
	};

	// Callback from SidebarPanel when the user selects the range checkbox
	const handleRangeTraitSelect = (selectedDbField: string | null) => {
		setSelectedRangeTrait(selectedDbField);
	};

	// Callback from SidebarPanel when the user sets the min and max range values 
	const handleRangeChange = (selectedDbField: string | null, min?: number, max?: number) => {
		if (selectedDbField !== null) {
			// Update min/max for the specified range trait
			setRangeValues(prev => ({
				...prev,
				[selectedDbField]: { min, max }
			}));
		} else {
			// Reset selected range trait and clear min/max for all traits
			setSelectedRangeTrait(null);
			setRangeValues({});
		}
	};

	/*************** PoetDetails logic ****************/

	const handleShowingPoetDetail = (poet: Poet) => {
		// Save current scroll position
		sessionStorage.setItem('lastScrollPosition', window.scrollY.toString());
		setActivatePoetDetail(poet);		
	};

	const handleReturnFromPoetDetail = () => {
    setActivatePoetDetail(null); 						// Clear the active poet detail view
		// Restore scroll position if available
		requestAnimationFrame(() => {
			const lastScrollPosition = sessionStorage.getItem('lastScrollPosition');
			if (lastScrollPosition) {
					window.scrollTo(0, parseInt(lastScrollPosition));
					sessionStorage.removeItem('lastScrollPosition');
			}
		});
  };
	
	if (activatePoetDetail) {
		let poetDetailComponent;
		if (activatePoetDetail.lexCnt === 0) {
			poetDetailComponent = <PoetDetail poet={activatePoetDetail} hasPoem={false} onReturn={handleReturnFromPoetDetail} />;
		} else if (activatePoetDetail.lexCnt > 0) { 
			poetDetailComponent = <PoetDetail poet={activatePoetDetail} hasPoem={true} onReturn={handleReturnFromPoetDetail} />;
		} 
		return (
			<div>{poetDetailComponent}</div>);
	}
	
	// Extract title from sidebarItems based on item.type === 'sort' and expanded item.dbField
	//const selectedRareTraitLabel = sidebarItems.find(item => item.type === 'sort')?.expandedSidebarItems.find(item => item.dbField === selectedRareTrait)?.title;
	// Example logic to convert 'brdCnt' into 'brd', etc.
	const selectedRareTraitLabel = selectedRareTrait ? selectedRareTrait.replace("Cnt", "") : undefined;

  return (
		<ErrorBoundary>
			<div className="flex min-h-screen bg-closetoblack text-pearlwhite">
				{sidebarOpen && (
					<section className="fixed left-0 top-56 bottom-0 w-80 sidebar">
						<SidebarPanel
							searchTrait={searchTrait}
							selectedRareTrait={selectedRareTrait}
							selectedRangeTrait={selectedRangeTrait}
							rangeValues={rangeValues}
							onSearchTraitChange={handleSearchTraitChange}
							onRareTraitChange={handleRareTraitChange}
							onRangeTraitSelect={handleRangeTraitSelect}
							onRangeChange={handleRangeChange}
							performSearch={performSearch} 
						/>
					</section>
				)}
				<div className="flex flex-col w-full">
					<Navbar toggleSidebar={toggleSidebar} className="navbar" />
					<div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
						<div className="mt-4 mb-4 px-4">
							{/* Display loading state */}
							{fetcher.state === 'loading' && (
								<div className="flex flex-col justify-start items-start min-h-screen pt-4 pl-4">
									<p>Loading...</p>
								</div>
							)}

							{/* Display error state */}
							{fetchError && (
								<div className="flex flex-col justify-start min-h-screen">
									<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
										<p className="font-bold">Error</p>
										<p>{fetchError}</p>
									</div>
								</div>
							)}

							<div className="grid-container">
								<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
									{/* Poets mapping */}
									{poetSlidingWindow?.map((poet: Poet, index: number) => (
										<div key={poet.id} id={`poet-${poet.pid}`} onClick={() => handleShowingPoetDetail(poet)} className="cursor-pointer flex">
											<ImageCard 
												key={poet.pid} 
												poet={poet}
												// Assign ref to the first poet or the last poet
												ref={index === poetSlidingWindow.length - (2*PAGE_SIZE) ? backwardSentinelRef : index === poetSlidingWindow.length - 1 ? forwardSentinelRef : undefined}
												// Dynamically access the Poet property
												rarityTraitLabel={searchButtonPressed ? `${poet[selectedRareTraitLabel as keyof Poet]}` : undefined}
												// Dynamically access the rarity count
												rarityCount={searchButtonPressed && selectedRareTrait ? poet[selectedRareTrait as keyof Poet] as number : undefined}
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