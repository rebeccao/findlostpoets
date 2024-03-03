import { useLoaderData, useFetcher } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import React, { useState } from 'react';
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
	console.log('Index loader: start');
	try {
		const url = new URL(request.url);

		let dbQuery: SearchCriteria = { orderBy: [{ pid: 'asc' }] }; // query on first load
		
		const searchQuery = url.searchParams.get("query");
		console.log('Index loader: Received searchQuery:', searchQuery);

		let skip = 0; // Default value
		let take = 20; // Default value

		if (searchQuery) {
				try {
						const dbSearchQuery = JSON.parse(decodeURIComponent(searchQuery));
						console.log('Index loader: Parsed dbSearchQuery:', dbSearchQuery);

						// Now extract skip and take directly from the parsed Prisma query, if they exist
						if (dbSearchQuery.skip !== undefined) {
								skip = dbSearchQuery.skip;
						}

						if (dbSearchQuery.take !== undefined) {
								take = dbSearchQuery.take;
						}

						// Ensure the rest of the dbSearchQuery is applied to dbQuery excluding skip and take
						const { skip: _, take: __, ...restQuery } = dbSearchQuery;
						if (Object.keys(restQuery).length > 0) {
								dbQuery = { ...dbQuery, ...restQuery };
						}
				} catch (error) {
						console.error('Index loader: Error parsing criteriaParam:', error);
						// Consider returning an error response or handling the error gracefully
				}
		}		

		console.log('Index skip = ', skip);

		const poets = await prisma.poet.findMany({
			...dbQuery,
			skip, 
			take,
		});
		return json({ poets });
	} catch (error) {
		console.error(error);
		// Return an error response with a status code, e.g., 400 for a bad request or 500 for server error
		return json({ error: "500 Internal Server Error. Failed to load poets due to a server error. Index route, loader: LoadFunction. Please contact Support." }, { status: 500 });
	}
};

function Index() {
	const fetcher = useFetcher();
	const initialData = useLoaderData<typeof loader>();

  // Determine the current state: data from fetcher if present, otherwise from the initial load
  const { poets, error } = fetcher.data || initialData;
	console.log("******************* const poets: Poet[] = data.poets, fetcher.data ", fetcher.data); // Check the structure of 'data'
	console.log("******************* const poets: Poet[] = data.poets, initialData ", initialData); 

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
		query.where !== undefined ? query.skip = 0 : query.skip = (Math.floor(Math.random() * 28149) + 1);
		
		const queryString = JSON.stringify(query);
    console.log('Index performSearch: queryString));', queryString);

		// Signal that a search has been initiated. This state conditionally controls displaying the Rare Trait count on the ImageCard 
		setSearchButtonPressed(true);
    
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
						{poets?.map((poet: Poet) => (
							<ImageCard 
								key={poet.pid} 
								poet={poet} 
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