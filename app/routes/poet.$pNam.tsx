// app/routes/poet.$pNam.tsx

import { json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { prisma } from '~/utils/prisma.server'; // your prisma helper
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import type { Poet } from '@prisma/client';
import PoetModal from '~/components/modals/poetmodal';

export const loader: LoaderFunction = async ({ params }) => {
  const { pNam } = params;

  if (!pNam) {
    throw new Response("Poet not found", { status: 404 });
  }

  const poet = await prisma.poet.findFirst({
    where: { pNam: pNam },
  });

  if (!poet) {
    throw new Response("Poet not found", { status: 404 });
  }

  // Call ipfs-image-resizer-worker
  if (poet?.g1Url?.includes('ipfs.io/ipfs/')) {
    const resizedUrl = poet.g1Url.replace(
      'https://ipfs.io/ipfs/',
      'https://findlostpoets.xyz/ipfs/'
    );
  
    // Preload Gen1 image via Cloudflare. 
    void fetch(resizedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'image/jpeg,image/*,*/*;q=0.8'
      }
    });
  }

  return json(poet);
};

function truncate(text: string, maxLength = 200): string {
  if (text.length <= maxLength) return text;

  // Find the last space before the cutoff to avoid mid-word truncation
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace) + '…';
}

export default function PoetRoute() {
  const poet = useLoaderData<Poet>();

  return (
    <div className="h-screen bg-closetoblack text-pearlwhite">
      {/* Reuse your PoetModal but inside a full page */}
      <PoetModal
        poet={poet}
        hasPoem={poet.lexCnt > 0}
        onReturn={() => {
          window.location.href = '/';   // Return to homepage on click
        }}
        isStandalone={true} // <-- Pass true here
      />
    </div>
  );
}

// ⬇️ Meta function to generate dynamic Open Graph metadata
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const poet = data;
  const poetName = poet.pNam;
  const poetClass = poet.class;

  const compositeImageUrl = `https://og-composite-worker.findlostpoets.workers.dev/?g0=${encodeURIComponent(poet.g0Url)}&g1=${encodeURIComponent(poet.g1Url)}&name=${encodeURIComponent(poetName)}&class=${encodeURIComponent(poetClass)}`;

  return [
    { title: `${poetName} – LostPoet` },
    { property: 'og:title', content: `${poetName} – ${poetClass}` },
    { property: 'og:image', content: compositeImageUrl },
    { property: 'og:url', content: `https://findlostpoets.xyz/poet/${encodeURIComponent(poet.pNam)}` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${poetName} ${poetClass}` },
    { name: 'twitter:image', content: compositeImageUrl },
  ];
};