import type { Poet } from '@prisma/client'

const ImageCard = ({ poet, rarityTraitLabel, rarityCount }: { poet: Poet, rarityTraitLabel?: string, rarityCount?: number }) => {
  return (
    <div className="max-w-xl rounded overflow-hidden shadow-lg sans">
      {/*<img src={poet.g1Url} alt={`${poet.pNam + ' Gen1'}`} loading="lazy" className="w-full mb-2" />
      <img src={poet.g0Url} alt={`${poet.pNam + ' Gen0'}`} loading="lazy" className="w-full" />*/}
			<div className="px-6 py-4">
			<div className="font-bold text-xl mb-4">{poet.pNam}</div>
        <div className="mb-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-sm">
            <div>Origin:</div>
            <div>Breed:</div>
            <div>Polarity:</div>
            <div>WordCount:</div>
          </div>
          <div className="font-bold grid grid-cols-[2fr_1fr_1fr_1fr] gap-4">
						<div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">{poet.ori}</div>
            <div>{poet.brd}</div>
            <div>{poet.pol}</div>
            <div>{poet.wrdCnt}</div>
          </div>
        </div>
        <div className="mb-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-sm">
            <div>Latent:</div>
            <div>Age:</div>
            <div>Ego:</div>
            <div>Lexicon:</div>
          </div>
          <div className="font-bold grid grid-cols-[2fr_1fr_1fr_1fr] gap-4">
            <div>{poet.lat}</div>
            <div>{poet.age}</div>
            <div>{poet.ego}</div>
            <div>{poet.lexCnt}</div>
          </div>
        </div>
        {/* Adjust grid template columns based on rarityCount presence */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-sm">
          {/* Conditionally render "Rarity Count" label or an empty div for alignment */}
          <div>{rarityCount !== undefined && rarityTraitLabel ? rarityTraitLabel : ""}</div>
          <div>Genre:</div>
          <div>Influence:</div>
          <div>Rewrites:</div>
        </div>
        <div className="font-bold grid grid-cols-[2fr_1fr_1fr_1fr] gap-4">
          {/* Conditionally render rarityCount value or an empty div for alignment */}
          <div>{rarityCount !== undefined ? rarityCount : ""}</div>
          <div>{poet.gen}</div>
          <div>{poet.infl}</div>
          <div>{poet.rewrCnt}</div>
        </div>
				{(poet.poem || poet.wrdCnt > 0) && (
        <div className="mt-2">
          Poem:
					<p className="font-semibold">{poet.poem ? poet.poem.substring(0, 76) + (poet.poem.length > 76 ? "..." : '') : ''}</p>
        </div>
				)}
      </div>
    </div>
  )
}

export default ImageCard;