import { useLoaderData, useFetcher } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import SidebarPanel from '~/components/sidebar/sidebar-panel';
import ImageCard from '~/components/image-card';
import {HiMenuAlt3} from 'react-icons/hi';
import type { Poet } from '@prisma/client';
import { sidebarItems } from "~/components/sidebar/sidebar-data";
import '~/tailwind.css';

export type SearchCriteria = {
  where?: { [key: string]: any };
  skip?: number;
  take?: number;
  orderBy?: { [key: string]: 'asc' | 'desc' }[];
};

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

		let dbQuery: SearchCriteria = { orderBy: [{ pid: 'asc' }], skip: 0, take: 20 }; // query on first load
		
		const searchQuery = url.searchParams.get("query");
		console.log('Index loader: Received searchQuery:', searchQuery);

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

  // Determine the current state: data from fetcher if present, otherwise from the initial load
  const { poets, error } = fetcher.data || initialData;
	console.log("******************* const poets: Poet[] = data.poets, fetcher.data ", fetcher.data); // Check the structure of 'data'
	console.log("******************* const poets: Poet[] = data.poets, initialData ", initialData); 

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [currentDbQuery, setCurrentDbQuery] = useState<SearchCriteria>({ orderBy: [{ pid: 'asc' }], take: 20, skip: 0 });

  interface PaginationState {
    skip: number;
    take: number;
    hasMore: boolean;
  }

  const [pagination, setPagination] = useState<PaginationState>({
    skip: 0,
    take: 20, // Adjust according to your initial page size
    hasMore: true,
  });

	/*************** Infinite scroll logic ****************/

	const fetchMorePoets = useCallback(() => {
		if (fetcher.state !== 'idle' || !pagination.hasMore) return;
	
		console.log("fetchMorePoets pagination.skip = ", pagination.skip);
		const nextSkip = pagination.skip + pagination.take;
		console.log("fetchMorePoets nextSkip = ", nextSkip);
		
		const updatedQuery = { ...currentDbQuery, skip: nextSkip };
		const queryString = encodeURIComponent(JSON.stringify(updatedQuery));
		fetcher.load(`?index&query=${queryString}`);
	}, [fetcher, pagination, currentDbQuery]);

	// Set up the IntersectionObserver to fetchMorePoets when the sentinel element
	// becomes fully visible and there are additional poets are available to fetch
  useEffect(() => {
		console.log("IntersectionObserver --- useEffect");
		console.log("IntersectionObserver --- pagination.hasMore = ", pagination.hasMore);
		console.log("IntersectionObserver --- fetcher.state = ", fetcher.state);

		// Only create the observer if we have more items to fetch
		if (!pagination.hasMore) return;
	
		const observer = new IntersectionObserver((entries) => {
			console.log("IntersectionObserver --- entries[0].isIntersecting = ", entries[0].isIntersecting);
			// Check if the sentinel is visible
			if (entries[0].isIntersecting && fetcher.state === 'idle') {
				fetchMorePoets();
			}
		}, { 
			threshold: 0.1, // Slightly above 0 to require a bit more of the element to be visible
			rootMargin: '100px' // Trigger before the sentinel is actually reached
		});
	
		const currentSentinel = sentinelRef.current;

    // Attach the observer if the fetcher is idle
    if (currentSentinel && fetcher.state === 'idle') {
      observer.observe(currentSentinel);
			console.log("IntersectionObserver --- observer.observe(currentSentinel)")
    }

    return () => {
      // Detach the observer when the component unmounts or if fetcher starts loading
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
				console.log("IntersectionObserver --- observer.observe(currentSentinel)")
      }
    };
  }, [pagination.hasMore, fetcher.state, fetchMorePoets]);

	// handle the response from the fetch operation to update pagination.
	useEffect(() => {
		console.log("pagination --- useEffect");
		//console.log("fetcher.data length = ", fetcher.data.length);
		console.log("pagination --- fetcher.state = ", fetcher.state);
		// Check if there's a recent fetch operation and it's completed with data
		if (fetcher.data && fetcher.state === 'idle') {
			// Assuming fetcher.data includes the fetched poets and possibly an indication of whether more poets are available
			// const hasMore = fetcher.data.length === pagination.take; // Simple check; adjust based on actual logic needed
			const hasMore = true; // Add hasMore logic once the inifinite scrolling is working  
	
			setPagination((prevPagination) => ({
				...prevPagination,
				skip: prevPagination.skip + prevPagination.take, // Update skip to the next set of items
				hasMore, // Update based on actual condition to determine if more items are available
			}));
			console.log("pagination --- pagination.skip = ", pagination.skip);
		}
	}, [fetcher.data, fetcher.state]);

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

	// Callback from SidebarPanel when the user clicks the Search button
	const performSearch = (query: SearchCriteria) => {

		// Signal that a search has been initiated. This state conditionally controls displaying the Rare Trait count on the ImageCard 
		setSearchButtonPressed(true);

		query.where !== undefined ? query.skip = 0 : query.skip = (Math.floor(Math.random() * 28149) + 1);

		setCurrentDbQuery(query);
		console.log('Index performSearch: query));', query);
		
		//const queryString = JSON.stringify(query);
  	//const dbQueryString = new URLSearchParams({ query: queryString }).toString();
		
		// Serialize and encode the query
		const dbQueryString = encodeURIComponent(JSON.stringify(query));
		
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
						{error && <div className="error">Error: {error}</div>}

						<div className="grid grid-cols-4 gap-4">
						{poets?.map((poet: Poet, index: number) => (
							<ImageCard 
								key={poet.pid} 
								poet={poet}
								ref={index === poets.length - 1 ? sentinelRef : undefined} // Assign ref to last poet
								// Dynamically access the Poet property
								rarityTraitLabel={searchButtonPressed ? `${poet[selectedRareTraitLabel as keyof Poet]}` : undefined}
								// Dynamically access the rarity count
								rarityCount={searchButtonPressed && selectedRareTrait ? poet[selectedRareTrait as keyof Poet] as number : undefined}
							/>
						))}
						</div>
					</div>
				</div>
			</div>
		</div>
  );
}

export default Index;