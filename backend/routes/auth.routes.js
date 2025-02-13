import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Admin route example  
router.get('/admin', auth, isAdmin, (req, res) => {
  res.json({ message: 'Admin route accessed successfully' });
});

export default router;