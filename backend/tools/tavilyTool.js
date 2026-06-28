import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { tavilyService } from '../services/tavily.js';
import { logger } from '../utils/logger.js';

export const tavilySearchTool = new DynamicStructuredTool({
  name: 'tavily_search_tool',
  description: 'Performs web searches for real-time market trends, industry news, competitor analysis, and risk factors. Input is a search query.',
  schema: z.object({
    query: z.string().describe('The web search query (e.g., "Nvidia competitive advantage and competitor risks 2026")')
  }),
  func: async ({ query }) => {
    try {
      logger.info(`Tool tavily_search_tool called with query: "${query}"`);
      const results = await tavilyService.search(query);
      return results;
    } catch (error) {
      logger.error(`Error in tavily_search_tool: ${error.message}`);
      return `Failed to perform web search: ${error.message}`;
    }
  }
});
