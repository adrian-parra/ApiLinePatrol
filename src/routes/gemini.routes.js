import express from 'express';
import { correctText } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/correct-text', correctText);

export default router;