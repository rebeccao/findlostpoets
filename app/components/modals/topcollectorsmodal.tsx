import React, { useEffect, useRef, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import TopCollectorsList from '~/components/topcollectorslist';
import type { Collector } from '@prisma/client';
import BaseModal from '~/components/modals/baseinfomodal';

interface TopCollectorsModalProps {
  onClose: () => void;
  isOpen: boolean;
  onTopCollectorSelect: (topCollector: { key: string; value: string }) => void; // callback for TopCollector selected
}

const TopCollectorsModal: React.FC<TopCollectorsModalProps> = ({ onClose, isOpen, onTopCollectorSelect }) => {
  const fetcher = useFetcher<Collector[]>();
  const hasFetched = useRef(false); // Track if the data has been fetched
  const listRef = useRef<HTMLDivElement | null>(null); // Ref for TopCollectorsList
  const [listWidth, setListWidth] = useState<string>('w-[80vw]'); // Default width

  useEffect(() => {
    console.log("TopCollectorsModal useEffect Called. fetcher.load('/topcollectors')");
    if (isOpen && !hasFetched.current) {
      fetcher.load('/topcollectors');
      hasFetched.current = true; // Set the ref to true after fetching
    }
  }, [isOpen, fetcher]);

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

  return (
    <BaseModal 
      onClose={onClose} 
      title={`Top ${fetcher.data ? fetcher.data.length : '...'} LostPoet Collectors`} 
      isOpen={isOpen} 
      noScroll={true}
      customWidth={listWidth}
    >
      <div>
      {fetcher.data ? (
          <TopCollectorsList ref={listRef} collectors={fetcher.data} height="max-h-[calc(80vh-12rem)]" selectable={true} onRowSelect={handleRowSelect} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </BaseModal>
  );
};

export default TopCollectorsModal;
