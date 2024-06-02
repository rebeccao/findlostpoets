// ./app/root.tsx

import type { LinksFunction, MetaFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
//import ComingSoon from '~/components/coming-soon';

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
  { rel: "stylesheet", href: stylesheet, precedence: 'high' },
  { rel: "canonical", href: "https://findlostpoets.xyz" },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap" },
];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1.0" },
  { name: "description", content: "FINDLOSTPOETS - Explore Pak's LOSTPOETS NFT collection. Browse and search Poets, their Poems and their traits." },
  { name: "keywords", content: "lostpoets, Murat, Pak, NFT, poets, poems, poetry, find lost poets, NFT, NFTs" },
  { name: "author", content: "0xNosToca" }
];

export default function App() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>FINDLOSTPOETS - Explore LOSTPOETS NFT Collection</title>
      </head>
      {/* Use the first font in tailwind.config.ts fontFamily */}
      <body className="font-sans">
        {/* Conditionally render Coming Soon page or the main Outlet based on environment */}
        {/*{isProduction ? <ComingSoon /> : <Outlet />}*/}
        <Outlet />
        <h1 className="screenreader-only">FINDLOSTPOETS: Browse Poets, Poems and Traits</h1>

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