import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, RefreshCw, AlertTriangle, Cpu, 
  ArrowLeft, Search, HelpCircle, FileText 
} from 'lucide-react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import HistorySidebar from './components/HistorySidebar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatErrorMessage = (errText) => {
  if (!errText) return 'An unexpected error occurred.';
  if (errText.includes('429') || errText.includes('quota') || errText.includes('Quota exceeded')) {
    return 'Gemini API Quota Exceeded (429 Rate Limit):\nYour Google AI Studio free-tier API key has reached the limit of 20 requests per day. Please wait or set up billing / change keys in your .env file.';
  }
  if (errText.includes('503') || errText.includes('Service Unavailable')) {
    return 'Gemini API is currently experiencing high traffic (503 Service Unavailable). Please retry your analysis in a few seconds.';
  }
  return errText;
};

export default function App() {
  const [history, setHistory] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState('');
  const [error, setError] = useState(null);
  const [dbStatus, setDbStatus] = useState('fallback_json_store');

  // Fetch history and check connection status on mount
  useEffect(() => {
    fetchHistory();
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/status`);
      if (res.data) {
        setDbStatus(res.data.database);
      }
    } catch (err) {
      console.warn('Failed to connect to backend status check:', err.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/history`);
      if (res.data && res.data.data) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to retrieve analysis history:', err.message);
    }
  };

  const handleDeleteReport = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this research report?')) return;
    
    try {
      const res = await axios.delete(`${API_BASE_URL}/history/${id}`);
      if (res.data && res.data.success) {
        setHistory(prev => prev.filter(r => r._id !== id));
        if (currentReport && currentReport._id === id) {
          setCurrentReport(null);
        }
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Failed to delete report.');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your entire research history? This cannot be undone.')) return;
    
    try {
      const res = await axios.delete(`${API_BASE_URL}/history`);
      if (res.data && res.data.success) {
        setHistory([]);
        setCurrentReport(null);
      }
    } catch (err) {
      console.error('Error clearing history:', err);
      alert('Failed to clear history.');
    }
  };

  const handleSearch = async (companyName) => {
    setIsLoading(true);
    setLoadingCompany(companyName);
    setError(null);
    setCurrentReport(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/analyze`, { company: companyName }, { timeout: 120000 });
      if (res.data && res.data.data) {
        const newReport = res.data.data;
        setCurrentReport(newReport);
        
        // Add to history state and pull fresh history from DB
        setHistory(prev => {
          const filtered = prev.filter(item => item._id !== newReport._id);
          return [newReport, ...filtered];
        });
        
        await fetchHistory();
        await checkBackendStatus();
      } else {
        throw new Error('API completed but returned no report data.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      let errMsg = 'Failed to analyze company. Please verify the name or stock ticker and try again.';
      
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.code === 'ECONNABORTED') {
        errMsg = 'The request timed out. Collecting deep financial statements can take up to 2 minutes. Please try again.';
      } else if (err.message) {
        errMsg = err.message;
      }
      
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReport = (report) => {
    setCurrentReport(report);
    setError(null);
  };

  const handleBackToHome = () => {
    setCurrentReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar dbStatus={dbStatus} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Render loading screen if analysis is running */}
        {isLoading && (
          <LoadingScreen company={loadingCompany} />
        )}

        {/* Render error banner if any error occurs */}
        {!isLoading && error && (
          <div className="max-w-2xl mx-auto my-8 p-6 bg-brand-danger/10 border-2 border-brand-danger/40 rounded-2xl flex flex-col items-center justify-center text-center gap-3 glass-panel">
            <AlertTriangle className="w-12 h-12 text-brand-danger animate-bounce" />
            <h3 className="font-extrabold text-xl text-white">Research Pipeline Error</h3>
            <p className="text-sm text-dark-muted font-medium max-w-xl break-words whitespace-pre-wrap">{formatErrorMessage(error)}</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleBackToHome}
                className="px-5 py-2.5 bg-dark-border hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Home
              </button>
              <button
                onClick={() => handleSearch(loadingCompany)}
                className="px-5 py-2.5 bg-brand-danger text-white rounded-xl text-xs font-extrabold hover:bg-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* Home Screen (Hero and Search bar when no report active, not loading, and no error) */}
        {!isLoading && !error && !currentReport && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-4xl mx-auto mt-8 md:mt-14">
            
            {/* Pulsing AI Eye Graphic */}
            <div className="mb-6 relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-brand-primary/10 absolute filter blur-lg animate-pulse" />
              <div className="bg-slate-900 border border-brand-primary/20 p-4.5 rounded-full shadow-glow">
                <Cpu className="w-12 h-12 text-brand-primary animate-pulse" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
              AI Investment Research <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent text-glow-cyan">Agent</span>
            </h1>
            <p className="text-base md:text-lg text-dark-muted font-normal max-w-2xl mb-10 leading-relaxed">
              Enter any publicly traded corporation name or ticker symbol. Our agent crawls Wikipedia, reads news articles, pulls SEC-aligned financials, searches web trends, and uses Gemini to compose institutional-grade buy/pass models.
            </p>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {/* Premium Intelligence Step Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-14 mb-4 text-left">
              <div className="glass-panel p-5 rounded-2xl border border-dark-border/60 hover:border-brand-primary/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2">Financial Harvesting</h3>
                <p className="text-xs text-dark-muted leading-relaxed font-normal">
                  Crawls real-time market data, key balance sheet metrics, and compiles 12-month historical stock prices.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-dark-border/60 hover:border-brand-primary/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2">Moat & Risk Analysis</h3>
                <p className="text-xs text-dark-muted leading-relaxed font-normal">
                  Queries Wikipedia and performs deep Tavily web searches to map business models and competitive risks.
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-dark-border/60 hover:border-brand-primary/40 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2">Institutional Rating</h3>
                <p className="text-xs text-dark-muted leading-relaxed font-normal">
                  Generates an objective BUY or PASS rating with explicit confidence scores and logical thesis write-ups.
                </p>
              </div>
            </div>

            {/* If history exists, let users quickly browse past reports */}
            {history.length > 0 && (
              <div className="w-full max-w-3xl mt-12 border-t border-dark-border/40 pt-8">
                <h3 className="text-left font-bold text-sm text-dark-muted uppercase tracking-wider mb-4">Recent Reports:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {history.slice(0, 6).map((report) => (
                    <button
                      key={report._id}
                      onClick={() => handleSelectReport(report)}
                      className="text-left p-3.5 bg-slate-900/40 hover:bg-slate-900/80 border border-dark-border hover:border-brand-primary rounded-xl transition-all duration-200 cursor-pointer flex justify-between items-center group/btn"
                    >
                      <div>
                        <span className="font-extrabold text-sm text-white mr-2 group-hover/btn:text-brand-primary transition-colors">{report.ticker}</span>
                        <span className="text-xs text-dark-muted block mt-0.5 truncate max-w-[130px]">{report.company}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        report.recommendation === 'Invest' 
                          ? 'bg-brand-success/10 text-brand-success border-brand-success/20' 
                          : 'bg-slate-500/10 text-slate-300 border-slate-500/20'
                      }`}>
                        {report.recommendation}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Screen (Splits page: Left is History Drawer, Right is Report) */}
        {!isLoading && !error && currentReport && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar drawer for desktop layout */}
            <div className="hidden lg:block lg:col-span-1">
              <HistorySidebar 
                history={history} 
                currentReport={currentReport} 
                onSelectReport={handleSelectReport} 
                onDeleteReport={handleDeleteReport}
                onClearHistory={handleClearHistory}
              />
            </div>

            {/* Main Analyst Dashboard */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between print:hidden">
                <button
                  onClick={handleBackToHome}
                  className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-white transition-colors font-semibold group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Research Terminal</span>
                </button>

                <div className="lg:hidden flex gap-2">
                  {/* Select box history for mobile dropdown layout */}
                  <select 
                    onChange={(e) => {
                      const selected = history.find(h => h._id === e.target.value);
                      if (selected) handleSelectReport(selected);
                    }}
                    value={currentReport._id}
                    className="bg-slate-900 border border-dark-border text-xs text-white rounded-lg p-2 font-semibold"
                  >
                    {history.map(h => (
                      <option key={h._id} value={h._id}>{h.ticker} - {h.recommendation}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Dashboard report={currentReport} />
            </div>

          </div>
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-dark-border/20 py-6 px-6 mt-16 text-center text-xs text-dark-muted print:hidden">
        <div className="max-w-7xl mx-auto">
          &copy; {new Date().getFullYear()} EquityEye. All rights reserved. Designed for advanced algorithmic equity research.
        </div>
      </footer>
    </div>
  );
}
