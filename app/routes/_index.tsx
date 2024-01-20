import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/utils/prisma.server'
//import { json } from '@remix-run/node'
import React, { useState, useEffect } from 'react';
import SidebarPanel from '~/components/sidebar/sidebar-panel';
import ImageCard from '~/components/image-card';
//import { getPoets, getOnePoet } from '~/utils/poet.server';
import {HiMenuAlt3} from 'react-icons/hi';
//import {AiOutlineClose} from 'react-icons/ai';

export type SearchCriteria =
	{ [field: string]: any } 
  | 
  { [condition: string]: { [field: string]: any } };

interface SidebarProps {
  setSearchCriteria: (newCriteria: SearchCriteria) => void;
}

interface NavbarProps {
  toggleSidebar: () => void;
}

function Sidebar({ setSearchCriteria }: SidebarProps): JSX.Element {
	return (
		<section className="top-navbar shadow-inner-top-left translate-x-0 fixed left-0 h-full w-64 p-4 bg-gray-100 transform transition-transform duration-300">
      {/* Search Filters */}
      <SidebarPanel onSelectionChange={(newCriteria: SearchCriteria) => {
				console.log('Sidebar: passing new criteria to setSearchCriteria');
				setSearchCriteria(newCriteria);
			}} />
      {/* Add your search filters and form inputs here */}
    </section>
	);
}

function Navbar({ toggleSidebar }: NavbarProps) {
	return(
		<header className="sticky top-0 z-[1] h-navbar mx-auto bg-gray-100 border-b border-gray-200 p-2 shadow-md flex w-full justify-between items-center  font-sans font-bold uppercase text-white-100 dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary">
			<div className="flex items-center">
				<button onClick={toggleSidebar} className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gray-300 hover:bg-gray-400">
					<HiMenuAlt3 size={26} className="cursor-pointer text-white" />
				</button>
			</div>
			{/* Rest of Navbar */}
		</header>
	);
}

export const loader = async ({ searchCriteria }: { searchCriteria: SearchCriteria }) => {
	const data = await prisma.poet.findMany ({
		...searchCriteria,
		skip: 20,
		take: 21,
	})	
	return data;
}

function Index() {

	const initialData = useLoaderData<typeof loader>();
	const [poets, setPoets] = useState<any[]>(initialData || []);
	const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({ orderBy: { pid: 'asc' } });
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

	useEffect(() => {
		// Use loader function to fetch data based on searchCriteria
		const fetchData = async () => {
			console.log('Index: useEffect fetchData with searchCriteria: ', searchCriteria);
			const results = await loader({ searchCriteria });
			console.log('Index: useEffect fetchData complete, poets : ', results);
			setPoets(results);
		};
		
		fetchData();
 	}, [searchCriteria]); 

	function setSearchCriteriaWrapper(newCriteria: SearchCriteria) {
		console.log('Index: setSearchCriteria called with:', newCriteria);
		setSearchCriteria(newCriteria);
	}

  return (
		<div className="flex">
			{sidebarOpen && <Sidebar setSearchCriteria={setSearchCriteriaWrapper}/>}
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