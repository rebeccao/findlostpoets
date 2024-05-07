import type { Poet } from '@prisma/client';
import PoetDetailNavbar from '~/components/navbar-poet-detail';
import PoetTraits from '~/components/detail/poettraits';

interface PoetDetailProps {
  poet: Poet;
  hasPoem: boolean;
  onBack: () => void;
}

export default function PoetDetail({ poet, hasPoem, onBack }: PoetDetailProps) {
  return (
    <div className="flex flex-col h-screen">
      <PoetDetailNavbar poetName={poet.pNam} className="navbar" onBack={onBack} />
      <div className="flex flex-1 overflow-hidden relative bg-closetoblack">
        {/* Main content section for images and traits */}
        <div className="grid grid-rows-[auto,1fr] min-h-0 w-full max-w-7xl mx-auto my-6 overflow-y-auto">
          {/* Images container */}
          <div className="flex justify-center items-center px-4 bg-closetoblack">
            <div style={{ width: '50%', padding: '0 10px 0 0' }}>  {/* Add right padding to the first image */}
              <img src={poet.g0Url} alt={`${poet.pNam} Gen0`} className="w-full" />
            </div>
            <div style={{ width: '50%', padding: '0 0 0 10px' }}>  {/* Add left padding to the second image */}
              <img src={poet.g1Url} alt={`${poet.pNam} Gen1`} className="w-full" />
            </div>
          </div>
          {/* Container for the traits and the poem, if one exists */}
          <div className="bg-closetoblack text-pearlwhite px-4 pb-4 pt-8 flex justify-center">
            {hasPoem ? (
              <div className="flex gap-4 w-full">
                  {/* First section for traits */}
                  <div className="flex-1 px-4 pb-4">
                      <PoetTraits poet={poet} />
                  </div>
                  {/* Second section for the poem */}
                  <div className="flex-1 flex-col justify-center items-start text-center text-pearlwhite px-4 pb-4 overflow-y-auto max-h-64">
                    <pre className="whitespace-pre-wrap">{poet.poem}</pre>
                  </div>
              </div>
            ) : (
              <PoetTraits poet={poet} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}