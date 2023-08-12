// app/components/search-panel.tsx
import type { Poet } from '@prisma/client'

export function SearchPanel({ poets }: { poets: Poet[] }) {
    return (
      <div className="w-1/6 bg-gray-200 flex flex-col">
        <div className="text-center bg-gray-300 h-20 flex items-center justify-center">
          <h2 className="text-xl text-blue-600 font-semibold">Search Filter</h2>
        </div>
        <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-10">
          <p>Filters go here</p>
          {poets?.map((poet) => (
            <div key={poet.pid}>{poet.pNam} </div>
          ))}
        </div>
        <div className="text-center p-6 bg-gray-300">
          {/*
          <button
            type="submit"
            className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          >
            Sign Out
          </button>*/}
        </div>
      </div>
    )
  }
  