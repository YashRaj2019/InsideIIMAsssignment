import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { yahooFinanceService } from '../services/yahooFinance.js';
import { logger } from '../utils/logger.js';

export const companyProfileTool = new DynamicStructuredTool({
  name: 'company_profile_tool',
  description: 'Fetches the company profile including sector, industry, long business summary and standard metadata. Input should be a stock ticker symbol.',
  schema: z.object({
    ticker: z.string().describe('The stock ticker symbol of the company (e.g. AAPL, MSFT, TSLA)')
  }),
  func: async ({ ticker }) => {
    try {
      logger.info(`Tool company_profile_tool called for ticker: ${ticker}`);
      const data = await yahooFinanceService.getFinancials(ticker);
      return JSON.stringify({
        companyName: data.companyName,
        ticker: data.ticker,
        sector: data.sector,
        industry: data.industry,
        businessSummary: data.businessSummary
      }, null, 2);
    } catch (error) {
      logger.error(`Error in company_profile_tool: ${error.message}`);
      return `Failed to retrieve company profile: ${error.message}`;
    }
  }
});
