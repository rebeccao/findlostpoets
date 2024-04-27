// ./app/root.tsx

import type { LinksFunction } from "@remix-run/node";
import ComingSoon from '~/components/coming-soon';

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/app/tailwind.css", precedence: 'high' },
];

export default function App() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>FindLostPoets</title>

        {/* All meta exports on all routes will go here */}
        <Meta />
        
        {/* All link exports on all routes will go here */}
        <Links/>
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