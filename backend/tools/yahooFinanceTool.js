import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { yahooFinanceService } from '../services/yahooFinance.js';
import { logger } from '../utils/logger.js';

export const financialMetricsTool = new DynamicStructuredTool({
  name: 'financial_metrics_tool',
  description: 'Fetches detailed financial health metrics for a company including revenue, growth, margins, D/E ratio, and cash flow. Input should be a stock ticker symbol.',
  schema: z.object({
    ticker: z.string().describe('The stock ticker symbol of the company (e.g. AAPL, MSFT, TSLA)')
  }),
  func: async ({ ticker }) => {
    try {
      logger.info(`Tool financial_metrics_tool called for ticker: ${ticker}`);
      const data = await yahooFinanceService.getFinancials(ticker);
      return JSON.stringify({
        ticker: data.ticker,
        companyName: data.companyName,
        stockPrice: data.stockPrice,
        marketCap: data.marketCap,
        peRatio: data.peRatio,
        metrics: data.metrics
      }, null, 2);
    } catch (error) {
      logger.error(`Error in financial_metrics_tool: ${error.message}`);
      return `Failed to retrieve financial metrics: ${error.message}`;
    }
  }
});
