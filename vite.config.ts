import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import codegen from "vite-plugin-graphql-codegen";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), codegen()],
    server: {
      proxy: {
        "/api": {
          target: "http://" + env.VITE_API_HOST,
        },
        "/api/graphql": {
          target: "ws://" + env.VITE_API_HOST,
          ws: true,
        }
      }
    }
  };
});
