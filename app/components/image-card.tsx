import React from 'react';

const ImageCard = ({poet}) => {
  return (
		<div className="max-w-2xl rounded overflow-hidden shadow-lg">
			<img src={poet.g1Url} alt="" className="w-full"/>
			<img src={poet.g0Url} alt="" className="w-full"/>
		<div className="px-6 py-4">
				<div className="font-bold text-xl mb2">
					{poet.pNam}
				</div>
				<ul>
					<li>
						<strong>Origin: </strong>
						{poet.ori}
					</li>
					<li>
						<strong>Latent: </strong>
						{poet.lat}
					</li>
					<li>
						<strong>Poem: </strong>
						{poet.poem ? poet.poem.substring(0, 38) + (poet.poem.length > 38 ? "..." : '') : ''}
					</li>
				</ul>
			</div>
    </div>
	)
}

export default ImageCard;