import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// https://vitejs.dev/config/
export default () => {
  dotenv.config();
  return defineConfig({
    root: "./frontend",
    plugins: [react()],
    server: {
      port: Number(process.env.FRONTEND_PORT) || 3001,
    },
    build: {
      outDir: "../build/public",
    },
  });
};
