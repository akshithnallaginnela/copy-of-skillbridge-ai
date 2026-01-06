import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, MapPin, Star, Phone, Clock, ExternalLink,
    Navigation, Filter, ChevronDown, Globe, MessageCircle,
    Zap, Wrench, Paintbrush, Scissors, Car, Sparkles, Utensils
} from 'lucide-react';

interface Professional {
    id: string;
    name: string;
    category: string;
    rating: number;
    totalRatings: number;
    isOpen: boolean | null;
    priceLevel?: number;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
    phone?: string;
    website?: string;
    photo: string;
    hours?: string[];
    reviews?: Array<{
        author: string;
        rating: number;
        text: string;
        time: string;
    }>;
    mapsUrl: string;
    directionsUrl?: string;
}

interface NearbyProfessionalsProps {
    onSelectProfessional?: (professional: Professional) => void;
}

const CATEGORIES = [
    { id: 'electrician', name: 'Electrician', icon: <Zap className="w-5 h-5" /> },
    { id: 'plumber', name: 'Plumber', icon: <Wrench className="w-5 h-5" /> },
    { id: 'painter', name: 'Painter', icon: <Paintbrush className="w-5 h-5" /> },
    { id: 'beautician', name: 'Beautician', icon: <Scissors className="w-5 h-5" /> },
    { id: 'mechanic', name: 'Mechanic', icon: <Car className="w-5 h-5" /> },
    { id: 'cleaning', name: 'Cleaning', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'cook', name: 'Cook', icon: <Utensils className="w-5 h-5" /> },
    { id: 'carpenter', name: 'Carpenter', icon: <Wrench className="w-5 h-5" /> },
];

const NearbyProfessionals: React.FC<NearbyProfessionalsProps> = ({ onSelectProfessional }) => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('electrician');
    const [radius, setRadius] = useState(5000);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Get user's current location
    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setError(null);
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    // Default to Bangalore
                    setUserLocation({ lat: 12.9716, lng: 77.5946 });
                    setError('Could not get your location. Using default location.');
                },
                { enableHighAccuracy: true }
            );
        } else {
            setUserLocation({ lat: 12.9716, lng: 77.5946 });
            setError('Geolocation not supported. Using default location.');
        }
    }, []);

    // Fetch nearby professionals from Google Places
    const fetchNearbyProfessionals = useCallback(async () => {
        if (!userLocation) return;

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                lat: userLocation.lat.toString(),
                lng: userLocation.lng.toString(),
                radius: radius.toString()
            });

            if (searchQuery.trim()) {
                params.append('query', searchQuery);
            } else {
                params.append('category', selectedCategory);
            }

            const response = await fetch(
                `http://localhost:5001/api/places/nearby?${params}`
            );

            const data = await response.json();

            if (data.success) {
                setProfessionals(data.data);
            } else {
                setError(data.message || 'Failed to fetch professionals');
                setProfessionals([]);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to connect to server');
            setProfessionals([]);
        } finally {
            setIsLoading(false);
        }
    }, [userLocation, selectedCategory, radius, searchQuery]);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    useEffect(() => {
        if (userLocation) {
            fetchNearbyProfessionals();
        }
    }, [userLocation, selectedCategory, radius]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchNearbyProfessionals();
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    Find Professionals Near You
                </h1>
                <p className="text-slate-600">
                    Real-time data from Google Maps - Electricians, Plumbers, Beauticians & more
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for 'nearby electrician' or 'plumber shops'..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {/* Location & Radius Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <button
                    onClick={getCurrentLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow"
                >
                    <Navigation className="w-5 h-5" />
                    <span className="font-semibold">Use My Location</span>
                </button>

                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <select
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="bg-transparent outline-none font-medium text-slate-700"
                    >
                        <option value={1000}>1 km</option>
                        <option value={2000}>2 km</option>
                        <option value={5000}>5 km</option>
                        <option value={10000}>10 km</option>
                        <option value={25000}>25 km</option>
                    </select>
                </div>

                {userLocation && (
                    <span className="text-sm text-slate-500">
                        📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </span>
                )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 mb-8 pb-4 overflow-x-auto">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setSelectedCategory(cat.id);
                            setSearchQuery('');
                        }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                    >
                        {cat.icon}
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800">
                    ⚠️ {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Searching nearby {selectedCategory}s...</p>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            {!isLoading && professionals.length > 0 && (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-slate-600">
                            Found <span className="font-bold text-blue-600">{professionals.length}</span> {selectedCategory}s within{' '}
                            <span className="font-bold">{radius / 1000} km</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {professionals.map((pro) => (
                            <div
                                key={pro.id}
                                onClick={() => setSelectedProfessional(pro)}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
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
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm"
                                        >
                                            <Navigation className="w-4 h-4" />
                                            Directions
                                        </a>
                                        {pro.phone && (
                                            <a
                                                href={`tel:${pro.phone}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all text-sm"
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
                </>
            )}

            {/* No Results */}
            {!isLoading && professionals.length === 0 && userLocation && (
                <div className="text-center py-16">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No {selectedCategory}s found nearby</h3>
                    <p className="text-slate-500">Try increasing the search radius or searching for a different service</p>
                </div>
            )}

            {/* Professional Detail Modal */}
            {selectedProfessional && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedProfessional(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Image */}
                        <div className="relative h-64">
                            <img
                                src={selectedProfessional.photo}
                                alt={selectedProfessional.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedProfessional(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
                            >
                                ✕
                            </button>
                            {selectedProfessional.isOpen !== null && (
                                <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full font-bold ${selectedProfessional.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                    }`}>
                                    {selectedProfessional.isOpen ? '🟢 Open Now' : '🔴 Closed'}
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-2">
                                {selectedProfessional.name}
                            </h2>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                {renderStars(selectedProfessional.rating)}
                                <span className="font-bold text-lg">{selectedProfessional.rating.toFixed(1)}</span>
                                <span className="text-slate-500">({selectedProfessional.totalRatings} reviews)</span>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-3 mb-4 p-4 bg-slate-50 rounded-2xl">
                                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-slate-900">{selectedProfessional.location.address}</p>
                                    <a
                                        href={selectedProfessional.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        View on Google Maps →
                                    </a>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {selectedProfessional.phone && (
                                    <a
                                        href={`tel:${selectedProfessional.phone}`}
                                        className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-all"
                                    >
                                        <Phone className="w-6 h-6 text-emerald-600" />
                                        <div>
                                            <p className="text-sm text-slate-500">Phone</p>
                                            <p className="font-bold text-emerald-700">{selectedProfessional.phone}</p>
                                        </div>
                                    </a>
                                )}
                                {selectedProfessional.website && (
                                    <a
                                        href={selectedProfessional.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all"
                                    >
                                        <Globe className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-slate-500">Website</p>
                                            <p className="font-bold text-blue-700">Visit Website</p>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {/* Business Hours */}
                            {selectedProfessional.hours && selectedProfessional.hours.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Business Hours
                                    </h3>
                                    <div className="bg-slate-50 rounded-2xl p-4 space-y-1">
                                        {selectedProfessional.hours.map((hour, idx) => (
                                            <p key={idx} className="text-sm text-slate-600">{hour}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews */}
                            {selectedProfessional.reviews && selectedProfessional.reviews.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-blue-600" />
                                        Recent Reviews
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedProfessional.reviews.map((review, idx) => (
                                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-slate-900">{review.author}</span>
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 text-sm line-clamp-3">{review.text}</p>
                                                <p className="text-slate-400 text-xs mt-2">{review.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <a
                                    href={selectedProfessional.directionsUrl || selectedProfessional.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                                >
                                    <Navigation className="w-5 h-5" />
                                    Get Directions
                                </a>
                                {selectedProfessional.phone && (
                                    <a
                                        href={`tel:${selectedProfessional.phone}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Call Now
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NearbyProfessionals;
