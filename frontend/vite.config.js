import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Get the absolute path to the project root
const projectRoot = path.resolve(__dirname, '..');

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  define: {
    'process.env': {}
  }
});