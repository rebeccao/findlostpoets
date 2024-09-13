import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

interface Collector {
  oAddr: string;
  oNam: string | null;
  count: number;
  wrdCnt: number;
  lexCnt: number;
}

interface TopCollectorsListProps {
  collectors: Collector[];
  height: string; 
  selectable?: boolean;
  onRowSelect?: (topCollector: { key: string; value: string }) => void;
}
const TopCollectorsList = forwardRef<HTMLDivElement, TopCollectorsListProps>(({ collectors, height, selectable = false, onRowSelect }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<keyof Collector>('count'); // Default sort by 'count'
  const [sortedCollectors, setSortedCollectors] = useState(collectors);

  const listRef = useRef<HTMLDivElement>(null);

  // Expose the ref from this component to the parent
  useImperativeHandle(listRef, () => listRef.current!);

  const handleRowClick = (index: number, collector: Collector) => {
    console.log("collector ", collector);
    if (selectable) {
      setSelectedIndex(index);
      if (onRowSelect) {
        const key = collector.oNam ? 'oNam' : 'oAddr';
        const value = collector.oNam || collector.oAddr;
        onRowSelect({ key, value });
      }
    }
  };

  const sortByKey = (key: keyof Collector) => {
    // Always sort in descending order
    const sorted = [...collectors].sort((a, b) => (b[key] as number) - (a[key] as number));
    setSortedCollectors(sorted);
    setSortKey(key);
  };

  return (
    <div className="p-4 flex justify-center" ref={listRef}>
      <div>
        {/* Separate header element */}
        <div className="flex bg-black-900 border border-deepgray">
          <div className="font-light border-r border-deepgray p-1.5 w-[70px] text-center">Rank</div>
          <div className="font-light border-r border-deepgray p-1.5 w-[240px] text-center">Owner</div>
          <div className="font-light border-r border-deepgray p-1.5 w-[420px] text-center">Wallet</div>
          <div
            className="font-light border-r border-deepgray p-1.5 w-[120px] text-center cursor-pointer"
            onClick={() => sortByKey('count')}
          >
            Poet Count{' '}
            <span className={`${sortKey === 'count' ? 'text-pearlwhite' : 'text-davysgray'}`}>
              ↓
            </span>
          </div>
          <div
            className="font-light border-r border-deepgray p-1.5 w-[150px] text-center cursor-pointer"
            onClick={() => sortByKey('wrdCnt')}
          >
            Word Count{' '}
            <span className={`${sortKey === 'wrdCnt' ? 'text-pearlwhite' : 'text-davysgray'}`}>
              ↓
            </span>
          </div>
          <div
            className="font-light border-r border-deepgray p-1.5 w-[150px] text-center cursor-pointer"
            onClick={() => sortByKey('lexCnt')}
          >
            Lexicon{' '}
            <span className={`${sortKey === 'lexCnt' ? 'text-pearlwhite' : 'text-davysgray'}`}>
              ↓
            </span>
          </div>
        </div>
        {/* Scrollable table body */}
        <div className="border-b border-deepgray">
          <div className={`overflow-y-auto ${height}`}>
            <table className="border-collapse border border-deepgray">
              <tbody>
                {sortedCollectors.map((collector, index) => (
                  <tr
                  key={index}
                  className={`${selectable ? 'cursor-pointer' : ''} ${selectedIndex === index ? 'bg-closetoblack text-pearlwhite' : 'hover:bg-closetoblack'} transition-colors`}
                  onClick={() => handleRowClick(index, collector)}
                  >
                    <td className="border border-deepgray p-1.5 w-[70px] text-center">{index + 1}</td>
                    <td className="border border-deepgray p-1.5 w-[240px] max-w-[240px] truncate pl-4">{collector.oNam || ""}</td>
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
      </div>
    </div>
  );
});

export default TopCollectorsList;