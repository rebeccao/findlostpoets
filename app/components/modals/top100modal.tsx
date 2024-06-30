import React, { useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import Top100List from '~/components/top100list';
import type { TopCollector } from '@prisma/client';
import BaseModal from '~/components/modals/baseinfomodal';

interface Top100ModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const Top100Modal: React.FC<Top100ModalProps> = ({ onClose, isOpen }) => {
  const fetcher = useFetcher<TopCollector[]>();
  const hasFetched = useRef(false); // Track if the data has been fetched

  React.useEffect(() => {
    console.log("useEffect Called.");
    if (isOpen && !hasFetched.current) {
      fetcher.load('/top100');
      hasFetched.current = true; // Set the ref to true after fetching
      console.log("hasFetched.current ", hasFetched.current);
    }
  }, [isOpen, fetcher]);

  return (
    <BaseModal onClose={onClose} title="Top 100 collectors" isOpen={isOpen} noScroll={true}>
      <div>
        {fetcher.data ? (
          <Top100List collectors={fetcher.data} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </BaseModal>
  );
};

export default Top100Modal;
