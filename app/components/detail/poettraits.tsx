import type { Poet } from '@prisma/client';

interface PoetTraitsProps {
  poet: Poet;
}

function PoetTraits({ poet }: PoetTraitsProps) {
  return (
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 max-w-4xl w-full">
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
  );
}

export default PoetTraits;
