import { useState } from 'react';
import { Link, Outlet } from "@remix-run/react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  function Header() {
    return (
			<header className="p-4 bg-indigo-600 text-white flex justify-between items-center">
				<h1>Logo</h1>
				<MenuButton />
				{isOpen && <Sidebar />}
			</header>
		);
	}
      
	function handleClick() {
		setIsOpen(!isOpen);
		alert("WTF!");
		console.log('button clicked');
	}

	function MenuButton() {
		return (
			<button className="p-2" onClick={handleClick}>
				<Bars3Icon className="h-6 w-6" />
			</button>
		);
	}
	
  function Sidebar() {
    return (
			<div className={`fixed top-0 bottom-0 left-0 z-20 transition-transform transform-gpu ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				<div className="h-full w-64 bg-white shadow-lg">
					<button
						className="p-4"
					>
						<XMarkIcon className="h-6 w-6" />
					</button>
					<nav>
						<Link to="/" className="block px-4 py-2 hover:bg-gray-300">Home</Link>
						{/* Add more links as needed */}
					</nav>
        </div>
  	 </div>
    );
    }

	const [count, setCount] = useState(0);
	return (
	  <div className="h-screen bg-slate-700 flex justify-center items-center">
		<h2 className="text-blue-600 font-extrabold text-5xl">TailwindCSS Is Working!</h2>
		<p>{count}</p>
		<button onClick={() => setCount(count + 1)}>Increment</button>
		<button onClick={() => setCount(count - 1)}>Decrement</button>
	  </div>
	);
}
  
  