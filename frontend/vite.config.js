import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.join(__dirname, process.env.VITE_CLIENT_KEY_PATH)),
      cert: fs.readFileSync(path.join(__dirname, process.env.VITE_CLIENT_CERT_PATH)),
      ca: fs.readFileSync(path.join(__dirname, process.env.VITE_CA_CERT_PATH))
    },
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        secure: false,
        changeOrigin: true,
        agent: new https.Agent({
          key: fs.readFileSync(path.join(__dirname, process.env.VITE_CLIENT_KEY_PATH)),
          cert: fs.readFileSync(path.join(__dirname, process.env.VITE_CLIENT_CERT_PATH)), 
          ca: fs.readFileSync(path.join(__dirname, process.env.VITE_CA_CERT_PATH)),
          rejectUnauthorized: false
        })
      }
    }
  }
});