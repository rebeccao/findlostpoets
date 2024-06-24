import React, { useState, useRef, useEffect } from 'react';
import type { Poet } from '@prisma/client'

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
    const divRef = ref as React.Ref<HTMLDivElement>;
    // poet.g0Url is the arweave URL from the metafile and is stored in the MongoDB (1024x1024)
    // poet.g1Url is the ipfs URL from the metafile and is stored in the MongoDB (2048x2048)
    // getResizedIPFSUrl(poet.g1Url) is a Cloudflare worker that fetches the ipfs URL and resizes it to (1024x1024)
    // Check environment to determine Gen 1 image source
    const isDevelopment = process.env.NODE_ENV === 'development';
    const imageUrl = isDevelopment ? poet.g1Url : getResizedIPFSUrl(poet.g1Url);

    const gen1ImgRef = useRef<HTMLImageElement>(null);
    const gen0ImgRef = useRef<HTMLImageElement>(null);

    // States to track the loading status of each image separately
    const [gen1ImageLoaded, setGen1ImageLoaded] = useState(false);
    const [gen0ImageLoaded, setGen0ImageLoaded] = useState(false);

    // useEffect to create a new Image object to preload the image
    // Force the browser to fetch the images when the component mounts, to ensure
    // that the images are preloaded and ready to be displayed once they are fully loaded.
    // Added this useEffect to fix images not loading when the placeholder was introduced.
    useEffect(() => {
      //console.log('imageUrl:', imageUrl);
    
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setGen1ImageLoaded(true);
        //console.log('Gen1 image loaded successfully.');
      };
      /* Commenting this out. For some weird reason, the error was being triggered but the images are loading just fine.
      img.onerror = (e) => {
        const event = e as Event & { target: HTMLImageElement };
        if (event.target) {
          console.error(`Retrying load for Gen1 image for poet: ${poet.pNam}`);
          event.target.src = imageUrl; // Retry loading the image
          console.error(`Failed to load Gen1 image for poet: ${poet.pNam}`);
          console.error('Gen1 Image Event Target Source:', event.target.src);
          console.error('Gen1 Image src:', img.src);
          console.error('Gen1 Image URL:', imageUrl);
        }
      };*/
    
      const img2 = new Image();
      img2.src = poet.g0Url;
      img2.onload = () => {
        setGen0ImageLoaded(true);
      };

      return () => {
        img.src = '';
        img2.src = '';
      };
    }, [imageUrl, poet.g0Url, poet.pNam]);  
    
    const poem = poet.poem || '';       // Ensure poet.poem is defined
    const formattedPoem = poem.substring(0, 16).replace(/\n+/g, ' ').trim() + (poem.length > 16 ? "..." : '');

    return (
      <div ref={divRef} data-pid={poet.pid} className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded overflow-hidden  bg-darkgray text-gainsboro shadow-lg sans">
        <div className="relative w-full pb-[100%] mb-2">
          {!gen1ImageLoaded && (
            <div className="absolute top-0 left-0 right-0 bottom-0 animate-pulse border bg-darkgray border-charcoalgray"></div>
          )}
          <img
            ref={gen1ImgRef}
            src={imageUrl}
            alt={`${poet.pNam + ' Gen1'}`}
            loading="lazy"
            className={`absolute top-0 left-0 w-full h-full object-cover ${gen1ImageLoaded ? '' : 'hidden'}`}
          />
        </div>

        <div className="relative w-full pb-[100%]">
          {!gen0ImageLoaded && (
            <div className="absolute top-0 left-0 right-0 bottom-0 animate-pulse border bg-darkgray border-charcoalgray"></div>
          )}
          <img
            ref={gen0ImgRef}
            src={poet.g0Url}
            alt={`${poet.pNam + ' Gen0'}`}
            loading="lazy"
            className={`absolute top-0 left-0 w-full h-full object-cover ${gen0ImageLoaded ? '' : 'hidden'}`}
          />
        </div>
        <div className="px-4 py-4">
        <h2 className="font-normal text-base mb-2"><span className="text-sm font-light">{poet.class}: </span>{poet.pNam}</h2>
          {/* Responsive grid layout for traits */}
          <div className="grid grid-cols-1 gap-1 w-full">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div><span className="text-xs font-light">Origin:</span></div>
            <div><span className="text-xs font-light">Breed:</span></div>
            <div><span className="text-xs font-light">Polarity:</span></div>
            <div><span className="text-xs font-light">Words:</span></div>
            <div><span className="text-sm font-normal">{poet.ori.substring(0, 6) + (poet.ori.length > 6 ? "... " : '')}</span></div>
            <div><span className="text-sm font-normal">{poet.brd}</span></div>
            <div><span className="text-sm font-normal">{poet.pol}</span></div>
            <div><span className="text-sm font-normal">{poet.wrdCnt}</span></div>
            </div>
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div><span className="text-xs font-light">Latent:</span></div>
            <div><span className="text-xs font-light">Genre:</span></div>
            <div><span className="text-xs font-light">Ego:</span></div>
            <div><span className="text-xs font-light">Lexicon:</span></div>
            <div><span className="text-sm font-normal">{poet.lat}</span></div>
            <div><span className="text-sm font-normal">{poet.gen}</span></div>
            <div><span className="text-sm font-normal">{poet.ego}</span></div>
            <div><span className="text-sm font-normal">{poet.lexCnt}</span></div>
            </div>
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div><span className="text-xs font-light">{rarityCount !== undefined && rarityTraitLabel ? rarityTraitLabel : "Poet ID:"}</span></div>
            <div><span className="text-xs font-light">Age:</span></div>
            <div><span className="text-xs font-light">Influ:</span></div>
            <div><span className="text-xs font-light">Rewrites:</span></div>
            <div><span className="text-sm font-normal">{rarityCount !== undefined ? rarityCount : poet.pid}</span></div>
            <div><span className="text-sm font-normal">{poet.age}</span></div>
            <div><span className="text-sm font-normal">{poet.infl}</span></div>
            <div><span className="text-sm font-normal">{poet.rewrCnt}</span></div>
            </div>
          </div>
          <div className="mt-3 text-sm font-light">
            {formattedPoem.length > 0 || poet.wrdCnt > 0 ? (
              <>
                  Poem: <span className="font-normal text-base ml-2">{formattedPoem}</span>
              </>
            ) : (
                ''
            )}
          </div>
        </div>
      </div>
    );
  }
);

// Assign a display name to the forwardRef component for debugging purposes
ImageCard.displayName = 'ImageCard';

export default ImageCard;