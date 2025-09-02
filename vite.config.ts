import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts:
      "958db4a7-35c9-45d4-8168-8f886e6119fb-00-1rncq8f39261j.kirk.replit.dev",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
