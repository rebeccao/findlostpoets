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
  orderBy?: { [key: string]: 'asc' | 'desc' };
};

export interface SidebarProps {
	selectedRareTraitCheckboxes: Record<string, boolean>;
	searchTrait: Record<string, string>;
	selectedRanges: Record<string, { min?: number; max?: number; isSelected: boolean }>;
	onRareTraitCheckboxChange: (checkboxState: Record<string, boolean>) => void;
	onSearchTraitChange: (searchTraitState: { searchTraitKey: string; searchTraitValue: string }) => void;
	onRangeChange: (rangeState: Record<string, { min: number; max: number; isSelected: boolean }>) => void;
	onSelectionChange: (dbQuery: SearchCriteria) => void;
}

interface NavbarProps {
  toggleSidebar: () => void;
}

function Navbar({ toggleSidebar }: NavbarProps) {
	return(
		<header className="sticky top-0 z-[1] h-navbar mx-auto bg-gray-100 border-b border-gray-200 p-2 shadow-md flex w-full justify-between items-center  font-sans font-bold uppercase text-white dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary">
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
	selectedRareTraitCheckboxes, 
	searchTrait, 
	selectedRanges,
	onRareTraitCheckboxChange, 
	onSearchTraitChange, 
	onRangeChange,
	onSelectionChange }: SidebarProps) 
	{
	return (
	<section className="fixed left-0 bottom-0 w-80 bg-gray-100 sidebar">
			<SidebarPanel 
				selectedRareTraitCheckboxes={selectedRareTraitCheckboxes}
				searchTrait={searchTrait}
				selectedRanges={selectedRanges}
				onRareTraitCheckboxChange={onRareTraitCheckboxChange}
				onSearchTraitChange={onSearchTraitChange}
				onRangeChange={onRangeChange}
				onSelectionChange={onSelectionChange} 
			/>
    </section>
	);
}

export const loader: LoaderFunction = async ({ request }) => {
	console.log('Index loader: start');
	try {
		const url = new URL(request.url);

		let searchCriteria: SearchCriteria = { orderBy: { pid: 'asc' } }; // Default criteria
		
		const criteriaParam = url.searchParams.get("criteria");
		console.log('Index loader: Received criteriaParam:', criteriaParam);

		if (criteriaParam) {
			try {
				const criteria = JSON.parse(decodeURIComponent(criteriaParam!));
				console.log('Index loader: Parsed criteria:', criteria);
				if (Object.keys(criteria).length > 0) {
					searchCriteria = { ...searchCriteria, ...criteria };
				}
			} catch (error) {
					console.error('Index loader: Error parsing criteriaParam:', error);
					// Consider returning an error response or handling the error gracefully
			}
		}

		const poets = await prisma.poet.findMany({
			...searchCriteria,
			skip: 0, 
			take: 21,
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
  //const isFetching = fetcher.state === 'submitting';
	const initialData = useLoaderData<typeof loader>();

  // Determine the current state: data from fetcher if present, otherwise from the initial load
  const { poets, error } = fetcher.data || initialData;
	console.log("******************* const poets: Poet[] = data.poets, fetcher.data ", fetcher.data); // Check the structure of 'data'
	console.log("******************* const poets: Poet[] = data.poets, initialData ", initialData); 

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selectedRareTraitCheckboxes, setSelectedRareTraitCheckboxes] = useState<Record<string, boolean>>({});
	const initialTraitDbField = sidebarItems[0].expandedSidebarItems[0].dbField;
	const [searchTrait, setSearchTrait] = useState({ searchTraitKey: initialTraitDbField, searchTraitValue: '' });
	const [rangeSelections, setRangeSelections] = useState<Record<string, { min: number; max: number; isSelected: boolean }>>({});

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

	const handleSelectionChange = (dbQuery: SearchCriteria) => {
		const searchCriteriaString = JSON.stringify(dbQuery);
    console.log('Index handleSelectionChange: searchCriteriaString));', searchCriteriaString);
    
		// Convert the criteria to a query string
		const queryString = new URLSearchParams({ criteria: searchCriteriaString }).toString();
		
		// Use fetcher.load to initiate the request
		fetcher.load(`?index&${queryString}`);              // Note: this does not work: fetcher.load(`/?${queryString}`);
  };

	// Handlers for updating the sidebar states, which will be passed down
  const handleRareTraitCheckboxChange = (checkboxState: Record<string, boolean>) => {
    setSelectedRareTraitCheckboxes(checkboxState);
  };

  const handleSearchTraitChange = (searchTraitState: { searchTraitKey: string; searchTraitValue: string }) => {
    setSearchTrait(searchTraitState);
		console.log("Index: handleSearchTraitChange searchTraitState: ", searchTraitState);
  };

	const handleRangeChange = (newRange: Record<string, { min: number; max: number; isSelected: boolean }>) => {
		console.log("******Index: handleRangeChange newRange = ", newRange);
    setRangeSelections(prev => {
			// Map over the keys in newRange to correctly merge the new values with the existing ones
			const updatedRanges = { ...prev };
			Object.keys(newRange).forEach(key => {
					updatedRanges[key] = { 
							...prev[key], 
							...newRange[key],
					};
			});
			return updatedRanges;
		});
		console.log("******Index: handleRangeChange rangeSelections = ", rangeSelections);
  };

  return (
		<div className="flex">
			{sidebarOpen && (
        <Sidebar
          selectedRareTraitCheckboxes={selectedRareTraitCheckboxes}
          searchTrait={searchTrait}
					selectedRanges={rangeSelections}
          onRareTraitCheckboxChange={handleRareTraitCheckboxChange}
          onSearchTraitChange={handleSearchTraitChange}
					onRangeChange={handleRangeChange}
					onSelectionChange={handleSelectionChange} 
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

						<div className="grid grid-cols-3 gap-4">
						{poets?.map((poet: Poet) => (
							<ImageCard key={poet.pid} poet={poet} />
						))}
						</div>
					</div>
				</div>
			</div>
		</div>
  );
}

export default Index;