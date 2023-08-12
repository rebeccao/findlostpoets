import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import React, { useState } from 'react';
import ImageCard from '~/components/image-card';
import { getPoets } from '~/utils/poet.server';
import {HiMenuAlt3} from 'react-icons/hi';

function Sidebar() {
	return (
		<section className="top-navbar shadow-inner-top-left translate-x-0 fixed left-0 h-full w-64 p-4 bg-gray-100 transform transition-transform duration-300">
      {/* Search Filters */}
      <h2>Search Attributes</h2>
			<p>Where is the trext?</p>
      {/* Add your search filters and form inputs here */}
    </section>
	);
}

interface NavbarProps {
  toggleSidebar: () => void;
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
export const loader = async () => {
	return json(await getPoets())
}
function About() {

	const poets = useLoaderData<typeof loader>();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
		<div className="flex">
			{sidebarOpen && <Sidebar />}
			<div className="flex flex-col w-full">
				<Navbar toggleSidebar={toggleSidebar} />
				<div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
					<div className="mt-4 px-4">
						<div className="grid grid-cols-3 gap-4">
							{poets.map(poet => (
								<ImageCard key={poet.pid} poet={poet} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
  );
}

export default About;