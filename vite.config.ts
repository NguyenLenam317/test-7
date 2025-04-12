import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from 'url';
import path from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import cartographer only in development mode
const cartographerPlugin = async () => {
  if (process.env.NODE_ENV !== "production") {
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer");
      return cartographer.cartographer();
    } catch (e) {
      console.warn("Cartographer plugin not available", e);
      return null;
    }
  }
  return null;
};

export default defineConfig(async () => {
  const cartographer = await cartographerPlugin();
  
  return {
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    cartographer,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
};
});
