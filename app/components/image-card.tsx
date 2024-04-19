import React from 'react'; 
import type { Poet } from '@prisma/client'

const ImageCard = React.forwardRef<HTMLDivElement, { poet: Poet, rarityTraitLabel?: string, rarityCount?: number }>(
  ({ poet, rarityTraitLabel, rarityCount }, ref) => {
    return (
      <div ref={ref} data-pid={poet.pid} className="max-w-xl rounded overflow-hidden shadow-lg sans">
        <img
          src={`https://f6e56f29e6c106013b6589848faed170/cdn-cgi/image/width=1024,quality=80/${poet.g1Url}`}
          srcSet={srcSet}
          sizes={sizes}
          alt={`${poet.pNam + ' Gen1'}`}
          loading="lazy"
          className="w-full mb-2"
        />
        <img src={poet.g0Url} alt={`${poet.pNam + ' Gen0'}`} loading="lazy" className="w-full" /> 
        <div className="px-4 py-4">
        <div className="font-bold text-md mb-2">{poet.pNam}</div>
        {/* Responsive grid layout for traits */}
          <div className="mb-2">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-xs">
              <div>Origin: <span className="font-bold">{poet.ori}</span></div>
                <div>Breed: <span className="font-bold">{poet.brd}</span></div>
                <div>Polarity: <span className="font-bold">{poet.pol}</span></div>
                <div>Words: <span className="font-bold">{poet.wrdCnt}</span></div>
              </div>
          </div>
          <div className="mb-2">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-xs">
              {/* Adjusting for responsive layout */}
              <div>Latent: <span className="font-bold">{poet.lat}</span></div>
              <div>Genre: <span className="font-bold">{poet.gen}</span></div>
              <div>Ego: <span className="font-bold">{poet.ego}</span></div>
              <div>Lexicon: <span className="font-bold">{poet.lexCnt}</span></div>
            </div>
          </div>
          {/* Adjusted grid for rarity traits */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-xs">
            {/* ToDo: For production - Uncomment following line and comment Poet ID line */}
            {/*<div>{rarityCount !== undefined && rarityTraitLabel ? rarityTraitLabel : ""} <span className="font-bold">{rarityCount !== undefined ? rarityCount : ""}</span></div>*/}
            <div>Poet ID: <span className="font-bold">{poet.pid}</span></div>
            <div>Age: <span className="font-bold">{poet.age}</span></div>
            <div>Influ: <span className="font-bold">{poet.infl}</span></div>
            <div>Rewrites: <span className="font-bold">{poet.rewrCnt}</span></div>
          </div>
          {(poet.poem || poet.wrdCnt > 0) && (
          <div className="mt-2">
            Poem:
            <p className="font-semibold">{poet.poem ? poet.poem.substring(0, 40) + (poet.poem.length > 40 ? "..." : '') : ''}</p>
          </div>
          )}
        </div>
      </div>
    );
  }
);

// Assign a display name to the forwardRef component for debugging purposes
ImageCard.displayName = 'ImageCard';

export default ImageCard;