import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const schema = {
  title: "InvestmentAnalysis",
  type: 'object',
  properties: {
    company: { type: 'string' },
    sector: { type: 'string' },
    industry: { type: 'string' },
    marketCap: { type: 'string' },
    stockPrice: { type: 'string' },
    businessSummary: { type: 'string' },
    financialHealth: {
      type: 'object',
      properties: {
        revenueGrowth: { type: 'string' },
        profitability: { type: 'string' },
        debt: { type: 'string' },
        cashFlow: { type: 'string' }
      },
      required: ['revenueGrowth', 'profitability', 'debt', 'cashFlow']
    },
    growthPotential: { type: 'string' },
    competitiveAdvantages: {
      type: 'array',
      items: { type: 'string' }
    },
    risks: {
      type: 'array',
      items: { type: 'string' }
    },
    latestNewsSummary: {
      type: 'array',
      items: { type: 'string' }
    },
    recommendation: { type: 'string', enum: ['Invest', 'Pass'] },
    confidence: { type: 'integer' },
    reasoning: { type: 'string' }
  },
  required: [
    'company', 'sector', 'industry', 'marketCap', 'stockPrice',
    'businessSummary', 'financialHealth', 'growthPotential',
    'competitiveAdvantages', 'risks', 'latestNewsSummary',
    'recommendation', 'confidence', 'reasoning'
  ]
};

async function run() {
  console.log('Testing withStructuredOutput with gemini-3.5-flash...');
  try {
    const baseModel = new ChatGoogleGenerativeAI({
      model: 'gemini-3.5-flash',
      apiKey: apiKey,
      temperature: 0.2
    });

    const model = baseModel.withStructuredOutput(schema);
    const res = await model.invoke('Perform an investment analysis on Apple Inc. (AAPL) and return the structured JSON.');
    console.log('SUCCESS! Parsed object:', res);
  } catch (err) {
    console.error('FAILED structured test:', err.message);
  }
}

run();
