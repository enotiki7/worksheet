import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@company/ui": fileURLToPath(new URL("./src/ui", import.meta.url)),
    },
  },
});
