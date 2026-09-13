// vite.config.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // Override the default Cloudflare plugin with the Netlify one
    plugins: [netlify()],
  },
});