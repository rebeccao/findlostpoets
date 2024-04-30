import type { Poet } from '@prisma/client'; // Import Poet type if it's defined with Prisma or define it if not already

interface PoetDetailProps {
  poet: Poet;
  onBack: () => void;
}

export default function PoetDetail({ poet, onBack }: PoetDetailProps) {
  return (
    <div className="flex h-screen">
      {/* Main content section for images and traits */}
      <div className="w-4/5 flex flex-col">
        {/* Images container */}
        <div className="flex flex-grow-0">
          <img src={poet.g0Url} alt={`${poet.pNam} Gen0`} className="w-1/2" />
          <img src={poet.g1Url} alt={`${poet.pNam} Gen1`} className="w-1/2" />
        </div>

        {/* Container for traits and back button */}
        <div className="flex-grow flex flex-col justify-between bg-gray-200 shadow-lg">
          <div className="p-4 grid grid-cols-8 gap-4">
            {/* Each trait and value takes up two columns out of eight, making up one fourth */}
            <div className="font-bold col-span-1">Origin:</div>
            <div className="col-span-1">{poet.ori}</div>

            <div className="font-bold col-span-1">Breed:</div>
            <div className="col-span-1">{poet.brd}</div>

            <div className="font-bold col-span-1">Polarity:</div>
            <div className="col-span-1">{poet.pol}</div>

            <div className="font-bold col-span-1">Words:</div>
            <div className="col-span-1">{poet.wrdCnt}</div>

            <div className="font-bold col-span-1">Latent:</div>
            <div className="col-span-1">{poet.lat}</div>

            <div className="font-bold col-span-1">Genre:</div>
            <div className="col-span-1">{poet.gen}</div>

            <div className="font-bold col-span-1">Ego:</div>
            <div className="col-span-1">{poet.ego}</div>

            <div className="font-bold col-span-1">Lexicon:</div>
            <div className="col-span-1">{poet.lexCnt}</div>
          
            <div className="font-bold col-span-1">Poet ID:</div>
            <div className="col-span-1">{poet.pid}</div>

            <div className="font-bold col-span-1">Age:</div>
            <div className="col-span-1">{poet.age}</div>

            <div className="font-bold col-span-1">Influence:</div>
            <div className="col-span-1">{poet.infl}</div>

            <div className="font-bold col-span-1">Rewrites:</div>
            <div className="col-span-1">{poet.rewrCnt}</div>
          </div>
          <button onClick={onBack} className="self-start p-2 mb-4 ml-4 mt-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">Back</button>
        </div>

      </div>

      {/* Vertical section for the poem */}
      <div className="w-1/5 overflow-y-auto p-4 bg-gray-100 shadow-inner">
        <div className="sticky top-0">
          <h2 className="font-bold mb-2">{poet.pNam}</h2>
          <p className="whitespace-pre-wrap">{poet.poem}</p>
        </div>
      </div>
    </div>
  );
}