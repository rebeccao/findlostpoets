import { useLoaderData, useNavigate } from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import React, { useState } from 'react';
import SidebarPanel from '~/components/sidebar/sidebar-panel';
import ImageCard from '~/components/image-card';
import {HiMenuAlt3} from 'react-icons/hi';
import type { Poet } from '@prisma/client'

export type SearchCriteria =
	{ [field: string]: any } 
  | 
  { [condition: string]: { [field: string]: any } }
	|
	{ orderBy?: { [key:string]: 'asc' | 'desc'; }; skip?: number; take?: number; };

interface NavbarProps {
  toggleSidebar: () => void;
}

function Navbar({ toggleSidebar }: NavbarProps) {
	return(
		<header className="sticky top-0 z-[1] h-navbar mx-auto bg-gray-100 border-b border-gray-200 p-2 shadow-md flex w-full justify-between items-center  font-sans font-bold uppercase text-white dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary">
			<div className="flex items-center">
				<button 
				  onClick={toggleSidebar} 
					className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gray-300 hover:bg-gray-400"
					aria-label='Toggle Sidebar'
				>
					<HiMenuAlt3 size={26} className="cursor-pointer text-white" />
				</button>
			</div>
			{/* Rest of Navbar */}
		</header>
	);
}

function Sidebar() {
	const navigate = useNavigate();

	const handleSelectionChange = (dbQuery: SearchCriteria) => {
		const criteriaString = JSON.stringify(dbQuery);
    console.log('Index handleSelectionChange: Criteria as string:', criteriaString);
    
		// Convert the criteria to a query string
		const queryString = new URLSearchParams({ criteria: criteriaString }).toString();
		//console.log('Index handleSelectionChange: Expected fetch URL:', `${window.location.pathname}?${queryString}`);
		
		// Navigate to the current route with new query parameters
		navigate(`/?${queryString}`);
  };

	return (
		<section className="top-navbar shadow-inner-top-left translate-x-0 fixed left-0 h-full w-64 p-4 bg-gray-100 transform transition-transform duration-300">
			{/* Input and selection components here, triggering handleSelectionChange on change */}
			{/* Search Filters */}
			<SidebarPanel onSelectionChange={handleSelectionChange} />
    </section>
	);
}

export const loader: LoaderFunction = async ({ request }) => {
	console.log('Index loader: start');
	try {
		const url = new URL(request.url);

		console.log('Index loader: Request URL:', url.toString());
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
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

	const data = useLoaderData<typeof loader>();
	// If there's an error key in the data, it means something went wrong.
  if (data.error) {
    // Splitting the error message into lines for styling
    const errorMessageLines = data.error.split(". ");
    return (
      <div className="flex items-start justify-center h-screen">
        <div className="text-center pt-32 space-y-2">
          {errorMessageLines.map((line: string, index: number) => (
            <p key={index} className={`${index === 0 ? 'text-lg font-semibold' : 'text-md'}`}>
              {line}{index < errorMessageLines.length - 1 ? '.' : ''}
            </p>
          ))}
        </div>
      </div>
    );
  }

  console.log("******************* const poets: Poet[] = data.poets; "); // Check the structure of 'data'
  const poets: Poet[] = data.poets; // Assuming 'poets' is expected to be a key in the object returned by the loader

  return (
		<div className="flex">
			{sidebarOpen && <Sidebar />}
			<div className="flex flex-col w-full">
				<Navbar toggleSidebar={toggleSidebar} />
				<div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
					<div className="mt-4 px-4">
						<div className="grid grid-cols-3 gap-4">
							{poets && poets.map(poet => (
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