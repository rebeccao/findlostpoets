import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import TopCollectorsList from '~/components/topcollectorslist';
import { prisma } from '~/utils/prisma.server'
import type { Collector } from '@prisma/client';
import { customLog } from '~/root';

export const loader: LoaderFunction = async () => {
  try {
    // Fetch the top 200 collectors
    const collectors: Collector[] = await prisma.collector.findMany({
      take: 200,
      orderBy: {
        count: 'desc',
      },
    });

    // Get the count of the 200th collector
    const countOf200th = collectors[199].count;

    // Fetch all collectors with the same count as the 200th collector
    const collectorsWithCountOf200th: Collector[] = await prisma.collector.findMany({
      where: {
        count: countOf200th,
      },
      orderBy: {
        count: 'desc',
      },
    });
    console.log("Number of collectors with CountOf200th: ", collectorsWithCountOf200th.length);

    // Step 4: Filter additional collectors to remove duplicates
    const filteredAdditionalCollectors = collectorsWithCountOf200th.filter(
      filteredCollector => filteredCollector.count === countOf200th && !collectors.some(collector => collector.oAddr === filteredCollector.oAddr)
    );

    // Log the count of filtered additional collectors
    console.log("Number of nonduplicate collectors with CountOf200th: ", filteredAdditionalCollectors.length);

    // Step 5: Combine results and ensure no duplicates
    const combinedCollectors = [
      ...collectors,
      ...filteredAdditionalCollectors
    ];

    customLog('TopCollectorsLoader', `++++++  TopCollectors loader: {take: ${combinedCollectors.length}, orderBy:{count: desc}}`);
    return json(combinedCollectors);
  } catch (error) {
    console.error("Error fetching topCollectors: ", error);
    return json([]);
  }
};

const TopCollectors = () => {
  const topCollectors = useLoaderData<Collector[]>();

  return (
    <div className="min-h-screen flex flex-col justify-center border bg-closetoblack border-deepgray text-pearlwhite">
      <div className="text-center items-center pt-8 pb-4">
        <h1 className="text-2xl font-light">Top {topCollectors.length} LostPoet Collectors</h1>
      </div>
      <div className="flex-grow font-extralight px-5">
        {topCollectors.length === 0 ? (
          <p className="text-center">No collectors found.</p>
        ) : (
          <TopCollectorsList collectors={topCollectors} height="max-h-[calc(100vh-8rem)]" />
        )}
      </div>
    </div>
  );
};

export default TopCollectors;