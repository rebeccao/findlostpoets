// ./app/root.tsx
import type { LinksFunction, MetaFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node"; 
import stylesheet from "~/tailwind.css?url";
import { Links, Meta, Outlet,  Scripts, ScrollRestoration } from "@remix-run/react";

// Save the original console.log
const originalConsoleLog = console.log;

// Custom logging function to log one console.log in the production environment
export const customLog = (context: string, ...args: any[]) => {
  const enabledContexts = ['IndexLoader']; // Only enable logging for IndexLoader in production
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

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1.0" },
  { name: "description", content: "FINDLOSTPOETS - Explore Pak's LOSTPOETS NFT collection. Browse and search Poets, their Poems and their traits." },
  { name: "keywords", content: "lostpoets, Murat, Pak, NFT, poets, poems, poetry, find lost poets, NFT, NFTs" },
  { name: "author", content: "0xNosToca" }
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  if (isMaintenance && url.pathname !== "/maintenance") {
    return redirect("/maintenance");
  }
  return null;
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>FINDLOSTPOETS - Explore LOSTPOETS NFT Collection</title>
      </head>
      {/* Use the first font in tailwind.config.ts fontFamily */}
      <body className="font-sans">
        <Outlet />
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