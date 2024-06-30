import React from 'react';

interface Collector {
  oAddr: string;
  oNam: string | null;
  count: number;
}

interface Top100ListProps {
  collectors: Collector[];
}
const Top100List: React.FC<Top100ListProps> = ({ collectors }) => {
  return (
    <div className="p-4 flex justify-center">
      <div>
        {/* Separate header element */}
        <div className="flex bg-darkgray border border-davysgray">
          <div className="font-light border-r border-davysgray p-1.5 w-[70px]">Rank</div>
          <div className="font-light border-r border-davysgray p-1.5 w-[240px]">Owner</div>
          <div className="font-light border-r border-davysgray p-1.5 w-[420px]">Wallet</div>
          <div className="font-light border-r border-davysgray p-1.5 w-[100px]"># of Poets</div>
        </div>
        {/* Scrollable table body */}
        <div className="overflow-auto max-h-[calc(75vh-7.5rem)]">
          <table className="border-collapse border border-davysgray">
            <tbody>
              {collectors.map((collector, index) => (
                <tr key={index}>
                  <td className="border border-davysgray p-1.5 w-[70px] text-center">{index + 1}</td>
                  <td className="border border-davysgray p-1.5 w-[240px] pl-4">{collector.oNam || ""}</td>
                  <td className="border border-davysgray p-1.5 w-[420px] pl-4">{collector.oAddr}</td>
                  <td className="border border-davysgray p-1.5 w-[100px] text-center">{collector.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Top100List;