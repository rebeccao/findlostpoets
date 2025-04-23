import React, { useEffect, useRef, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import TopCollectorsList from '~/components/topcollectorslist';
import type { Collector } from '@prisma/client';
import BaseModal from '~/components/modals/baseinfomodal';

type SortableField = 'count' | 'wrdCnt' | 'lexCnt';

interface TopCollectorsModalProps {
  onClose: () => void;
  isOpen: boolean;
  onTopCollectorSelect: (topCollector: { key: string; value: string }) => void; // callback for TopCollector selected
}

const TopCollectorsModal: React.FC<TopCollectorsModalProps> = ({ onClose, isOpen, onTopCollectorSelect }) => {
  const fetcher = useFetcher<{ collectors: Collector[]; sortKey: SortableField }>();
  const hasFetched = useRef(false); // Track if the data has been fetched
  const listRef = useRef<HTMLDivElement | null>(null); // Ref for TopCollectorsList
  const [listWidth, setListWidth] = useState<string>('w-[80vw]'); // Default width
  const [sortKey, setSortKey] = useState<SortableField>('count');
  
  const handleSort = (key: SortableField) => {
    setSortKey(key);
    hasFetched.current = false; // Allow refetching next time modal opens
    fetcher.load(`/topcollectors?sort=${key}`);
  };

  useEffect(() => {
    console.log("TopCollectorsModal useEffect Called. fetcher.load('/topcollectors')");
    if (isOpen && !hasFetched.current) {
      fetcher.load(`/topcollectors?sort=${sortKey}`);
      hasFetched.current = true;
    }
  }, [isOpen, fetcher, sortKey]);

  useEffect(() => {
    if (listRef.current) {
      const width = listRef.current.offsetWidth;
      setListWidth(`${width}px`); // Dynamically set width based on list width
    }
  }, [listRef.current, fetcher.data]); // Recalculate when TopCollectorsList changes

  const handleRowSelect = (topCollector: { key: string; value: string }) => {
    console.log('Selected collector:', topCollector);
    onTopCollectorSelect(topCollector); // Invoke the callback
  };

  const collectors = fetcher.data?.collectors ?? [];

  return (
    <BaseModal 
      onClose={onClose} 
      title={`Top ${collectors.length} LostPoet Collectors by ${sortKey === "wrdCnt" ? "Word Count" : sortKey === "lexCnt" ? "Lexicon" : "Poet Count"}`} 
      isOpen={isOpen} 
      noScroll={true}
      customWidth={listWidth}
    >
      <div className="overflow-y-auto">
        {fetcher.data ? (
            <TopCollectorsList 
              ref={listRef} 
              collectors={collectors} 
              height="max-h-[calc(80vh-10rem)]" 
              selectable={true} 
              onRowSelect={handleRowSelect} 
              sortKey={sortKey}
              onSort={handleSort}
            />
          ) : (
            <div>Loading...</div>
          )}
      </div>
    </BaseModal>
  );
};

export default TopCollectorsModal;
