import express from 'express';
import { 
  analyzeCompany, getHistory, deleteHistoryItem, clearAllHistory 
} from '../controllers/analysisController.js';

const router = express.Router();

// Define research agent endpoints
router.post('/analyze', analyzeCompany);
router.get('/history', getHistory);
router.delete('/history/:id', deleteHistoryItem);
router.delete('/history', clearAllHistory);

export default router;
