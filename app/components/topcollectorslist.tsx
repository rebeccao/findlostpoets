import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

interface Collector {
  oAddr: string;
  oNam: string | null;
  count: number;
  wrdCnt: number;
  lexCnt: number;
}

type SortableField = 'count' | 'wrdCnt' | 'lexCnt';

interface TopCollectorsListProps {
  collectors: Collector[];
  height: string;
  sortKey: keyof Collector;
  onSort: (key: SortableField) => void;
  selectable?: boolean;
  onRowSelect?: (topCollector: { key: string; value: string }) => void;
}

const TopCollectorsList = forwardRef<HTMLDivElement, TopCollectorsListProps>(
  ({ collectors, height, sortKey, onSort, selectable = false, onRowSelect }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => listRef.current!);

    const handleRowClick = (index: number, collector: Collector) => {
      if (selectable) {
        setSelectedIndex(index);
        if (onRowSelect) {
          const key = collector.oNam ? 'oNam' : 'oAddr';
          const value = collector.oNam || collector.oAddr;
          onRowSelect({ key, value });
        }
      }
    };

    return (
      <div className="p-4 flex justify-center" ref={listRef}>
        <div className={`overflow-x-auto overflow-y-auto w-full border border-deepgray pb-1 ${height}`}>
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-20 bg-closetoblack border-b border-deepgray shadow-md">
              <tr>
                <th className="font-light border-r border-deepgray p-1.5 w-[70px] text-center">Rank</th>
                <th className="font-light border-r border-deepgray p-1.5 w-[240px] text-center">Owner</th>
                <th className="font-light border-r border-deepgray p-1.5 w-[420px] text-center">Wallet</th>
                <th className="font-light border-r border-deepgray p-1.5 w-[140px] text-center cursor-pointer"
                  onClick={() => onSort('count')}
                >
                  Poet Count{' '}
                  <span className={`${sortKey === 'count' ? 'text-pearlwhite' : 'text-davysgray'}`}>↓</span>
                </th>
                <th
                  className="font-light border-r border-deepgray p-1.5 w-[140px] text-center cursor-pointer"
                  onClick={() => onSort('wrdCnt')}
                >
                  Word Count{' '}
                  <span className={`${sortKey === 'wrdCnt' ? 'text-pearlwhite' : 'text-davysgray'}`}>↓</span>
                </th>
                <th
                  className="font-light border-r border-deepgray p-1.5 w-[140px] text-center cursor-pointer"
                  onClick={() => onSort('lexCnt')}
                >
                  Lexicon{' '}
                  <span className={`${sortKey === 'lexCnt' ? 'text-pearlwhite' : 'text-davysgray'}`}>↓</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {collectors.map((collector, index) => (
                <tr
                  key={index}
                  className={`${
                    selectable ? 'cursor-pointer' : ''
                  } ${
                    selectedIndex === index ? 'bg-closetoblack text-pearlwhite' : 'hover:bg-closetoblack'
                  } transition-colors`}
                  onClick={() => handleRowClick(index, collector)}
                >
                  <td className="border border-deepgray p-1.5 w-[70px] text-center">{index + 1}</td>
                  <td className="border border-deepgray p-1.5 w-[240px] max-w-[240px] truncate pl-4">
                    {collector.oNam || ''}
                  </td>
                  <td className="border border-deepgray p-1.5 w-[420px] pl-4">{collector.oAddr}</td>
                  <td className="border border-deepgray p-1.5 w-[120px] text-center">{collector.count}</td>
                  <td className="border border-deepgray p-1.5 w-[150px] text-center">{collector.wrdCnt}</td>
                  <td className="border border-deepgray p-1.5 w-[150px] text-center">{collector.lexCnt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

export default TopCollectorsList;
