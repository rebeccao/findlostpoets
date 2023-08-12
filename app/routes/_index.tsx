// app/routes/_index.tsx
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { Layout } from '~/components/layout'
//import { SearchPanel } from '~/components/search-panel'
//import { getPoetBreed, getPoetCount } from '~/utils/poet.server'
import { getPoets } from '~/utils/poet.server'
import { useState } from 'react';

export const loader = async () => {
  return json(await getPoets())
}

export default function Index() {
    const [filterSidebarOpen, setFilterSidebarOpen] = useState(true);

    function handleShowFilterSidebar() {
      setFilterSidebarOpen(!filterSidebarOpen);
      alert(`You clicked me! ${filterSidebarOpen}`);
    }

    function NavBar() {
        return (
            <nav className="bg-blue-500 p-4 flex justify-between items-center">
                <button 
                    className="bg-white p-2 rounded" 
                    onClick={handleShowFilterSidebar}
                >
                    {filterSidebarOpen ? 'Hide' : 'Show'} Poet Filters
                </button>
      
                {/* Other navigation items... */}
            </nav>
        );
    }

    function FilterSidebar() {
        //const [filters, setFilters] = useState({ /* initial filter state */ });
        // Set up filters as an object where each key is a filter name and the 
        // corresponding value is the filter state.
    
        // Update the filters as needed
    
        return (
          <aside className={`h-full overflow-auto flex-grow bg-gray-200 fixed left-0 transform transition-transform duration-200 ease-in-out`}>
            {/* Render the filters */}
          </aside>
        );
    }
    
    function ImageFeed() {
        // Handle infinite scrolling using IntersectionObserver API or a library
        const poets = useLoaderData<typeof loader>();
        return (
          <main className="p-4 flex-grow overflow-auto">
           {poets.map(poet => (
             <img 
                key={poet.pid} 
                src={poet.g0ThUrl} 
                alt={poet.pNam} 
                className="w-full h-auto"
              />
            ))}
        </main>
      );
    }

    return (
      <Layout>
        <div className="flex flex-col h-screen">
            <NavBar />
            {filterSidebarOpen && <FilterSidebar />}
            <ImageFeed />
            <FilterSidebar />
        </div>
      </Layout>
    );
}