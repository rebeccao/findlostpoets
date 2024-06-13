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
      <body className="font-sans bg-closetoblack min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-normal text-pearlwhite">FINDLOSTPOETS</h1>
          <h2 className="mt-4 text-2xl font-normal text-pearlwhite">Down for Release Upgrade</h2>
          <h3 className="mt-4 text-xl font-thin text-pearlwhite">Be back shortly</h3>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
