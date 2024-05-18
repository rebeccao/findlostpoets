import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
// only if you want to make your experience with Remix even better
//import { remixDevTools } from "remix-development-tools";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    //remixDevTools(),
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths()
  ],
});
