import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
// only if you want to make your experience with Remix even better
import { remixDevTools } from "remix-development-tools";

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
  },
  root: './app',
  plugins: [
    remixDevTools(),
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths()
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@remix-run/react',
      'react/jsx-dev-runtime'
    ]
  },
});
