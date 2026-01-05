
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ShieldCheck, Filter, ArrowRight } from 'lucide-react';
import { MOCK_WORKERS, CATEGORIES } from '../constants';
import { searchNearbyServices } from '../services/geminiService';
import { WorkerProfile } from '../types';

interface MarketplaceProps {
  onSelectWorker: (worker: WorkerProfile) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectWorker }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [workers, setWorkers] = useState<WorkerProfile[]>(MOCK_WORKERS);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingAI(true);
    try {
      const result = await searchNearbyServices(searchQuery);
      setAiInsights(result.text);
      // In a real app, we'd filter our database based on the AI's search findings
    } catch (error) {
      console.error("AI Search failed:", error);
    } finally {
      setIsSearchingAI(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Find Certified Experts Nearby</h1>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for 'Plumbers in Indiranagar' or 'Electricians near me'..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingAI}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
          >
            {isSearchingAI ? "Analyzing..." : "Search"}
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
            activeCategory === 'All' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.name ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* AI Insights (Grounding) */}
      {aiInsights && (
        <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-800 uppercase tracking-wider">AI Local Analysis</span>
          </div>
          <p className="text-slate-700 leading-relaxed">{aiInsights}</p>
        </div>
      )}

      {/* Worker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workers.map((worker) => (
          <div
            key={worker.id}
            onClick={() => onSelectWorker(worker)}
            className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-blue-100 transition-all"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="bg-slate-50 px-3 py-1 rounded-lg">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  {worker.rating}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">{worker.name}</h3>
            <p className="text-blue-600 font-semibold mb-3">{worker.specialty}</p>

            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              {worker.location}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {worker.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-tighter">Jobs Done</span>
                <span className="font-bold text-slate-800">{worker.completedJobs}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 uppercase tracking-tighter">Trust Score</span>
                <span className="font-bold text-green-600">{worker.trustScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
