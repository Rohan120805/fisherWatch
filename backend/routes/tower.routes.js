import express from 'express';
import { addOrUpdateTowers, getTowers } from '../controllers/tower.controller.js';

const router = express.Router();

router.post('/towers', addOrUpdateTowers);
router.get('/towers', getTowers);

export default router;