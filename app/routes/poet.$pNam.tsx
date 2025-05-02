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

  return json(poet);
};

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
  const poetPoem = poet.poem;
  const imageUrl = poet.g1Url;

  return [
    { title: `${poetName} – LostPoet` },
    { name: 'description', content: `Explore the traits and poem of ${poetName} in the LostPoets collection.` },
    { property: 'og:title', content: `${poetName} – ${poetClass}` },
    { property: 'og:description', content: `Explore the poem and traits of ${poetName} in the LostPoets collection.` },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: `https://findlostpoets.xyz/poet/${encodeURIComponent(poet.pNam)}` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: `${poetName} ${poetClass}` },
    { name: 'twitter:description', content: `Explore the poem and traits of ${poetName} in the LostPoets collection.` },
    { name: 'twitter:image', content: imageUrl },
  ];
};