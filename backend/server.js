import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { addOrUpdateTowers, getTowers } from './controllers/tower.controller.js';
import userRoutes from './routes/user.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import fs from 'fs';
import session from 'express-session';

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

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Requires HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Client certificate authentication
app.use((req, res, next) => {
  if (!req.client.authorized) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
});

// Regular middleware
app.use(express.json());

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Please login first' });
  }
  next();
};

connectDB();

// API routes
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Auth routes - no authentication required
app.use('/api/users', userRoutes);

// Tower routes - POST without auth, GET with auth
app.post('/api/towers', addOrUpdateTowers); // No auth required
app.get('/api/towers', requireAuth, getTowers); // Auth required

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Load certificates and keys
const options = {
  key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH)),
  cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH)),
  ca: fs.readFileSync(path.join(__dirname, process.env.SSL_CA_PATH)),
  requestCert: true,
  rejectUnauthorized: true
};

// Create HTTPS server
https.createServer(options, app).listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.SERVER}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});

export default app;