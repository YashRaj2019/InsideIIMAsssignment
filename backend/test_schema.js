import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const schema = {
  type: 'OBJECT',
  properties: {
    company: { type: 'STRING' },
    sector: { type: 'STRING' },
    industry: { type: 'STRING' },
    marketCap: { type: 'STRING' },
    stockPrice: { type: 'STRING' },
    businessSummary: { type: 'STRING' },
    financialHealth: {
      type: 'OBJECT',
      properties: {
        revenueGrowth: { type: 'STRING' },
        profitability: { type: 'STRING' },
        debt: { type: 'STRING' },
        cashFlow: { type: 'STRING' }
      },
      required: ['revenueGrowth', 'profitability', 'debt', 'cashFlow']
    },
    growthPotential: { type: 'STRING' },
    competitiveAdvantages: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    risks: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    latestNewsSummary: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    recommendation: { type: 'STRING' },
    confidence: { type: 'INTEGER' },
    reasoning: { type: 'STRING' }
  },
  required: [
    'company', 'sector', 'industry', 'marketCap', 'stockPrice',
    'businessSummary', 'financialHealth', 'growthPotential',
    'competitiveAdvantages', 'risks', 'latestNewsSummary',
    'recommendation', 'confidence', 'reasoning'
  ]
};

async function run() {
  console.log('Testing schema enforcement with gemini-3.5-flash...');
  try {
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-3.5-flash',
      apiKey: apiKey,
      modelKwargs: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });

    const res = await model.invoke('Analyze Apple Inc briefly and output JSON matching the schema.');
    console.log('SUCCESS! Response contents:', res.content || res.text);
    console.log('Parsed successfully:', JSON.parse(res.content || res.text));
  } catch (err) {
    console.error('FAILED schema test:', err.message);
  }
}

run();
