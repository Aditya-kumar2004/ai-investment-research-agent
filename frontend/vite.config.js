import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.js (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "server" },
      router: {
        disableTypes: true,
        generatedRouteTree: "routeTree.gen.js",
      },
    }),
    {
      name: "strip-ts-types-from-route-tree",
      transform(code, id) {
        if (id.replace(/\\/g, "/").endsWith("src/routeTree.gen.js")) {
          // Use zero-dependency regex to strip out the 'import type' line
          const cleanCode = code.replace(
            /import\s+type\s+\{\s*getRouter\s*\}\s+from\s+['"].*?['"]/g,
            ""
          );
          return {
            code: cleanCode,
            map: null,
          };
        }
        return null;
      },
    },
    react(),
    command === "build" ? nitro() : null,
  ].filter(Boolean),
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
}));
