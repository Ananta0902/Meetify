import express from 'express';
import { handleAIFeature } from '../controllers/aiController.js';

const router = express.Router();

// Single unified route for all AI operations
router.post('/chat', handleAIFeature);

export default router;
