import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Top100List from '~/components/top100list';
import { prisma } from '~/utils/prisma.server'
import type { TopCollector } from '@prisma/client';

export const loader: LoaderFunction = async () => {
  // Fetch the precomputed top 100 collectors from the TopCollectors collection
  try {
    // Fetch the precomputed top 100 collectors from the TopCollectors collection
    const topCollectors: TopCollector[] = await prisma.topCollector.findMany();
    return json(topCollectors);
  } catch (error) {
    console.error("Error fetching topCollectors: ", error);
    return json([]);
  }
};

const Top100 = () => {
  const topCollectors = useLoaderData<TopCollector[]>();

  return (
    <div className="min-h-screen flex flex-col justify-center border bg-darkgray border-deepgray text-pearlwhite">
      <div className="text-center items-center pt-8 pb-4">
        <h1 className="text-2xl font-light">Top 100 LostPoets Collectors</h1>
      </div>
      <div className="flex-grow font-extralight">
        {topCollectors.length === 0 ? (
          <p className="text-center">No collectors found.</p>
        ) : (
          <Top100List collectors={topCollectors} height="max-h-[calc(100vh-11rem)]" />
        )}
      </div>
    </div>
  );
};

export default Top100;