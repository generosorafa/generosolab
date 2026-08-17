import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(projectRoot, "github-pages"),
  base: "/valuation-b3/",
  publicDir: resolve(projectRoot, "public"),
  plugins: [react()],
  resolve: {
    alias: [
      { find: "next/dynamic", replacement: resolve(projectRoot, "github-pages/shims/next-dynamic.tsx") },
      { find: "next/link", replacement: resolve(projectRoot, "github-pages/shims/next-link.tsx") },
    ],
  },
  build: {
    outDir: resolve(projectRoot, "pages-dist"),
    emptyOutDir: true,
  },
});
