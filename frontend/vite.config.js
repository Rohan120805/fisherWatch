import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import https from 'https';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.join(__dirname, '../certs/client/client.key')),
      cert: fs.readFileSync(path.join(__dirname, '../certs/client/client.crt')),
      ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt'))
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:5000',
        secure: false,
        changeOrigin: true,
        agent: new https.Agent({
          key: fs.readFileSync(path.join(__dirname, '../certs/client/client.key')),
          cert: fs.readFileSync(path.join(__dirname, '../certs/client/client.crt')),
          ca: fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
          rejectUnauthorized: false
        })
      }
    }
  }
});