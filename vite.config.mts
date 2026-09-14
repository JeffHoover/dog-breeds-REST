import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  // Temporary CRA compatibility bridge. We will replace this with
  // import.meta.env when Vite becomes the sole build system.
  define: {
    "process.env.REACT_APP_API_URL": JSON.stringify(""),
  },
});

