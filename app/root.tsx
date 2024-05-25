// ./app/root.tsx

import type { LinksFunction, MetaFunction } from "@remix-run/node";
import ComingSoon from '~/components/coming-soon';

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

// Disable console.log in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/app/tailwind.css", precedence: 'high' },
  { rel: "canonical", href: "https://findlostpoets.xyz" },
  { rel: "icon", href: "/favicon.ico" }
];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { viewport: "width=device-width,initial-scale=1" },
  { title: "FINDLOSTPOETS" },
  { description: "FINDLOSTPOETS is a unique platform to explore Murat Pak's LOSTPOETS NFT collection. Browse GEN0 poets, GEN1 poets and their poems. Search poets by traits, rarities and word counts." },
  { keywords: "lostpoets, Murat, Pak, NFT, poets, poems, poetry, find lost poets, NFT, NFTs" },
  { author: "0xNosToca" }
];

export default function App() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* Conditionally render Coming Soon page or the main Outlet based on environment */}
        {isProduction ? <ComingSoon /> : <Outlet />}

        {/* Manages scroll position for client-side transitions */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <ScrollRestoration />

        {/* Script tags go here */}
        {/* If you use a nonce-based content security policy for scripts, you must provide the `nonce` prop. Otherwise, omit the nonce prop as shown here. */}
        <Scripts />
      </body>
    </html>
  );
}