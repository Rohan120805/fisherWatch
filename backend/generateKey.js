import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a secure random key
const clientKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Client Key:', clientKey);

// Update .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Add or update CLIENT_KEY
const updatedContent = envContent.includes('CLIENT_KEY=') 
  ? envContent.replace(/CLIENT_KEY=.*/, `CLIENT_KEY=${clientKey}`)
  : envContent + `\nCLIENT_KEY=${clientKey}`;

fs.writeFileSync(envPath, updatedContent);
console.log('Client key has been added to .env file');