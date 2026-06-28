import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a company name or ticker symbol.');
      return;
    }
    setError('');
    onSearch(query.trim());
  };

  const handleQuickSearch = (companyName) => {
    if (isLoading) return;
    setQuery(companyName);
    setError('');
    onSearch(companyName);
  };

  const popularCompanies = [
    { name: 'Apple', ticker: 'AAPL' },
    { name: 'Microsoft', ticker: 'MSFT' },
    { name: 'Tesla', ticker: 'TSLA' },
    { name: 'Google', ticker: 'GOOGL' },
    { name: 'Amazon', ticker: 'AMZN' },
    { name: 'NVIDIA', ticker: 'NVDA' },
    { name: 'Meta', ticker: 'META' },
    { name: 'Netflix', ticker: 'NFLX' },
    { name: 'AMD', ticker: 'AMD' },
    { name: 'Broadcom', ticker: 'AVGO' },
    { name: 'Intel', ticker: 'INTC' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Responsive search input container */}
          <div className="relative flex-1 flex items-center bg-slate-900/60 border-2 border-dark-border focus-within:border-brand-primary focus-within:shadow-glow rounded-2xl transition-all duration-300">
            <div className="pl-4 text-dark-muted flex items-center justify-center">
              <Search className="w-5 h-5 stroke-[2]" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError('');
              }}
              disabled={isLoading}
              placeholder="Search company name or stock ticker..."
              className="flex-1 bg-transparent text-white text-sm sm:text-base tracking-wide placeholder-dark-muted focus:outline-none px-3 py-3.5 font-medium disabled:opacity-50"
            />
          </div>
          
          {/* Analyze action button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-primary hover:to-brand-secondary text-dark-bg font-extrabold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-xs sm:text-sm tracking-wider uppercase cursor-pointer whitespace-nowrap shrink-0"
          >
            {isLoading ? 'Researching...' : 'Analyze'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1 text-xs text-brand-danger mt-2 ml-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Popular shortcuts */}
      <div className="flex flex-wrap items-center gap-2 mt-2 px-1">
        <span className="text-xs text-dark-muted font-semibold uppercase tracking-wider">Popular tickers:</span>
        {popularCompanies.map((c) => (
          <button
            key={c.ticker}
            type="button"
            onClick={() => handleQuickSearch(c.name)}
            disabled={isLoading}
            className="text-xs bg-slate-900/40 hover:bg-brand-primary/10 border border-dark-border hover:border-brand-primary text-slate-300 hover:text-brand-primary px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-40 font-semibold"
          >
            {c.name} ({c.ticker})
          </button>
        ))}
      </div>
    </div>
  );
}
