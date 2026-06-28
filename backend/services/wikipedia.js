import axios from 'axios';
import { logger } from '../utils/logger.js';

export const wikipediaService = {
  /**
   * Fetch a summary of a company from Wikipedia.
   */
  getCompanySummary: async (companyName) => {
    try {
      logger.info(`Fetching Wikipedia summary for company: ${companyName}`);
      
      // Step 1: Search Wikipedia for the closest page title
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(companyName)}&format=json&origin=*`;
      const searchResponse = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'EquityEyeResearchAgent/1.0 (contact: info@equityeye.local)'
        },
        timeout: 3000
      });
      
      const searchResults = searchResponse.data?.query?.search;
      if (!searchResults || searchResults.length === 0) {
        logger.warn(`No Wikipedia pages found for query: ${companyName}`);
        return `No Wikipedia summary found for ${companyName}.`;
      }

      // Use the first search result title
      const pageTitle = searchResults[0].title;
      logger.info(`Wikipedia best page match: "${pageTitle}"`);

      // Step 2: Fetch the summary of that page using REST API
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
      const summaryResponse = await axios.get(summaryUrl, {
        headers: { 
          'User-Agent': 'EquityEyeResearchAgent/1.0 (contact: info@equityeye.local)' 
        },
        timeout: 3000
      });

      if (summaryResponse.data && summaryResponse.data.extract) {
        return summaryResponse.data.extract;
      }

      return `Wikipedia match found for "${pageTitle}" but failed to extract description.`;
    } catch (error) {
      logger.error(`Error fetching Wikipedia summary for "${companyName}": ${error.message}`);
      return `Unable to retrieve Wikipedia summary for "${companyName}" due to an API error.`;
    }
  }
};
