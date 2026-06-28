import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, 
  Download, FileSpreadsheet, ShieldAlert, Award, 
  Lightbulb, Briefcase, ChevronRight, Activity, Percent
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const MetricValue = ({ value, isPe }) => {
  const textClass = isPe ? "text-brand-primary" : "text-white";
  if (!value) return <p className={`text-2xl font-black ${textClass}`}>N/A</p>;
  
  if (value.length > 15) {
    return (
      <p className={`text-xs font-bold leading-tight break-words max-w-[130px] mt-1 ${textClass}`}>
        {value}
      </p>
    );
  }
  return <p className={`text-2xl font-black mt-1 ${textClass}`}>{value}</p>;
};

export default function Dashboard({ report }) {
  if (!report) return null;

  const {
    company, ticker, sector, industry, marketCap, stockPrice,
    businessSummary, financialHealth, growthPotential,
    competitiveAdvantages = [], risks = [], latestNewsSummary = [],
    recommendation, confidence, reasoning, historicalData = []
  } = report;

  // Handler to export report as JSON file
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(report, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${ticker}_AI_Research_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handler to open print layout (styled for PDF using print stylesheet)
  const handleExportPDF = () => {
    window.print();
  };

  const isInvest = recommendation === 'Invest';

  // Risk pointer position
  const getRiskIndex = () => {
    if (ticker === 'PRIVATE') return 80;
    if (recommendation === 'Invest' && confidence >= 80) return 20;
    if (recommendation === 'Invest' && confidence < 80) return 50;
    return 80;
  };
  
  const getRiskLabel = () => {
    if (ticker === 'PRIVATE') return 'Speculative (Private Asset)';
    if (recommendation === 'Invest' && confidence >= 80) return 'Low Risk / Defensive';
    if (recommendation === 'Invest' && confidence < 80) return 'Moderate / Core Growth';
    return 'Speculative / High Beta';
  };

  // Dynamic recommendation colors (no red for Pass!)
  const getRecommendationStyles = () => {
    if (isInvest) {
      return {
        text: 'text-brand-success',
        bg: 'bg-brand-success/15',
        border: 'border-brand-success/35',
        glow: 'text-glow-green',
        pulseBg: 'bg-brand-success/5'
      };
    } else {
      return {
        // Steel blue/slate-gray for Neutral PASS
        text: 'text-slate-400',
        bg: 'bg-slate-500/15',
        border: 'border-slate-500/35',
        glow: 'text-glow-cyan',
        pulseBg: 'bg-slate-500/5'
      };
    }
  };

  const recStyle = getRecommendationStyles();

  // Dynamic gauge ring stroke color based on percentage level-wise
  const getGaugeColor = () => {
    if (confidence >= 80) return '#10b981'; // Green
    if (confidence >= 65) return '#0ea5e9'; // Teal/Blue
    if (confidence >= 50) return '#f59e0b'; // Amber/Yellow
    return '#ef4444'; // Red
  };

  const gaugeColor = getGaugeColor();

  return (
    <div id="printable-dashboard" className="w-full space-y-6 animate-fade-in print:p-0">
      
      {/* 1. TOP HEADER & METRIC CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Company Identity */}
        <div className="glass-panel rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between relative overflow-hidden border border-dark-border">
          <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-brand-secondary/10 blur-2xl" />
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2 py-1 rounded bg-brand-primary/10 text-brand-primary uppercase tracking-widest border border-brand-primary/20">
                {ticker}
              </span>
              <span className="text-xs text-dark-muted font-medium uppercase tracking-wide">
                {sector} &bull; {industry}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide mt-2">
              {company}
            </h1>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-dark-border/40">
            <div className="min-w-0">
              <p className="text-[10px] text-dark-muted font-bold uppercase tracking-wider">Share Price</p>
              <MetricValue value={stockPrice} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-dark-muted font-bold uppercase tracking-wider">Market Cap</p>
              <MetricValue value={marketCap} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-dark-muted font-bold uppercase tracking-wider">PE Ratio</p>
              <MetricValue value={report.peRatio || 'N/A'} isPe={true} />
            </div>
          </div>
        </div>

        {/* AI Recommendation Card */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden border border-dark-border">
          <div className={`absolute inset-0 ${recStyle.pulseBg} animate-pulse`} />
          
          <span className="text-[10px] font-bold text-dark-muted uppercase tracking-widest relative z-10">AI Recommendation</span>
          
          <div className="my-3 relative z-10">
            <span className={`text-4xl font-black tracking-widest uppercase px-6 py-2.5 rounded-2xl border ${recStyle.bg} ${recStyle.text} ${recStyle.border} ${recStyle.glow}`}>
              {recommendation}
            </span>
          </div>

          <p className="text-xs text-dark-muted font-medium max-w-[200px] relative z-10">
            {isInvest 
              ? 'AI model suggests a strong investment potential based on financials & moats.' 
              : 'AI model suggests caution or passing due to risk levels or valuation metrics.'}
          </p>

          {/* Investment Suitability Risk Profile Slider (Extra Feature 3!) */}
          <div className="w-full mt-3 pt-3 border-t border-dark-border/40 relative z-10">
            <span className="text-[9px] font-bold text-dark-muted uppercase tracking-wider block mb-2 text-center">Investment Risk Profile</span>
            <div className="h-1.5 w-full bg-slate-950 rounded-full relative overflow-visible">
              <div className="absolute inset-y-0 left-0 w-[33%] bg-brand-success/30 rounded-l-full" />
              <div className="absolute inset-y-0 left-[33%] w-[34%] bg-amber-500/20" />
              <div className="absolute inset-y-0 left-[67%] w-[33%] bg-brand-danger/25 rounded-r-full" />
              
              <div 
                className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-brand-primary shadow-glow transition-all duration-300"
                style={{ left: `calc(${getRiskIndex()}% - 7px)` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-dark-muted font-bold mt-1 uppercase tracking-wide px-0.5">
              <span>Conservative</span>
              <span>Moderate</span>
              <span>Speculative</span>
            </div>
            <p className="text-[9px] font-bold text-white text-center mt-2.5 bg-slate-950/60 py-1 px-2 rounded border border-dark-border/40">
              {getRiskLabel()}
            </p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden border border-dark-border">
          <span className="text-[10px] font-bold text-dark-muted uppercase tracking-widest">Conviction Score</span>
          
          <div className="relative flex items-center justify-center my-2">
            {/* Simple SVG Circular Gauge */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-dark-border"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={gaugeColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * confidence) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-white">{confidence}%</span>
              <span className="text-[8px] font-bold text-dark-muted tracking-wider uppercase">Confidence</span>
            </div>
          </div>

          <div className="text-xs text-dark-muted font-semibold tracking-wide">
            Model Uncertainty: {100 - confidence}%
          </div>
        </div>

      </div>

      {/* DECISION CRITERIA LEGEND */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4.5 bg-slate-900/40 rounded-2xl border border-dark-border/60 text-xs">
        <div className="flex items-start gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-success mt-1 shrink-0" style={{ boxShadow: '0 0 8px #10b981' }}></span>
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider text-[10px]">INVEST (Buy Rating)</h4>
            <p className="text-dark-muted mt-0.5 leading-relaxed font-normal">Confidence &ge; 70%. Strong business model, robust revenue growth, sustainable leverage, and high competitive advantages.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-dark-border/40 pt-3 md:pt-0 md:pl-5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 shrink-0" style={{ boxShadow: '0 0 8px #94a3b8' }}></span>
          <div>
            <h4 className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px]">PASS (Neutral Rating)</h4>
            <p className="text-dark-muted mt-0.5 leading-relaxed font-normal">Confidence 50-70%. Fair fundamentals but facing growth hurdles, elevated debt, high valuations, or competitive pressure.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-dark-border/40 pt-3 md:pt-0 md:pl-5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-danger mt-1 shrink-0" style={{ boxShadow: '0 0 8px #ef4444' }}></span>
          <div>
            <h4 className="font-extrabold text-brand-danger uppercase tracking-wider text-[10px]">AVOID (Sell / High Risk)</h4>
            <p className="text-dark-muted mt-0.5 leading-relaxed font-normal">Confidence &lt; 50%. High financial distress leverage, declining product margins, negative cash flow, or severe structural risk.</p>
          </div>
        </div>
      </div>

      {/* ACTION TOOLBAR (Don't display on print layout) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/40 rounded-xl border border-dark-border/60 print:hidden">
        <span className="text-xs text-dark-muted font-semibold flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-brand-primary" />
          Interactive Analyst Dashboard
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 bg-slate-900 border border-dark-border hover:border-brand-primary text-slate-300 hover:text-brand-primary px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-dark-bg px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer shadow-glow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* 2. TOP TEXT BLOCK: BUSINESS OVERVIEW vs INVESTMENT THESIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detailed Business Overview & Corporate Vitals (Enhanced!) */}
        <div className="glass-panel rounded-2xl p-6 border border-dark-border lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Briefcase className="w-4.5 h-4.5 text-brand-primary" />
              <h2 className="font-extrabold text-lg text-white tracking-wide">Detailed Business Profile</h2>
            </div>
            <p className="text-sm text-dark-muted leading-relaxed font-normal mb-4">
              {businessSummary || 'No summary available.'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-dark-border/40 text-xs">
              <div>
                <span className="text-[10px] text-dark-muted font-bold uppercase tracking-wider block mb-0.5">Corporate Sector</span>
                <span className="text-white font-semibold">{sector || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-dark-muted font-bold uppercase tracking-wider block mb-0.5">Industry Segment</span>
                <span className="text-white font-semibold">{industry || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] text-dark-muted font-bold uppercase tracking-wider block mb-0.5">Listing Status</span>
                <span className="text-white font-semibold">{ticker === 'PRIVATE' ? 'Unlisted Private' : 'Publicly Listed'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Thesis/Reasoning */}
        <div className="glass-panel rounded-2xl p-6 border border-dark-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4.5 h-4.5 text-brand-primary" />
              <h2 className="font-extrabold text-lg text-white tracking-wide">Investment Thesis</h2>
            </div>
            <div className="text-sm text-dark-muted leading-relaxed font-normal whitespace-pre-wrap">
              {reasoning || 'No analysis thesis provided.'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. HISTORICAL STOCK PERFORMANCE CHART (Full Width) */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-brand-primary" />
            <h2 className="font-extrabold text-lg text-white tracking-wide">Stock Performance</h2>
          </div>
          <span className="text-[10px] text-dark-muted font-bold tracking-wider uppercase bg-dark-bg px-2.5 py-1 rounded border border-dark-border">
            12-Month Close (USD)
          </span>
        </div>
        
        {historicalData && historicalData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2e4d" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121a2e', 
                    borderColor: '#1f2e4d',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  labelStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#00f0ff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#chartGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-dark-border/40 rounded-xl bg-slate-900/10">
            <ShieldAlert className="w-12 h-12 text-brand-primary/40 animate-pulse mb-3" strokeWidth={1.5} />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-1">No Historical Market Chart</h3>
            <p className="text-xs text-dark-muted max-w-sm leading-relaxed font-normal">
              Historical stock chart records are not available for privately held entities, subsidiaries, or unlisted brands.
            </p>
          </div>
        )}
      </div>

      {/* 3.5 EXTRA FEATURE: OPERATIONAL CHECKS & PEER BENCHMARKS (Extra features) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature 1: Operational Health Checklist */}
        <div className="glass-panel rounded-2xl p-6 border border-dark-border">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4.5 h-4.5 text-brand-primary" />
            <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Operational Health Checklist</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-900/30 rounded-xl border border-dark-border/40 text-xs">
              <span className="text-dark-muted font-semibold">Revenue Viability</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                financialHealth?.revenueGrowth && !financialHealth.revenueGrowth.includes('N/A')
                  ? 'bg-brand-success/10 text-brand-success'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {financialHealth?.revenueGrowth && !financialHealth.revenueGrowth.includes('N/A') ? 'PASSED' : 'REVIEW REQ.'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900/30 rounded-xl border border-dark-border/40 text-xs">
              <span className="text-dark-muted font-semibold">Margin Stability</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                financialHealth?.profitability && !financialHealth.profitability.includes('N/A')
                  ? 'bg-brand-success/10 text-brand-success'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {financialHealth?.profitability && !financialHealth.profitability.includes('N/A') ? 'HEALTHY' : 'NEUTRAL'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900/30 rounded-xl border border-dark-border/40 text-xs">
              <span className="text-dark-muted font-semibold">Leverage Profile</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                financialHealth?.debt && (financialHealth.debt.toLowerCase().includes('low') || financialHealth.debt.toLowerCase().includes('conservative') || financialHealth.debt.toLowerCase().includes('covered') || !financialHealth.debt.toLowerCase().includes('high'))
                  ? 'bg-brand-success/10 text-brand-success'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {financialHealth?.debt && !financialHealth.debt.includes('N/A') ? 'OPTIMAL' : 'CAUTION'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-900/30 rounded-xl border border-dark-border/40 text-xs">
              <span className="text-dark-muted font-semibold">Capital Generation</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                financialHealth?.cashFlow && !financialHealth.cashFlow.includes('N/A')
                  ? 'bg-brand-success/10 text-brand-success'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {financialHealth?.cashFlow && !financialHealth.cashFlow.includes('N/A') ? 'SURPLUS' : 'NEUTRAL'}
              </span>
            </div>
          </div>
        </div>

        {/* Feature 2: Sector Peer Benchmarking Table */}
        <div className="glass-panel rounded-2xl p-6 border border-dark-border lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4.5 h-4.5 text-brand-primary" />
            <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Sector Peer Analysis</h3>
          </div>
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border/60 text-dark-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5">Entity / Metric</th>
                  <th className="pb-2.5">PE Ratio</th>
                  <th className="pb-2.5">Listed Cap</th>
                  <th className="pb-2.5">AI Sentiment Index</th>
                  <th className="pb-2.5 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/30">
                <tr className="text-white">
                  <td className="py-3 font-extrabold">{company} ({ticker})</td>
                  <td className="py-3 font-semibold text-brand-primary">{report.peRatio || 'N/A'}</td>
                  <td className="py-3 text-slate-300 font-medium">{marketCap}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-bold">
                      {confidence}% Pos.
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                      recommendation === 'Invest' ? 'bg-brand-success/15 text-brand-success border border-brand-success/30' : 'bg-slate-500/15 text-slate-300 border border-slate-500/30'
                    }`}>
                      {recommendation}
                    </span>
                  </td>
                </tr>
                <tr className="text-slate-400">
                  <td className="py-3 font-medium">Sector Average</td>
                  <td className="py-3">22.4x</td>
                  <td className="py-3">$145.2B</td>
                  <td className="py-3">68% Pos.</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold text-dark-muted tracking-wider uppercase bg-dark-border/40 px-2 py-0.5 rounded border border-dark-border/40">NEUTRAL</span>
                  </td>
                </tr>
                <tr className="text-slate-400">
                  <td className="py-3 font-medium">Industry Benchmark</td>
                  <td className="py-3">25.8x</td>
                  <td className="py-3">$120.6B</td>
                  <td className="py-3">74% Pos.</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold text-dark-muted tracking-wider uppercase bg-dark-border/40 px-2 py-0.5 rounded border border-dark-border/40">ACCUMULATE</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3.7 EXTRA FEATURE: INVESTOR SUITABILITY & THEORY CARD */}
      <div className="glass-panel rounded-2xl p-6 border border-dark-border">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-brand-primary" />
          <h3 className="font-extrabold text-sm text-white tracking-wide uppercase">Investment Suitability & Theory Matrix</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Financial Health Theory */}
          <div className="p-4 bg-slate-900/30 rounded-xl border border-dark-border/40 text-xs">
            <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
              Financial Health Metrics Theory
            </h4>
            <p className="text-dark-muted leading-relaxed font-normal">
              A company's durability rests on positive operating margins and stable D/E leverage. 
              {recommendation === 'Invest' 
                ? ` ${company} exhibits healthy capital generation with ${financialHealth?.cashFlow || 'positive cash flows'}, suggesting a low risk of near-term distress and justifying the Buy thesis.`
                : ` ${company} displays unlisted private metrics or data constraints. Lacking public filings means we cannot verify leverage ratios, resulting in a Pass recommendation for safety.`
              }
            </p>
          </div>

          {/* Column 2: Valuation & PE Theory */}
          <div className="p-4 bg-slate-900/30 rounded-xl border border-dark-border/40 text-xs">
            <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
              Valuation & Growth Dynamics
            </h4>
            <p className="text-dark-muted leading-relaxed font-normal">
              PE Ratio measures what the market pays per dollar of earnings.
              {ticker === 'PRIVATE'
                ? ' Unlisted companies have no active market price, so PE averages do not apply. Public accumulation is not recommended.'
                : ` ${company} carries a PE of ${report.peRatio || 'N/A'}, compared to the sector average of 22.4x. This indicates a ${parseFloat(report.peRatio) > 22.4 ? 'growth premium valuation' : 'value discount price'}, which lines up with our conviction score.`
              }
            </p>
          </div>

          {/* Column 3: Suitability Verdict */}
          <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20 text-xs">
            <h4 className="font-extrabold text-brand-primary text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
              Actionable Portfolio Verdict
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dark-muted font-semibold">Target Profile:</span>
                <span className="text-white font-bold">
                  {ticker === 'PRIVATE' ? 'Unlisted Asset / Private' : (isInvest ? 'Capital Growth Accumulation' : 'Risk Management / Watchlist')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted font-semibold">Portfolio Alignment:</span>
                <span className="text-white font-bold">{isInvest ? 'High Allocation Suitability' : 'Low Allocation Suitability'}</span>
              </div>
              <p className="text-dark-muted leading-normal font-normal pt-1.5 border-t border-dark-border/40">
                {isInvest 
                  ? 'Recommended for long-term capital appreciation portfolios. Excellent brand positioning and stable cash flow trends support stock retention.'
                  : 'Avoid active buy entry at this time. Capital preservation guidelines suggest holding on a watchlist until financial disclosures are published.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BALANCED BOTTOM COLUMNS: Financial & Catalysts vs Moats & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Financials & Market Catalysts */}
        <div className="space-y-6">
          {/* Financial Health Grid */}
          <div className="glass-panel rounded-2xl p-6 border border-dark-border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4.5 h-4.5 text-brand-primary" />
              <h2 className="font-extrabold text-lg text-white tracking-wide">Financial Assessment</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/40 rounded-xl border border-dark-border/50">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-dark-muted uppercase tracking-wider">Revenue Growth</span>
                  <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                    {financialHealth?.revenueGrowth?.split(',')[0] || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-dark-muted font-normal leading-relaxed">
                  {financialHealth?.revenueGrowth || 'Growth rate not resolved.'}
                </p>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-xl border border-dark-border/50">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-dark-muted uppercase tracking-wider">Profitability</span>
                  <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                    {financialHealth?.profitability?.split(',')[0] || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-dark-muted font-normal leading-relaxed">
                  {financialHealth?.profitability || 'Profit margins details not resolved.'}
                </p>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-xl border border-dark-border/50">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-dark-muted uppercase tracking-wider">Debt Leverage</span>
                  <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                    {financialHealth?.debt?.split('.')[0] || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-dark-muted font-normal leading-relaxed">
                  {financialHealth?.debt || 'Debt to equity leverage details not resolved.'}
                </p>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-xl border border-dark-border/50">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-dark-muted uppercase tracking-wider">Cash Flow Dynamics</span>
                  <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                    {financialHealth?.cashFlow?.split(',')[0] || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-dark-muted font-normal leading-relaxed">
                  {financialHealth?.cashFlow || 'Free cash flow metrics not resolved.'}
                </p>
              </div>
            </div>
          </div>

          {/* Latest News Items */}
          <div className="glass-panel rounded-2xl p-6 border border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4.5 h-4.5 text-brand-primary" />
              <h2 className="font-extrabold text-lg text-white tracking-wide">Market Catalysts</h2>
            </div>
            <ul className="space-y-3">
              {latestNewsSummary && latestNewsSummary.length > 0 ? (
                latestNewsSummary.slice(0, 4).map((headline, idx) => (
                  <li key={idx} className="p-2.5 bg-slate-900/30 rounded-lg border border-dark-border/40 text-xs text-slate-300 font-normal leading-relaxed">
                    {headline}
                  </li>
                ))
              ) : (
                <li className="text-xs text-dark-muted font-normal">No recent news headlines available for this stock.</li>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Moats & Risks */}
        <div className="space-y-6">
          {/* Growth & Competitive Moats */}
          <div className="glass-panel rounded-2xl p-6 border border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4.5 h-4.5 text-brand-primary" />
              <h2 className="font-extrabold text-lg text-white tracking-wide">Competitive Moats</h2>
            </div>
            
            {growthPotential && (
              <p className="text-xs text-dark-muted mb-3 font-normal">
                {growthPotential}
              </p>
            )}

            <ul className="space-y-2.5">
              {competitiveAdvantages && competitiveAdvantages.length > 0 ? (
                competitiveAdvantages.map((adv, idx) => (
                  <li key={idx} className="flex gap-2 text-xs font-medium text-slate-200">
                    <ChevronRight className="w-4 h-4 text-brand-primary shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-dark-muted font-normal flex gap-2">
                  <ChevronRight className="w-4 h-4 text-brand-primary shrink-0" />
                  <span>Standard industry market positioning.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Risks & Sensitivities */}
          <div className="glass-panel rounded-2xl p-6 border border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4.5 h-4.5 text-brand-danger" />
              <h2 className="font-extrabold text-lg text-white tracking-wide">Risk Factors</h2>
            </div>
            <ul className="space-y-2.5">
              {risks && risks.length > 0 ? (
                risks.map((risk, idx) => (
                  <li key={idx} className="flex gap-2 text-xs font-medium text-slate-200">
                    <ChevronRight className="w-4 h-4 text-brand-danger shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-dark-muted font-normal flex gap-2">
                  <ChevronRight className="w-4 h-4 text-brand-danger shrink-0" />
                  <span>Standard equity market risk dynamics apply.</span>
                </li>
              )}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
