import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { wikipediaService } from '../services/wikipedia.js';
import { logger } from '../utils/logger.js';

export const wikipediaTool = new DynamicStructuredTool({
  name: 'wikipedia_tool',
  description: 'Fetches the Wikipedia article summary for a company to provide historical and business model context. Input should be the company name.',
  schema: z.object({
    companyName: z.string().describe('The name of the company (e.g. Tesla, Nvidia)')
  }),
  func: async ({ companyName }) => {
    try {
      logger.info(`Tool wikipedia_tool called for companyName: ${companyName}`);
      const summary = await wikipediaService.getCompanySummary(companyName);
      return summary;
    } catch (error) {
      logger.error(`Error in wikipedia_tool: ${error.message}`);
      return `Failed to retrieve Wikipedia summary: ${error.message}`;
    }
  }
});
