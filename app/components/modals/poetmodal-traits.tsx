import type { Poet } from '@prisma/client';

interface PoetModalTraitsProps {
  poet: Poet;
}

function PoetModalTraits({ poet }: PoetModalTraitsProps) {
  return (
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 max-w-4xl w-full cursor-default select-none">
        <div><span className="font-thin">Origin:</span><span className="ml-2 font-normal">{poet.ori}</span></div>
        <div><span className="font-thin">Breed:</span><span className="ml-2 font-normal">{poet.brd}</span></div>
        <div><span className="font-thin">Polarity:</span><span className="ml-2 font-normal">{poet.pol}</span></div>
        <div><span className="font-thin">Words:</span><span className="ml-2 font-normal">{poet.wrdCnt}</span></div>
        <div><span className="font-thin">Latent:</span><span className="ml-2 font-normal">{poet.lat}</span></div>
        <div><span className="font-thin">Genre:</span><span className="ml-2 font-normal">{poet.gen}</span></div>
        <div><span className="font-thin">Ego:</span><span className="ml-2 font-normal">{poet.ego}</span></div>
        <div><span className="font-thin">Lexicon:</span><span className="ml-2 font-normal">{poet.lexCnt}</span></div>
        <div><span className="font-thin">Poet ID:</span><span className="ml-2 font-normal">{poet.pid}</span></div>
        <div><span className="font-thin">Age:</span><span className="ml-2 font-normal">{poet.age}</span></div>
        <div><span className="font-thin">Influence:</span><span className="ml-2 font-normal">{poet.infl}</span></div>
        <div><span className="font-thin">Rewrites:</span><span className="ml-2 font-normal">{poet.rewrCnt}</span></div>
      </div>
  );
}

export default PoetModalTraits;
