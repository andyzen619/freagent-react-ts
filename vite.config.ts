import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import { ConfigUI } from './ui/config.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./ui/routes"
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./ui"),
    },
  },
  server: {
    host: true,
    allowedHosts: [`${ConfigUI.URL_PREFIX}.ngrok-free.app`],
  },
});
