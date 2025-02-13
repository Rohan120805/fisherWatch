import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import towerRoutes from './routes/tower.routes.js';
import { clerkMiddleware } from '@clerk/express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS configuration with security headers
app.use(cors({
  origin: [process.env.CLIENT],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept'
  ],
  optionsSuccessStatus: 200,
  maxAge: 600
}));

app.use((req, res, next) => {
  if (!req.client.authorized) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
});

// Regular middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/api', towerRoutes);

// Load certificates and keys
const options = {
  key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH)),
  cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH)),
  ca: fs.readFileSync(path.join(__dirname, process.env.SSL_CA_PATH)),
  requestCert: true,
  rejectUnauthorized: true
};

https.createServer(options, app).listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.SERVER}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});

export default app;