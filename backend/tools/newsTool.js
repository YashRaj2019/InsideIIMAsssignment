import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { newsService } from '../services/newsApi.js';
import { logger } from '../utils/logger.js';

export const latestNewsTool = new DynamicStructuredTool({
  name: 'latest_news_tool',
  description: 'Fetches recent news articles and press releases for a company. Input requires the company name and optionally its stock ticker.',
  schema: z.object({
    companyName: z.string().describe('The name of the company (e.g. Apple, Microsoft)'),
    ticker: z.string().describe('The stock ticker symbol (e.g. AAPL, MSFT)')
  }),
  func: async ({ companyName, ticker }) => {
    try {
      logger.info(`Tool latest_news_tool called for: ${companyName} (${ticker})`);
      const news = await newsService.getNews(companyName, ticker);
      return JSON.stringify(news, null, 2);
    } catch (error) {
      logger.error(`Error in latest_news_tool: ${error.message}`);
      return `Failed to retrieve news articles: ${error.message}`;
    }
  }
});
