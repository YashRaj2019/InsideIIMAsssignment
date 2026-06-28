import axios from 'axios';
import { logger } from '../utils/logger.js';

export const tavilyService = {
  /**
   * Search the web for specific research topics related to the company.
   */
  search: async (query) => {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      logger.warn(`TAVILY_API_KEY not configured. Skipping Tavily web search for query: "${query}"`);
      return `Tavily Search API key missing. Could not perform web search query: "${query}"`;
    }

    try {
      logger.info(`Performing Tavily search for: "${query}"`);
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: apiKey,
        query: query,
        search_depth: 'basic',
        max_results: 5
      }, { timeout: 6000 });

      if (response.data && response.data.results) {
        // Concatenate snippets into a single text block
        const summary = response.data.results
          .map(res => `- Title: ${res.title}\n  Source: ${res.url}\n  Summary: ${res.content}`)
          .join('\n\n');
        logger.info(`Tavily search completed with ${response.data.results.length} results.`);
        return summary;
      }

      return 'No Tavily search results found.';
    } catch (error) {
      logger.error(`Tavily search failed for "${query}": ${error.message}`);
      return `Tavily search failed: ${error.message}`;
    }
  }
};
