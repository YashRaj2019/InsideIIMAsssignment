import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  company: { type: String, required: true },
  ticker: { type: String, required: true },
  sector: { type: String },
  industry: { type: String },
  marketCap: { type: String },
  stockPrice: { type: String },
  businessSummary: { type: String },
  financialHealth: {
    revenueGrowth: { type: String },
    profitability: { type: String },
    debt: { type: String },
    cashFlow: { type: String }
  },
  growthPotential: { type: String },
  competitiveAdvantages: [{ type: String }],
  risks: [{ type: String }],
  latestNewsSummary: [{ type: String }],
  recommendation: { type: String, enum: ['Invest', 'Pass'], required: true },
  confidence: { type: Number, required: true },
  reasoning: { type: String, required: true },
  historicalData: { type: mongoose.Schema.Types.Mixed } // To store chart data coordinates
}, {
  timestamps: true
});

// Use existing model or compile new one
export const Analysis = mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);
export default Analysis;
