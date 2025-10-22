import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/v1": {
        target: "https://blog-backend-zd07.onrender.com",
        changeOrigin: true,
        secure: false
      },
    },
  },
});
