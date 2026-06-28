import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import analysisRoutes from './routes/analysisRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: getDbStatus() ? 'connected' : 'fallback_json_store',
    geminiKeyConfigured: !!process.env.GEMINI_API_KEY,
    newsKeyConfigured: !!process.env.NEWS_API_KEY,
    tavilyKeyConfigured: !!process.env.TAVILY_API_KEY
  });
});

// Register routes
app.use('/api', analysisRoutes);

// Catch-all 404 handler for routes not found
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler middleware
app.use(errorHandler);

// Connect Database & Start Server
const startServer = async () => {
  try {
    // Connect to database (falls back to local JSON if fails)
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Backend server running on port: ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error(`Critical error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
