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
        <div className="relative flex items-center w-full bg-slate-900/60 border-2 border-dark-border focus-within:border-brand-primary focus-within:shadow-glow rounded-2xl transition-all duration-300">
          <div className="pl-5 text-dark-muted flex items-center justify-center">
            <Search className="w-6 h-6 stroke-[2]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
            placeholder="Search company name or stock ticker (e.g. Nvidia, MSFT, Tesla)..."
            className="flex-1 bg-transparent text-white text-base tracking-wide placeholder-dark-muted focus:outline-none px-4 py-4 font-medium disabled:opacity-50"
          />
          <div className="pr-3 flex items-center">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-primary hover:to-brand-secondary text-dark-bg font-extrabold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm tracking-wider uppercase cursor-pointer"
            >
              {isLoading ? 'Researching...' : 'Analyze'}
            </button>
          </div>
        </div>

        {error && (
          <div className="absolute mt-1.5 left-2 flex items-center gap-1 text-xs text-brand-danger">
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
