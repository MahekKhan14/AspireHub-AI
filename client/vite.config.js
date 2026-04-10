import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:5000",
      "/mentor": "http://localhost:5000",
      "/career": "http://localhost:5000",
    },
  },
});
