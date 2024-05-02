import type { Poet } from '@prisma/client'; // Import Poet type if it's defined with Prisma or define it if not already
import PoetDetailNavbar from '~/components/navbar-poet-detail';

interface PoetDetailProps {
  poet: Poet;
  onBack: () => void;
}

export default function DetailPoetNoWords({ poet, onBack }: PoetDetailProps) {
  return (
    <div className="flex flex-col h-screen">
      <PoetDetailNavbar poetName={poet.pNam} onBack={onBack} />
      <div className="flex flex-1 overflow-hidden relative bg-darkgray">
        {/* Main content section for images and traits */}
        <div className="grid grid-rows-[auto,1fr] min-h-0 w-full max-w-7xl mx-auto my-6">
          {/* Images container */}
          <div className="flex justify-center items-center bg-darkgray">
            <div style={{ width: '50%', padding: '0 10px 0 0' }}>  {/* Add right padding to the first image */}
              <img src={poet.g0Url} alt={`${poet.pNam} Gen0`} className="w-full" />
            </div>
            <div style={{ width: '50%', padding: '0 0 0 10px' }}>  {/* Add left padding to the second image */}
              <img src={poet.g1Url} alt={`${poet.pNam} Gen1`} className="w-full" />
            </div>
          </div>
          {/* Container for traits */}
          <div className="bg-onyxgray text-offwhite shadow-lg p-4">
            {/*<div className="p-4 grid grid-cols-[2fr_1fr_1fr_1fr] gap-4">*/}
            <div className="grid grid-cols-4 gap-4">
              <div><span>Origin:</span><span className="ml-2 font-bold">{poet.ori}</span></div>
              <div><span>Breed:</span><span className="ml-2 font-bold">{poet.brd}</span></div>
              <div><span>Polarity:</span><span className="ml-2 font-bold">{poet.pol}</span></div>
              <div><span>Words:</span><span className="ml-2 font-bold">{poet.wrdCnt}</span></div>
              <div><span>Latent:</span><span className="ml-2 font-bold">{poet.lat}</span></div>
              <div><span>Genre:</span><span className="ml-2 font-bold">{poet.gen}</span></div>
              <div><span>Ego:</span><span className="ml-2 font-bold">{poet.ego}</span></div>
              <div><span>Lexicon:</span><span className="ml-2 font-bold">{poet.lexCnt}</span></div>
              <div><span>Poet ID:</span><span className="ml-2 font-bold">{poet.pid}</span></div>
              <div><span>Age:</span><span className="ml-2 font-bold">{poet.age}</span></div>
              <div><span>Influence:</span><span className="ml-2 font-bold">{poet.infl}</span></div>
              <div><span>Rewrites:</span><span className="ml-2 font-bold">{poet.rewrCnt}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}