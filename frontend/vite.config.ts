import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@backend": path.resolve(__dirname, "../backend"),
      "@schema": path.resolve(__dirname, "../backend/src/schema"),
    },
  },
  server: {
    proxy: {
      "/api/trpc": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
