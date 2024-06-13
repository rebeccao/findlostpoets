import { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, Meta, Scripts, ScrollRestoration } from "@remix-run/react";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet, precedence: 'high' },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "Maintenance - FINDLOSTPOETS" },
  { name: "viewport", content: "width=device-width,initial-scale=1.0" },
];

export default function Maintenance() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex items-center justify-center min-h-screen bg-closetoblack font-sans">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-pearlwhite">Down for Release Upgrade</h1>
          <p className="mt-4 text-lg text-pearlwhite">Be back shortly.</p>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
