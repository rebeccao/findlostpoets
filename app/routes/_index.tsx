import { useLoaderData, useFetcher } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SidebarPanel from '~/components/sidebar/sidebar-panel';
import ImageCard from '~/components/image-card';
import {HiMenuAlt3} from 'react-icons/hi';
import type { Poet } from '@prisma/client';
import { sidebarItems } from '~/components/sidebar/sidebar-data';
import '~/tailwind.css';
import ErrorBoundary from '~/components/error-boundary';

export type SearchCriteria = {
  where?: { [key: string]: any };
  skip?: number;
  take?: number;
  orderBy?: { [key: string]: 'asc' | 'desc' }[];
};

interface LoaderData {
  poets: Poet[];
  error?: string; // Assuming error is a string. Adjust according to your actual structure.
}

const PAGE_SIZE = 20;
const DATABASE_SIZE = 28170;

export interface SidebarProps {
	searchTrait: Record<string, string>;
	selectedRareTrait: string | null; 
	selectedRangeTrait: string | null; 
	rangeValues: Record<string, { min?: number; max?: number }>;
	onSearchTraitChange: (searchTraitState: { searchTraitKey: string; searchTraitValue: string }) => void;
	onRareTraitChange: (selectedDbField: string | null) => void;
	onRangeTraitSelect: (selectedDbField: string | null) => void; 
	onRangeChange: (selectedDbField: string | null, min?: number, max?: number) => void;
	performSearch: (dbQuery: SearchCriteria) => void;
}

interface NavbarProps {
  toggleSidebar: () => void;
}

function Navbar({ toggleSidebar }: NavbarProps) {
	return(
		<header className="sticky top-0 z-[1] h-navbar mx-auto bg-gray-100 border-gray-300 p-2 shadow-md flex w-full justify-between items-center  font-sans font-bold uppercase text-white dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary">
			<div className="flex items-center">
				<button 
				  onClick={toggleSidebar} 
					className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gray-400 hover:bg-gray-500"
					aria-label='Toggle Sidebar'
				>
					<HiMenuAlt3 size={26} className="cursor-pointer text-white" />
				</button>
			</div>
			{/* Rest of Navbar */}
		</header>
	);
}

function Sidebar({ 
	searchTrait,
	selectedRareTrait,
	selectedRangeTrait,  
	rangeValues,
	onSearchTraitChange, 
	onRareTraitChange,
	onRangeTraitSelect,
	onRangeChange,
	performSearch }: SidebarProps) 
	{
	return (
	<section className="fixed left-0 bottom-0 w-80 bg-gray-100 sidebar">
			<SidebarPanel 
				searchTrait={searchTrait}
				selectedRareTrait={selectedRareTrait}
				selectedRangeTrait={selectedRangeTrait}
				rangeValues={rangeValues}
				onSearchTraitChange={onSearchTraitChange}
				onRareTraitChange={onRareTraitChange}
				onRangeTraitSelect={onRangeTraitSelect}
				onRangeChange={onRangeChange}
				performSearch={performSearch} 
			/>
    </section>
	);
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

		console.log("Index loader: dbQuery = ", dbQuery);
		const poets = await prisma.poet.findMany({ ...dbQuery });
		return json({ poets });

	} catch (error: unknown) {
		console.error('Loader error:', error);
		let errorDetail;
	  if (error instanceof Error) {
			// Fallback for general errors
			errorDetail = {
					message: error.message,
			};
		} else {
				// Handle unknown errors
				errorDetail = {
						message: 'An unknown error occurred',
				};
				console.error('An unknown error occurred', error);
		}
		return json({ 
			error: "Server Error. Index route, loader: LoadFunction. Please contact Support.", 
			detail: errorDetail
		}, { status: 500 });
	}
};

function Index() {
	const fetcher = useFetcher();
	const initialData = useLoaderData<typeof loader>();

  console.log("******************* const poets: Poet[] = data.poets, fetcher.data ", fetcher.data); 
	console.log("******************* const poets: Poet[] = data.poets, initialData.poets.length", initialData.poets.length); 

  const [currentDbQuery, setCurrentDbQuery] = useState<SearchCriteria>({ orderBy: [{ pid: 'asc' }], take: PAGE_SIZE, skip: 0 });
	const [poets, setPoets] = useState<Poet[]>(initialData.poets || []);
	const [page, setPage] = useState(1); // Pagination state
	const [fetcherData, setFetcherData] = useState<LoaderData | null>(null);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [sentinelIndex, setSentinelIndex] = useState<number>(PAGE_SIZE - 1);
	
	const globalObserver = useRef<IntersectionObserver | null>(null);

	/*************** Infinite scroll logic ****************/

	// fetcher.data useEffect
	// In the useFetcher hook, the fetcher.data property is automatically managed
	// by Remix based on the lifecycle of the fetch operation and it can not directly
	// be set to null. Copy it to a fetcherData state and use that state to control
	// the infinite scrolling
  useEffect(() => {
		const data = fetcher.data as LoaderData;
		try {
			if (data && data.poets.length > 0) {
				setFetcherData(data);
				if (data.poets.length < PAGE_SIZE) { setHasMore(false) }
				setFetchError(null);
				console.log("fetcher.data useEffect fetcher.data.poets.length = ", data.poets.length);
			}
		} catch (error) {
			console.error(error);
    	setFetchError('A fetcher error occurred.');
		}
  }, [fetcher.data]);

	// fetchMorePoets
	const fetchMorePoets = useCallback((nextPage: boolean = false) => {
		if (!nextPage) return; 

		const newSkip = nextPage ? (page) * PAGE_SIZE : 0;
		const newQuery: SearchCriteria = { ...currentDbQuery, skip: newSkip, take: PAGE_SIZE };
		console.log("<--------> fetchMorePoets newQuery = ", newQuery);

		if (globalObserver.current && nextPage) {
			globalObserver.current.disconnect(); // Temporarily disconnect
			console.log("fetchMorePoets --- globalObserver.current.disconnect");
		}
		
		setCurrentDbQuery(newQuery);		// Update current query skip

		const queryString = JSON.stringify(newQuery);
		const dbQueryString = new URLSearchParams({ query: queryString }).toString();
		fetcher.load(`?index&${dbQueryString}`);

		setPage(prev => prev + 1);
		console.log("fetchMorePoets --- page = ", page);

	}, [page, currentDbQuery, fetcher]);

	// setupObserver callback
	const setupObserver = useCallback((sentinelSelector: string) => {
		console.log("setupObserver sentinelSelector = ", sentinelSelector);

		// Disconnect the current observer if it exists
		if (globalObserver.current) {
			globalObserver.current.disconnect();
			console.log("setupObserver globalObserver.current.disconnect() = ", globalObserver.current);
		}
		
		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			if (entries[0].isIntersecting) {
				fetchMorePoets(true);
			}
		};

		const observerOptions = { threshold: 0.1 };
		const observer = new IntersectionObserver(observerCallback, observerOptions);

		const sentinel = document.querySelector(sentinelSelector);
		if (sentinel) {
			observer.observe(sentinel);
			console.log("setupObserver observer.observe(sentinel) sentinelSelector = ", sentinelSelector);
		}

		// Assigning observer to globalObserver for later access
		globalObserver.current = observer;
		console.log("setupObserver globalObserver.current = sentinelSelector = ", sentinelSelector);
	}, [fetchMorePoets]);

	// InitialData useEffect
	useEffect(() => {
		console.log("InitialData useEffect --- initialData.poets.length = ", initialData.poets.length, "poets.length = ", poets.length);
		if (initialData.poets.length > 0) {
      // This ensures observer is setup only after initial data is loaded
      // and if globalObserver is initialized 
      if (!globalObserver.current && initialData.poets.length === PAGE_SIZE) {
				console.log("InitialData useEffect setupObserver #poet-$initialData.poets[19].pid");
        setupObserver(`#poet-${initialData.poets[19].pid}`);
      }
    }
	}, [poets, initialData.poets, setupObserver]); // Depends on the initial poets list.

	// Merge fetcherData useEffect
	useEffect(() => {
		console.log("---- Merge fetcherData useEffect ----");
		if (fetcherData) {
			if (!fetcherData.error) {
				if (fetcherData.poets && fetcherData.poets.length > 0) {
					setPoets((prevPoets: Poet[]) => [...prevPoets, ...fetcherData.poets]);
					setFetcherData(null);
					console.log("Merge fetcherData useEffect --- setPoets append new poets");
				} 
				setFetchError(null);
			} else { 
				console.log("Merge fetcherData useEffect --- data.error");
				console.error(fetcherData.error);
				setFetchError(fetcherData.error);
			}
		}
	}, [fetcherData]);
	
	// newSentinelIndex useEffect
	useEffect(() => {
		if (poets && poets.length > 0) {
			console.log("sentinelIndex useEffect --- poets.length = ", poets.length, "hasMore = ", hasMore);
			const lastPoetIndex = poets.length - 1;
			console.log("sentinelIndex useEffect --- lastPoetIndex = ", lastPoetIndex, "sentinelIndex = ", sentinelIndex);
			// Make sure that new poets have been fetched and appended to poets buffer before setting up a new observer
			if (lastPoetIndex !== sentinelIndex && hasMore) {
				setSentinelIndex(lastPoetIndex);
				console.log("sentinelIndex useEffect #poet-$poets[sentinelIndex]?.pid sentinelIndex = ", lastPoetIndex);
				setupObserver(`#poet-${poets[lastPoetIndex]?.pid}`);
			}
		}
	}, [poets, sentinelIndex, hasMore, setupObserver]);

	/*************** SidebarPanel callback logic ****************/

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const initialTraitDbField = sidebarItems[0].expandedSidebarItems[0].dbField;
	const [searchTrait, setSearchTrait] = useState({ searchTraitKey: initialTraitDbField, searchTraitValue: '' });
	const [selectedRareTrait, setSelectedRareTrait] = useState<string | null>(null);
	const [selectedRangeTrait, setSelectedRangeTrait] = useState<string | null>(null);
	const [rangeValues, setRangeValues] = useState<Record<string, { min?: number; max?: number }>>({});

	// searchButtonPressed is used to conditionally control displaying the Rare Trait count on the ImageCard 
	const [searchButtonPressed, setSearchButtonPressed] = useState(false);

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

	// Callback from SidebarPanel when the user clicks the Search button or Clear button
	const performSearch = (query: SearchCriteria) => {

		// Signal that a search has been initiated. This state conditionally controls displaying the Rare Trait count on the ImageCard 
		setSearchButtonPressed(true);

		// Reset all the states and fetch the new query
		query.take = PAGE_SIZE;

		if (query.where !== undefined) {			// All new searches include where:, start at the beginning
			query.skip = 0
			setPage(1);
			console.log("performSearch query.skip = ", query.skip, "page = ", page);
		} else {															// User pressed Clear button, skip to a random place in the DB 
			const newPage = (Math.floor(Math.random() * (DATABASE_SIZE-100)/PAGE_SIZE));
			setPage(newPage);
			query.skip = (newPage - 1) * PAGE_SIZE;
			console.log("performSearch query.skip = ", query.skip, "page = ", page, "newPage = ", newPage);
		}

		setHasMore(true);
		setFetcherData(null);
		setPoets([]);
		setSentinelIndex(0);		// sentinelIndex must not equal the index in setupObserver

		setCurrentDbQuery(query);
		console.log('performSearch: query));', query);
		
		const queryString = JSON.stringify(query);
  	const dbQueryString = new URLSearchParams({ query: queryString }).toString();
		
		// Use fetcher.load to initiate the request
		fetcher.load(`?index&${dbQueryString}`);              // Note: the following doesn't work: fetcher.load(`/?${queryString}`);
  };

	// Callback from SidebarPanel when the user selects a searchTrait and sets its value
	const handleSearchTraitChange = (searchTraitState: { searchTraitKey: string; searchTraitValue: string }) => {
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

	// Extract title from sidebarItems based on item.type === 'sort' and expanded item.dbField
	//const selectedRareTraitLabel = sidebarItems.find(item => item.type === 'sort')?.expandedSidebarItems.find(item => item.dbField === selectedRareTrait)?.title;
	// Example logic to convert 'brdCnt' into 'brd', etc.
	const selectedRareTraitLabel = selectedRareTrait ? selectedRareTrait.replace("Cnt", "") : undefined;

  return (
		<ErrorBoundary>
		<div className="flex">
			{sidebarOpen && (
        <Sidebar
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
      )}
			<div className="flex flex-col w-full">
				<Navbar toggleSidebar={toggleSidebar} />
				<div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
					<div className="mt-4 px-4">
						{/* Display loading state */}
						{fetcher.state === 'loading' && <div>Loading...</div>}

						{/* Display error state */}
						{fetchError && (
							<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
								<p className="font-bold">Error</p>
								<p>{fetchError}</p>
							</div>
						)}

						<div className="grid grid-cols-4 gap-4">
							{poets?.map((poet: Poet, index: number) => (
								<div key={poet.id} id={`poet-${poet.pid}`}>
									<ImageCard 
										key={poet.pid} 
										poet={poet}
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
		</ErrorBoundary>
  );
}

export default Index;