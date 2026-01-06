
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Share2, ShieldCheck, MessageCircle, MoreHorizontal, Sparkles, Camera, MapPin, Star, Phone, Navigation, Zap, Wrench, Paintbrush, Scissors, Car, Sparkles as CleanIcon, Utensils, Search } from 'lucide-react';
import { MOCK_POSTS } from '../constants';
import { WorkPost } from '../types';

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

interface WorkFeedProps {
  onSelectWorker: (workerId: string) => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All', icon: <Search className="w-4 h-4" /> },
  { id: 'electrician', name: 'Electrician', icon: <Zap className="w-4 h-4" /> },
  { id: 'plumber', name: 'Plumber', icon: <Wrench className="w-4 h-4" /> },
  { id: 'painter', name: 'Painter', icon: <Paintbrush className="w-4 h-4" /> },
  { id: 'beautician', name: 'Beautician', icon: <Scissors className="w-4 h-4" /> },
  { id: 'mechanic', name: 'Mechanic', icon: <Car className="w-4 h-4" /> },
  { id: 'cleaning', name: 'Cleaning', icon: <CleanIcon className="w-4 h-4" /> },
  { id: 'cook', name: 'Cook', icon: <Utensils className="w-4 h-4" /> },
];

const WorkFeed: React.FC<WorkFeedProps> = ({ onSelectWorker }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('electrician');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'showcase' | 'nearby'>('nearby');

  // Get user location
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

  // Fetch nearby professionals
  const fetchProfessionals = useCallback(async () => {
    if (!userLocation) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/places/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&category=${selectedCategory}&radius=10000`
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
  }, [userLocation, selectedCategory]);

  useEffect(() => {
    if (userLocation && viewMode === 'nearby') {
      fetchProfessionals();
    }
  }, [userLocation, selectedCategory, viewMode, fetchProfessionals]);

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Find Work</h1>
        <p className="text-slate-500">Discover nearby professionals and showcase work</p>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-6 bg-slate-100 rounded-2xl p-1 w-fit">
        <button
          onClick={() => setViewMode('nearby')}
          className={`px-5 py-2 rounded-xl font-semibold transition-all ${viewMode === 'nearby' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
        >
          📍 Nearby Pros
        </button>
        <button
          onClick={() => setViewMode('showcase')}
          className={`px-5 py-2 rounded-xl font-semibold transition-all ${viewMode === 'showcase' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
        >
          🎨 Work Showcase
        </button>
      </div>

      {/* Nearby Professionals View */}
      {viewMode === 'nearby' && (
        <>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                  }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Professionals Grid */}
          {!isLoading && professionals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="w-28 h-28 flex-shrink-0">
                      <img
                        src={pro.photo}
                        alt={pro.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=3B82F6&color=fff`;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{pro.name}</h3>
                        {pro.isOpen !== null && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${pro.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {pro.isOpen ? 'Open' : 'Closed'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(pro.rating)}
                        <span className="text-xs text-slate-500">({pro.totalRatings})</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {pro.location.address}
                      </p>

                      <div className="flex gap-2">
                        <a
                          href={pro.directionsUrl || pro.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                        >
                          <Navigation className="w-3 h-3" />
                          Directions
                        </a>
                        {pro.phone && (
                          <a
                            href={`tel:${pro.phone}`}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && professionals.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No {selectedCategory}s found nearby. Try another category.</p>
            </div>
          )}
        </>
      )}

      {/* Showcase View - Original Posts */}
      {viewMode === 'showcase' && (
        <div className="space-y-6">
          {/* Create Post Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow">
              <Camera className="w-5 h-5" />
              Post Work
            </button>
          </div>

          {/* Posts Feed */}
          {MOCK_POSTS.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onSelectWorker(post.workerId)}
                >
                  <img src={post.workerAvatar} alt={post.workerName} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-1">
                      {post.workerName}
                      <ShieldCheck className="w-3 h-3 text-blue-500" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{post.workerSpecialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">{post.timestamp}</span>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Work Image */}
              <div className="relative aspect-[4/3] bg-slate-100">
                <img
                  src={post.image}
                  alt="Work showcase"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                {post.aiVerified && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-100 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-tight">AI Verified</span>
                  </div>
                )}
              </div>

              {/* Actions & Caption */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors">
                      <Heart className="w-6 h-6" />
                      <span className="text-sm font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  <button
                    onClick={() => onSelectWorker(post.workerId)}
                    className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md"
                  >
                    Hire Expert
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 mr-2">{post.workerName}</span>
                  {post.caption}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkFeed;
