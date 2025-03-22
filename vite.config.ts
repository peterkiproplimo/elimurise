import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
    rollupOptions: {
      output: {
        // Customize chunk file names
        chunkFileNames: "assets/[name]-[hash].chunk.js",
        entryFileNames: "assets/[name]-[hash].js",
        // Manual chunking logic
        manualChunks(id: string) {
          // Split each page in src/pages/ into its own chunk
          if (id.includes("src/pages")) {
            const pageName = path.basename(id, ".tsx").toLowerCase();
            return `page-${pageName}`;
          }
          // Vendor chunks for node_modules
          if (id.includes("node_modules")) {
            const moduleName = id.split("node_modules/")[1].split("/")[0];
            return `vendor-${moduleName}`;
          }
          // Optional: Group shared components or utils
          if (id.includes("src/components") || id.includes("src/utils")) {
            return "shared";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ["tailwind-config"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
    },
  },
});
