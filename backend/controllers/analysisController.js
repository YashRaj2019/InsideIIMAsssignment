import { Analysis } from '../schemas/analysis.js';
import { getDbStatus } from '../config/db.js';
import { jsonStore } from '../utils/jsonStore.js';
import { researchAgent } from '../agents/researchAgent.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/analyze
 * Body: { "company": "Tesla" }
 */
export const analyzeCompany = async (req, res, next) => {
  const { company } = req.body;
  
  if (!company || company.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Company name or stock ticker symbol is required.'
    });
  }

  try {
    logger.info(`API request received to analyze company: "${company}"`);
    const report = await researchAgent.analyzeCompany(company);

    let savedReport;
    if (getDbStatus()) {
      savedReport = await Analysis.create(report);
      logger.info(`Saved report to MongoDB for ${company}`);
    } else {
      savedReport = await jsonStore.add(report);
      logger.info(`Saved report to local JSON file for ${company}`);
    }

    return res.status(200).json({
      success: true,
      data: savedReport
    });
  } catch (error) {
    logger.error(`Error in /api/analyze controller: ${error.message}`);
    next(error);
  }
};

/**
 * GET /api/history
 */
export const getHistory = async (req, res, next) => {
  try {
    logger.info('API request received to fetch research history.');
    let history;

    if (getDbStatus()) {
      history = await Analysis.find().sort({ createdAt: -1 });
    } else {
      history = await jsonStore.getAll();
    }

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    logger.error(`Error in /api/history controller: ${error.message}`);
    next(error);
  }
};

/**
 * DELETE /api/history/:id
 */
export const deleteHistoryItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    logger.info(`API request received to delete research report: ${id}`);
    if (getDbStatus()) {
      await Analysis.findByIdAndDelete(id);
    } else {
      await jsonStore.delete(id);
    }
    return res.status(200).json({
      success: true,
      message: 'Report deleted successfully.'
    });
  } catch (error) {
    logger.error(`Error in deleteHistoryItem: ${error.message}`);
    next(error);
  }
};

/**
 * DELETE /api/history
 */
export const clearAllHistory = async (req, res, next) => {
  try {
    logger.info('API request received to clear all research history.');
    if (getDbStatus()) {
      await Analysis.deleteMany({});
    } else {
      await jsonStore.clear();
    }
    return res.status(200).json({
      success: true,
      message: 'All research history cleared successfully.'
    });
  } catch (error) {
    logger.error(`Error in clearAllHistory: ${error.message}`);
    next(error);
  }
};

export default {
  analyzeCompany,
  getHistory,
  deleteHistoryItem,
  clearAllHistory
};
