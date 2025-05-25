// ./app/root.tsx
import type { LinksFunction, MetaFunction, LoaderFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { Links, Meta, Outlet,  Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import MaintenancePage from '~/components/maintenance-page';

// Save the original console.log
const originalConsoleLog = console.log;

// Custom logging function to log one console.log in the production environment
export const customLog = (context: string, ...args: any[]) => {
  const enabledContexts = ['IndexLoader', 'TopCollectorsLoader']; // Only enable logging for IndexLoader in production
  if (process.env.NODE_ENV !== 'production' || enabledContexts.includes(context)) {
    originalConsoleLog(`[${context}]`, ...args);      // Use the original console.log to avoid being silenced by the override
  }
};

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet, precedence: 'high' },
  { rel: "canonical", href: "https://findlostpoets.xyz" },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-180x180.png" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap" },
];

export const meta: MetaFunction = () => {
  const siteTitle = "FindLostPoets – Explore the Lost Poets NFT collection by Pak";
  const siteDescription = "Discover the traits and poetry of the 28,170 Lost Poets including Origins, Poets and Ghosts.";
  const siteImage = "https://findlostpoets.xyz/assets/og-home.jpg?v=1";
  const siteUrl = "https://findlostpoets.xyz";

  return [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1.0" },
    { name: "description", content: siteDescription },
    { name: "keywords", content: "lostpoets, Murat, Pak, NFT, poets, poems, poetry, find lost poets, NFT, NFTs" },
    { name: "author", content: "0xNosToca" },

    // Open Graph
    { property: "og:title", content: siteTitle },
    { property: "og:description", content: siteDescription },
    { property: "og:image", content: siteImage },
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: siteTitle },
    { name: "twitter:description", content: siteDescription },
    { name: "twitter:image", content: siteImage },
  ];
};

export const loader: LoaderFunction = () => {
  return {
    isMaintenanceMode: process.env.MAINTENANCE_MODE === 'true'
  };
};

export default function App() {
  const { isMaintenanceMode } = useLoaderData<{ isMaintenanceMode: boolean }>();

  return (
    <html lang="en" className="h-full text-base">
      <head>
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
        <title>FINDLOSTPOETS - Explore LOSTPOETS NFT Collection</title>
      </head>
      {/* Use the first font in tailwind.config.ts fontFamily */}
      <body className="font-sans bg-closetoblack text-pearlwhite h-full">
        {/* Conditionally render Maintenance page or the main Outlet based on maintenance mode */}
        {isMaintenanceMode ? <MaintenancePage /> : <Outlet />}
        {/*<h1 className="screenreader-only">FINDLOSTPOETS: Browse Poets, Poems and Traits</h1>*/}

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