import type { Poet } from '@prisma/client'; // Import Poet type if it's defined with Prisma or define it if not already
import PoetDetailNavbar from '~/components/navbar-poet-detail';

interface PoetDetailProps {
  poet: Poet;
  onBack: () => void;
}

export default function DetailPoetFewWords({ poet, onBack }: PoetDetailProps) {
  return (
    // Needs refactored
    <div className="flex flex-col h-screen">
      <PoetDetailNavbar poetName={poet.pNam} onBack={onBack} />
      <div className="flex flex-1 overflow-hidden relative">
      <div className="grid grid-cols-6">
      {/* Main content section for images and traits */}
      <div className="col-span-5 flex flex-col shadow-md z-10">
        {/* Images container */}
        <div className="flex flex-grow-0">
          <img src={poet.g0Url} alt={`${poet.pNam} Gen0`} className="w-1/2" />
          <img src={poet.g1Url} alt={`${poet.pNam} Gen1`} className="w-1/2" />
        </div>
        {/* Container for traits */}
        <div className="flex-grow flex flex-col justify-between bg-gray-200 shadow-lg">
          <div className="p-4 grid grid-cols-[2fr_1fr_1fr_1fr] gap-4">
            <div>
              <span>Origin:</span><span className="ml-2 font-bold">{poet.ori}</span>
            </div>
            <div>
              <span>Breed:</span><span className="ml-2 font-bold">{poet.brd}</span>
            </div>
            <div>
              <span>Polarity:</span><span className="ml-2 font-bold">{poet.pol}</span>
            </div>
            <div>
              <span>Words:</span><span className="ml-2 font-bold">{poet.wrdCnt}</span>
            </div>
            <div>
              <span>Latent:</span><span className="ml-2 font-bold">{poet.lat}</span>
            </div>
            <div>
              <span>Genre:</span><span className="ml-2 font-bold">{poet.gen}</span>
            </div>
            <div>
              <span>Ego:</span><span className="ml-2 font-bold">{poet.ego}</span>
            </div>
            <div>
              <span>Lexicon:</span><span className="ml-2 font-bold">{poet.lexCnt}</span>
            </div>
            <div>
              <span>Poet ID:</span><span className="ml-2 font-bold">{poet.pid}</span>
            </div>
            <div>
              <span>Age:</span><span className="ml-2 font-bold">{poet.age}</span>
            </div>
            <div>
              <span>Influence:</span><span className="ml-2 font-bold">{poet.infl}</span>
            </div>
            <div>
              <span>Rewrites:</span><span className="ml-2 font-bold">{poet.rewrCnt}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Vertical section for the poem */}
      <div className="col-span-1 overflow-y-auto p-4 bg-gray-100">
        <div className="sticky top-0">
          <p className="whitespace-pre-wrap">{poet.poem}</p>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}