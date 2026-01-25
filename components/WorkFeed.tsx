
import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Share2, ShieldCheck, MessageCircle, MoreHorizontal, Sparkles, MapPin, Star, Phone, Navigation, Award, TrendingUp, Crown, ExternalLink } from 'lucide-react';

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
  photos?: string[];
  mapsUrl: string;
  directionsUrl?: string;
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    time: string;
  }>;
}

interface WorkFeedProps {
  onSelectWorker: (workerId: string) => void;
}

// AI-generated captions for different categories
const generateCaption = (pro: Professional): string => {
  const captions: { [key: string]: string[] } = {
    'electrician': [
      `⚡ Expert electrical work! ${pro.name} delivers top-quality service with ${pro.rating}★ rating from ${pro.totalRatings} happy customers.`,
      `🔌 Need electrical repairs? ${pro.name} is your trusted local expert! Serving the community with excellence.`,
      `💡 Quality electrical solutions by ${pro.name}. Professional, reliable, and highly rated by the community!`
    ],
    'plumber': [
      `🔧 Professional plumbing at its finest! ${pro.name} - rated ${pro.rating}★ by ${pro.totalRatings} satisfied customers.`,
      `🚿 Trust ${pro.name} for all your plumbing needs. Quick response, quality work, fair prices!`,
      `💧 Expert plumbing solutions! ${pro.name} keeps homes running smoothly with top-rated service.`
    ],
    'beautician': [
      `💇 Transform your look with ${pro.name}! ${pro.rating}★ rated beauty expert loved by ${pro.totalRatings} clients.`,
      `✨ Beauty excellence by ${pro.name}. Where style meets perfection!`,
      `💄 Discover the art of beauty at ${pro.name}. Professional services, stunning results!`
    ],
    'mechanic': [
      `🔧 Expert auto care by ${pro.name}! Trusted by ${pro.totalRatings} vehicle owners with ${pro.rating}★ rating.`,
      `🚗 Your vehicle deserves the best! ${pro.name} delivers professional auto services.`,
      `⚙️ Quality auto repairs at ${pro.name}. Expert mechanics, honest service!`
    ],
    'painter': [
      `🎨 Transform your space with ${pro.name}! Professional painting with ${pro.rating}★ excellence.`,
      `🖌️ Beautiful homes start with ${pro.name}. Expert painting services you can trust!`,
      `🏠 Quality painting by ${pro.name}. Rated ${pro.rating}★ by ${pro.totalRatings} happy homeowners!`
    ],
    'cleaning': [
      `✨ Sparkling clean results by ${pro.name}! ${pro.rating}★ rated cleaning excellence.`,
      `🧹 Professional cleaning by ${pro.name}. Your space, spotlessly maintained!`,
      `🏠 Trust ${pro.name} for a cleaner home. Highly rated by ${pro.totalRatings} satisfied clients!`
    ],
    'cook': [
      `👨‍🍳 Delicious creations by ${pro.name}! ${pro.rating}★ rated culinary excellence.`,
      `🍳 Experience the flavors of ${pro.name}. Loved by ${pro.totalRatings} food lovers!`,
      `🍽️ Quality cuisine at ${pro.name}. Where every meal is a masterpiece!`
    ],
    'default': [
      `⭐ Highly rated professional! ${pro.name} delivers quality service with ${pro.rating}★ rating.`,
      `🏆 Top-rated ${pro.category} - ${pro.name} trusted by ${pro.totalRatings} customers!`,
      `✅ Quality service by ${pro.name}. Professional, reliable, and customer-focused!`
    ]
  };

  const categoryKey = pro.category?.toLowerCase() || 'default';
  const options = captions[categoryKey] || captions['default'];
  return options[Math.floor(Math.random() * options.length)];
};

const CATEGORIES_TO_FETCH = ['electrician', 'plumber', 'beautician', 'mechanic', 'painter'];

const WorkFeed: React.FC<WorkFeedProps> = ({ onSelectWorker }) => {
  const [topProfessionals, setTopProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 12.9716, lng: 77.5946 })
      );
    } else {
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  // Fetch high-rated professionals from all categories
  const fetchTopProfessionals = useCallback(async () => {
    if (!userLocation) return;

    setIsLoading(true);
    try {
      const allProfessionals: Professional[] = [];

      // Fetch from multiple categories
      for (const category of CATEGORIES_TO_FETCH) {
        const response = await fetch(
          `/api/places/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&category=${category}&radius=15000`
        );
        const data = await response.json();
        if (data.success && data.data) {
          allProfessionals.push(...data.data);
        }
      }

      // Filter for high ratings (4.0+) and sort by rating
      const highRated = allProfessionals
        .filter((pro) => pro.rating >= 4.0 && pro.totalRatings >= 5)
        .sort((a, b) => b.rating - a.rating || b.totalRatings - a.totalRatings)
        .slice(0, 20);

      setTopProfessionals(highRated);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchTopProfessionals();
    }
  }, [userLocation, fetchTopProfessionals]);

  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-black text-slate-900">Top Rated Showcase</h1>
        </div>
        <p className="text-slate-500">Discover the highest-rated professionals near you (4★ and above)</p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            {topProfessionals.length} Top Rated Professionals
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-800">Real Google Reviews</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Finding top-rated professionals...</p>
          </div>
        </div>
      )}

      {/* Showcase Feed */}
      {!isLoading && (
        <div className="space-y-8">
          {topProfessionals.map((pro) => (
            <article
              key={pro.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      className="w-12 h-12 rounded-xl object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=3B82F6&color=fff`;
                      }}
                    />
                    {pro.rating >= 4.5 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-1">
                      {pro.name}
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {pro.category || 'Professional'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-yellow-700">{pro.rating.toFixed(1)}</span>
                  </div>
                  {pro.isOpen && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Open</span>
                  )}
                </div>
              </div>

              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-slate-100">
                <img
                  src={pro.photo}
                  alt={`${pro.name} showcase`}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80`;
                  }}
                />

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 border border-yellow-100 shadow-sm">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-bold text-yellow-800">
                    {pro.totalRatings}+ Reviews
                  </span>
                </div>

                {/* Top Rated Badge for 4.5+ */}
                {pro.rating >= 4.5 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">Top Rated</span>
                  </div>
                )}
              </div>

              {/* Actions & Caption */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(pro.id)}
                      className={`flex items-center gap-2 transition-colors ${likedPosts.has(pro.id) ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                        }`}
                    >
                      <Heart className={`w-6 h-6 ${likedPosts.has(pro.id) ? 'fill-red-500' : ''}`} />
                      <span className="text-sm font-bold">{pro.totalRatings + (likedPosts.has(pro.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 hover:text-blue-500 transition-colors">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {pro.phone && (
                      <a
                        href={`tel:${pro.phone}`}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    )}
                    <a
                      href={pro.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Directions
                    </a>
                  </div>
                </div>

                {/* AI Generated Caption */}
                <p className="text-slate-700 leading-relaxed mb-3">
                  <span className="font-bold text-slate-900 mr-2">{pro.name}</span>
                  {generateCaption(pro)}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{pro.location.address}</span>
                </div>

                {/* Top Review if available */}
                {pro.reviews && pro.reviews.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Review</span>
                      {renderStars(pro.reviews[0].rating)}
                    </div>
                    <p className="text-sm text-slate-600 italic line-clamp-2">"{pro.reviews[0].text}"</p>
                    <p className="text-xs text-slate-400 mt-1">— {pro.reviews[0].author}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && topProfessionals.length === 0 && (
        <div className="text-center py-16">
          <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No top-rated professionals found</h3>
          <p className="text-slate-500">We're looking for professionals with 4★+ ratings in your area</p>
        </div>
      )}

      {/* Footer */}
      {!isLoading && topProfessionals.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-slate-400 font-medium">
            ✨ Showing top-rated professionals with real Google reviews
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkFeed;
