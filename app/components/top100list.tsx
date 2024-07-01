import React, { useState } from 'react';

interface Collector {
  oAddr: string;
  oNam: string | null;
  count: number;
}

interface Top100ListProps {
  collectors: Collector[];
  height: string; 
  selectable?: boolean;
  onRowSelect?: (keyValue: { key: string; value: string }) => void;
}
const Top100List: React.FC<Top100ListProps> = ({ collectors, height, selectable = false, onRowSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  return (
    <div className="p-4 flex justify-center">
      <div>
        {/* Separate header element */}
        <div className="flex bg-darkergray border border-onyxgray">
          <div className="font-light border-r border-onyxgray p-1.5 w-[70px] text-center">Rank</div>
          <div className="font-light border-r border-onyxgray p-1.5 w-[240px] text-center">Owner</div>
          <div className="font-light border-r border-onyxgray p-1.5 w-[420px] text-center">Wallet</div>
          <div className="font-light border-r border-onyxgray p-1.5 w-[100px] text-center"># of Poets</div>
        </div>
        {/* Scrollable table body */}
        <div className="border-b border-onyxgray">
          <div className={`overflow-y-auto ${height}`}>
            <table className="border-collapse border border-onyxgray">
              <tbody>
                {collectors.map((collector, index) => (
                  <tr
                  key={index}
                  className={`cursor-pointer ${selectedIndex === index ? 'bg-charcoalgray text-pearlwhite' : 'hover:bg-charcoalgray'} transition-colors`}
                  onClick={() => handleRowClick(index, collector)}
                  >
                    <td className="border border-onyxgray p-1.5 w-[70px] text-center">{index + 1}</td>
                    <td className="border border-onyxgray p-1.5 w-[240px] pl-4">{collector.oNam || ""}</td>
                    <td className="border border-onyxgray p-1.5 w-[420px] pl-4">{collector.oAddr}</td>
                    <td className="border border-onyxgray p-1.5 w-[100px] text-center">{collector.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top100List;