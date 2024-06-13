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
      <body className="font-sans">
        <div className="text-center flex items-center justify-center min-h-screen bg-closetoblack ">
          <h1 className="text-4xl font-bold text-pearlwhite">FINDLOSTPOETS</h1>
          <h2 className="text-4xl font-bold text-pearlwhite">Down for Release Upgrade</h2>
          <h2 className="mt-4 text-lg text-pearlwhite">Be back shortly.</h2>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
