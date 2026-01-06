
import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, ShieldCheck, Filter, ArrowRight, Map, List, Locate, Phone, Navigation, Zap, Wrench, Paintbrush, Scissors, Car, Sparkles, Utensils } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { searchNearbyServices } from '../services/geminiService';
import { WorkerProfile } from '../types';
import ProfessionalMap from './ProfessionalMap';

interface Professional {
  id: string;
  name: string;
  category: string;
  rating: number;
  totalRatings: number;
  isOpen: boolean | null;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  phone?: string;
  website?: string;
  photo: string;
  mapsUrl: string;
  directionsUrl?: string;
}

interface MarketplaceProps {
  onSelectWorker: (worker: WorkerProfile) => void;
}

const SERVICE_CATEGORIES = [
  { id: 'electrician', name: 'Electrician', icon: <Zap className="w-4 h-4" /> },
  { id: 'plumber', name: 'Plumber', icon: <Wrench className="w-4 h-4" /> },
  { id: 'painter', name: 'Painter', icon: <Paintbrush className="w-4 h-4" /> },
  { id: 'beautician', name: 'Beautician', icon: <Scissors className="w-4 h-4" /> },
  { id: 'mechanic', name: 'Mechanic', icon: <Car className="w-4 h-4" /> },
  { id: 'cleaning', name: 'Cleaning', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'cook', name: 'Cook', icon: <Utensils className="w-4 h-4" /> },
  { id: 'carpenter', name: 'Carpenter', icon: <Wrench className="w-4 h-4" /> },
];

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectWorker }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('electrician');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(5000);

  // Get API key from environment
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 12.9716, lng: 77.5946 }) // Default to Bangalore
      );
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  // Fetch professionals from Google Places
  const fetchProfessionals = useCallback(async () => {
    if (!userLocation) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString(),
        radius: radius.toString()
      });

      if (searchQuery.trim()) {
        params.append('query', searchQuery);
      } else {
        params.append('category', activeCategory);
      }

      const response = await fetch(
        `http://localhost:5001/api/places/nearby?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setProfessionals(data.data);
      }
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, activeCategory, radius, searchQuery]);

  // Fetch on location or category change
  useEffect(() => {
    if (userLocation) {
      fetchProfessionals();
    }
  }, [userLocation, activeCategory, radius]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfessionals();
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Find Certified Experts Nearby</h1>
            <p className="text-slate-500 mt-1">Real-time data from Google Maps</p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <List className="w-5 h-5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${viewMode === 'map'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Map className="w-5 h-5" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-3xl mb-4">
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
            disabled={isLoading}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Radius Selector */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-slate-500">Radius:</span>
          <div className="flex gap-2">
            {[1000, 2000, 5000, 10000, 25000].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${radius === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {r / 1000} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-800 uppercase tracking-wider">AI Local Analysis</span>
          </div>
          <p className="text-slate-700 leading-relaxed">{aiInsights}</p>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && googleMapsApiKey && (
        <div className="mb-8">
          <ProfessionalMap
            apiKey={googleMapsApiKey}
            onSelectProfessional={(pro: any) => {
              console.log('Selected professional:', pro);
            }}
          />
        </div>
      )}

      {/* Map View - No API Key Warning */}
      {viewMode === 'map' && !googleMapsApiKey && (
        <div className="mb-8 p-8 bg-yellow-50 rounded-3xl border border-yellow-200 text-center">
          <Map className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Google Maps API Key Required</h3>
          <p className="text-yellow-700">Add VITE_GOOGLE_MAPS_API_KEY to your .env file to enable the map view.</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && viewMode === 'list' && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Finding {activeCategory}s nearby...</p>
          </div>
        </div>
      )}

      {/* List View - Professional Grid */}
      {viewMode === 'list' && !isLoading && (
        <>
          <div className="mb-4">
            <p className="text-slate-600">
              Found <span className="font-bold text-blue-600">{professionals.length}</span> {activeCategory}s within{' '}
              <span className="font-bold">{radius / 1000} km</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((pro) => (
              <div
                key={pro.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pro.photo}
                    alt={pro.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=3B82F6&color=fff&size=400`;
                    }}
                  />
                  {/* Open/Closed Badge */}
                  {pro.isOpen !== null && (
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold ${pro.isOpen
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      }`}>
                      {pro.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">
                    {pro.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(pro.rating)}
                    <span className="text-slate-600 font-semibold">{pro.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({pro.totalRatings} reviews)</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-slate-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{pro.location.address}</span>
                  </div>

                  {/* Phone */}
                  {pro.phone && (
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <a
                        href={`tel:${pro.phone}`}
                        className="font-medium hover:text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {pro.phone}
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <a
                      href={pro.directionsUrl || pro.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm"
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </a>
                    {pro.phone && (
                      <a
                        href={`tel:${pro.phone}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {professionals.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No {activeCategory}s found nearby</h3>
              <p className="text-slate-500">Try increasing the search radius or selecting a different category</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Marketplace;
