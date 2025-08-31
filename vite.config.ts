import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "localhost",
      ".replit.dev",
      ".repl.co"
    ],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        timeout: 15000,
        proxyTimeout: 15000,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            if (err.code === 'ECONNREFUSED') {
              // Server might still be starting up
              if (!res.headersSent) {
                res.writeHead(503, {
                  'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({
                  success: false,
                  error: 'Backend server is starting up, please wait...',
                  code: 'SERVER_STARTING'
                }));
              }
            } else {
              console.log('Proxy error:', err.message);
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to:', proxyReq.path);
          });
        },
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
    minify: true,
    sourcemap: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));