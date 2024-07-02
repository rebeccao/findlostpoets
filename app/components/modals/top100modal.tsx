import React, { useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import Top100List from '~/components/top100list';
import type { TopCollector } from '@prisma/client';
import BaseModal from '~/components/modals/baseinfomodal';

interface Top100ModalProps {
  onClose: () => void;
  isOpen: boolean;
  onTopCollectorSelect: (topCollector: { key: string; value: string }) => void; // callback for TopCollector selected
}

const Top100Modal: React.FC<Top100ModalProps> = ({ onClose, isOpen, onTopCollectorSelect }) => {
  const fetcher = useFetcher<TopCollector[]>();
  const hasFetched = useRef(false); // Track if the data has been fetched

  React.useEffect(() => {
    console.log("useEffect Called.");
    if (isOpen && !hasFetched.current) {
      fetcher.load('/top100');
      hasFetched.current = true; // Set the ref to true after fetching
    }
  }, [isOpen, fetcher]);

  const handleRowSelect = (topCollector: { key: string; value: string }) => {
    console.log('Selected collector:', topCollector);
    onTopCollectorSelect(topCollector); // Invoke the callback
  };

  return (
    <BaseModal onClose={onClose} title="Top 100 Lost Poet Collectors" isOpen={isOpen} noScroll={true}>
      <div>
      {fetcher.data ? (
          <Top100List collectors={fetcher.data} height="max-h-[calc(80vh-12rem)]" selectable={true} onRowSelect={handleRowSelect} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </BaseModal>
  );
};

export default Top100Modal;
