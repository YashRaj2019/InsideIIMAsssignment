import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage path in backend/data/history.json
const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'history.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
}

export const jsonStore = {
  getAll: async () => {
    try {
      const data = await fs.promises.readFile(FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to read JSON history file:', error);
      return [];
    }
  },

  add: async (report) => {
    try {
      const data = await fs.promises.readFile(FILE_PATH, 'utf-8');
      const list = JSON.parse(data);
      
      const newRecord = {
        _id: report._id || new Date().getTime().toString(),
        createdAt: report.createdAt || new Date().toISOString(),
        ...report
      };
      
      list.unshift(newRecord); // Prepend to show latest first
      await fs.promises.writeFile(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
      logger.info(`Report saved to local JSON store: ${report.company}`);
      return newRecord;
    } catch (error) {
      logger.error('Failed to save to JSON history file:', error);
      return report;
    }
  },

  delete: async (id) => {
    try {
      const data = await fs.promises.readFile(FILE_PATH, 'utf-8');
      const list = JSON.parse(data);
      const filtered = list.filter(item => item._id !== id);
      await fs.promises.writeFile(FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
      logger.info(`Report deleted from local JSON store: ${id}`);
      return true;
    } catch (error) {
      logger.error('Failed to delete from JSON history file:', error);
      return false;
    }
  },

  clear: async () => {
    try {
      await fs.promises.writeFile(FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
      logger.info('Clear all history in local JSON store succeeded.');
      return true;
    } catch (error) {
      logger.error('Failed to clear JSON history file:', error);
      return false;
    }
  }
};
