import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useEffect } from 'react';
import TopCollectorsList from '~/components/topcollectorslist';
import { prisma } from '~/utils/prisma.server'
import type { Collector } from '@prisma/client';
import { customLog } from '~/root';

export const loader: LoaderFunction = async ({ request }) => {
  type SortableField = 'count' | 'wrdCnt' | 'lexCnt';
  const url = new URL(request.url);
  const sortKey = (url.searchParams.get("sort") ?? "count") as SortableField;

  if (!['count', 'wrdCnt', 'lexCnt'].includes(sortKey)) {
    throw new Response("Invalid sort key", { status: 400 });
  }

  try {
    // Fetch the top 200 collectors
    const collectors: Collector[] = await prisma.collector.findMany({
      take: 200,
      orderBy: { [sortKey]: 'desc' },
    });

    // Get the count of the 200th collector
    const valueOf200th = collectors[199]?.[sortKey];

    // Fetch all collectors with the same count as the 200th collector
    const collectorsWithValueOf200th: Collector[] = await prisma.collector.findMany({
      where: { [sortKey]: valueOf200th },
      orderBy: { [sortKey]: 'desc' },
    });
    console.log("Number of collectors with CountOf200th: ", collectorsWithValueOf200th.length);

    // Filter additional collectors to remove duplicates
    const filteredAdditionalCollectors = collectorsWithValueOf200th.filter(
      filteredCollector => filteredCollector[sortKey] === valueOf200th && 
        !collectors.some(collector => collector.oAddr === filteredCollector.oAddr)
    );

    // Log the count of filtered additional collectors
    console.log("Number of nonduplicate collectors with CountOf200th: ", filteredAdditionalCollectors.length);

    // Combine results and ensure no duplicates
    const combinedCollectors = [
      ...collectors,
      ...filteredAdditionalCollectors
    ];

    customLog('TopCollectorsLoader', `++++++  TopCollectors loader: {take: ${combinedCollectors.length}, orderBy:{count: desc}}`);
    return json({ collectors: combinedCollectors, sortKey });
  } catch (error) {
    console.error("Error fetching topCollectors: ", error);
    return json({ collectors: [], sortKey });
  }
};

const TopCollectors = () => {
  type SortableField = 'count' | 'wrdCnt' | 'lexCnt';
  const data = useLoaderData<{ collectors: Collector[]; sortKey: SortableField }>();
  const fetcher = useFetcher<{ collectors: Collector[] }>();

  const [collectors, setCollectors] = useState<Collector[]>(data.collectors);
  const [sortKey, setSortKey] = useState<SortableField>(data.sortKey);

  useEffect(() => {
    if (fetcher.data?.collectors) {
      setCollectors(fetcher.data.collectors);
    }
  }, [fetcher.data]);

  const handleSort = (key: SortableField) => {
    setSortKey(key);
    fetcher.load(`/topcollectors?sort=${key}`);
    window.history.pushState(null, "", `/topcollectors?sort=${key}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center border bg-closetoblack border-deepgray text-pearlwhite">
      <div className="text-center items-center pt-8 pb-4">
        <h1 className="text-2xl font-light">
          Top {collectors.length} LostPoet Collectors by {sortKey === "wrdCnt" ? "Word Count" : sortKey === "lexCnt" ? "Lexicon" : "Poet Count"}
        </h1>
      </div>
      <div className="flex-grow font-extralight px-5">
        {collectors.length === 0 ? (
          <p className="text-center">No collectors found.</p>
        ) : (
          <TopCollectorsList collectors={collectors} sortKey={sortKey} onSort={handleSort} height="max-h-[calc(100vh-8rem)]" />
        )}
      </div>
    </div>
  );
};

export default TopCollectors;