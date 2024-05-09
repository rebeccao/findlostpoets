import type { Poet } from '@prisma/client';

interface PoetDetailTraitsProps {
  poet: Poet;
}

function PoetDetailTraits({ poet }: PoetDetailTraitsProps) {
  return (
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 max-w-4xl w-full cursor-default select-none">
        <div><span className="font-thin">Origin:</span><span className="ml-2 font-medium">{poet.ori}</span></div>
        <div><span className="font-thin">Breed:</span><span className="ml-2 font-medium">{poet.brd}</span></div>
        <div><span className="font-thin">Polarity:</span><span className="ml-2 font-medium">{poet.pol}</span></div>
        <div><span className="font-thin">Words:</span><span className="ml-2 font-medium">{poet.wrdCnt}</span></div>
        <div><span className="font-thin">Latent:</span><span className="ml-2 font-medium">{poet.lat}</span></div>
        <div><span className="font-thin">Genre:</span><span className="ml-2 font-medium">{poet.gen}</span></div>
        <div><span className="font-thin">Ego:</span><span className="ml-2 font-medium">{poet.ego}</span></div>
        <div><span className="font-thin">Lexicon:</span><span className="ml-2 font-medium">{poet.lexCnt}</span></div>
        <div><span className="font-thin">Poet ID:</span><span className="ml-2 font-medium">{poet.pid}</span></div>
        <div><span className="font-thin">Age:</span><span className="ml-2 font-medium">{poet.age}</span></div>
        <div><span className="font-thin">Influence:</span><span className="ml-2 font-medium">{poet.infl}</span></div>
        <div><span className="font-thin">Rewrites:</span><span className="ml-2 font-medium">{poet.rewrCnt}</span></div>
      </div>
  );
}

export default PoetDetailTraits;
