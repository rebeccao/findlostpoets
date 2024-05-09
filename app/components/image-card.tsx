import React from 'react'; 
import type { Poet } from '@prisma/client'
import PoetTraits from '~/components/detail/poetdetail-traits';

interface ImageCardProps {
  poet: Poet;
  rarityTraitLabel?: string;
  rarityCount?: number;
}

// Function to modify the ipfs URL to the Cloudflare worker URL for resizing
// https://ipfs.io/ipfs/QmWZHGH8DDaudeazcokTMPt5bz3k7xNKYPZ8bibnrFoajM is formatted to
// https://staging.findlostpoets.xyz/ipfs/QmWZHGH8DDaudeazcokTMPt5bz3k7xNKYPZ8bibnrFoajM or
// https://findlostpoets.xyz/ipfs/QmWZHGH8DDaudeazcokTMPt5bz3k7xNKYPZ8bibnrFoajM
const getResizedIPFSUrl = (originalIPFSUrl: string): string => {
  // The original URL starts with 'https://ipfs.io/ipfs/'
  const ipfsBaseUrl = 'https://ipfs.io/ipfs/';
  if (!originalIPFSUrl.startsWith(ipfsBaseUrl)) return originalIPFSUrl;  // Return original if not in expected format

    const ipfsPath = originalIPFSUrl.substring(ipfsBaseUrl.length);
    const baseUrl = process.env.NODE_ENV === 'staging'
      ? 'https://staging.findlostpoets.xyz/ipfs/'
      : 'https://findlostpoets.xyz/ipfs/';

    return `${baseUrl}${ipfsPath}`;
  };

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  ({ poet, rarityTraitLabel, rarityCount }, ref) => {
    // poet.g0Url is the arweave URL from the metafile and is stored in the MongoDB (1024x1024)
    // poet.g1Url is the ipfs URL from the metafile and is stored in the MongoDB (2048x2048)
    // getResizedIPFSUrl(poet.g1Url) is a Cloudflare worker that fetches the ipfs URL and resizes it to (1024x1024)
    // Check environment to determine Gen 1 image source
    const isDevelopment = process.env.NODE_ENV === 'development';
    const imageUrl = isDevelopment ? poet.g1Url : getResizedIPFSUrl(poet.g1Url);

    return (
      <div ref={ref} data-pid={poet.pid} className="max-w-xl rounded overflow-hidden bg-darkgray1 text-gainsboro shadow-lg sans">
        <img src={imageUrl} alt={`${poet.pNam + ' Gen1'}`} loading="lazy" className="w-full mb-2"/>
        <img src={poet.g0Url} alt={`${poet.pNam + ' Gen0'}`} loading="lazy" className="w-full" />    
        <div className="px-4 py-4">
        <div className="font-medium text-base mb-2">{poet.pNam}</div>
        {/* Responsive grid layout for traits */}
        <div className="grid grid-cols-1 gap-1 w-full">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><span className="text-xs font-light">Origin:</span></div>
          <div><span className="text-xs font-light">Breed:</span></div>
          <div><span className="text-xs font-light">Polarity:</span></div>
          <div><span className="text-xs font-light">Words:</span></div>
          <div><span className="text-sm font-medium">{poet.ori.substring(0, 6) + (poet.ori.length > 6 ? "... " : '')}</span></div>
          <div><span className="text-sm font-medium">{poet.brd}</span></div>
          <div><span className="text-sm font-medium">{poet.pol}</span></div>
          <div><span className="text-sm font-medium">{poet.wrdCnt}</span></div>
          </div>
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><span className="text-xs font-light">Latent:</span></div>
          <div><span className="text-xs font-light">Genre:</span></div>
          <div><span className="text-xs font-light">Ego:</span></div>
          <div><span className="text-xs font-light">Lexicon:</span></div>
          <div><span className="text-sm font-medium">{poet.lat}</span></div>
          <div><span className="text-sm font-medium">{poet.gen}</span></div>
          <div><span className="text-sm font-medium">{poet.ego}</span></div>
          <div><span className="text-sm font-medium">{poet.lexCnt}</span></div>
          </div>
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><span className="text-xs font-light">{rarityCount !== undefined && rarityTraitLabel ? rarityTraitLabel : "Poet ID:"}</span></div>
          <div><span className="text-xs font-light">Age:</span></div>
          <div><span className="text-xs font-light">Influence:</span></div>
          <div><span className="text-xs font-light">Rewrites:</span></div>
          <div><span className="text-sm font-medium">{rarityCount !== undefined ? rarityCount : poet.pid}</span></div>
          <div><span className="text-sm font-medium">{poet.age}</span></div>
          <div><span className="text-sm font-medium">{poet.infl}</span></div>
          <div><span className="text-sm font-medium">{poet.rewrCnt}</span></div>
          </div>
        </div>
        {(poet.poem || poet.wrdCnt > 0) && (
        <div className="mt-3 text-sm  font-light">Poem:
          <span className="font-medium text-base ml-2">{poet.poem ? poet.poem.substring(0, 16) + (poet.poem.length > 16 ? "..." : '') : ''}</span>
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