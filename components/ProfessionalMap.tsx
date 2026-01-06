import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { MapPin, Navigation, Search, Filter, X, Star, Phone, Briefcase } from 'lucide-react';

interface Professional {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    profile?: {
        skills?: string[];
        location?: string;
        hourlyRate?: string;
        experience?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    distance?: string;
    duration?: string;
    distanceValue?: number;
}

interface ProfessionalMapProps {
    apiKey: string;
    onSelectProfessional?: (professional: Professional) => void;
}

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '24px'
};

const defaultCenter = {
    lat: 12.9716,
    lng: 77.5946 // Bangalore
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
};

const ProfessionalMap: React.FC<ProfessionalMapProps> = ({ apiKey, onSelectProfessional }) => {
    const [userLocation, setUserLocation] = useState(defaultCenter);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
    const [radius, setRadius] = useState(10); // km
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [category, setCategory] = useState('');

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    // Get user's current location
    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    setError('Could not get your location. Using default location.');
                },
                { enableHighAccuracy: true }
            );
        } else {
            setError('Geolocation not supported by your browser');
        }
    }, []);

    // Fetch nearby professionals
    const fetchNearbyProfessionals = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                lat: userLocation.lat.toString(),
                lng: userLocation.lng.toString(),
                radius: radius.toString()
            });

            if (category) {
                params.append('category', category);
            }

            const response = await fetch(
                `http://localhost:5001/api/location/nearby-professionals?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setProfessionals(data.data);
            } else {
                setError(data.message || 'Failed to fetch professionals');
            }
        } catch (err) {
            setError('Error connecting to server');
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [userLocation, radius, category]);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    useEffect(() => {
        if (userLocation.lat !== defaultCenter.lat || userLocation.lng !== defaultCenter.lng) {
            fetchNearbyProfessionals();
        }
    }, [userLocation, fetchNearbyProfessionals]);

    if (loadError) {
        return (
            <div className="p-8 bg-red-50 rounded-3xl border border-red-200 text-center">
                <p className="text-red-600 font-bold">Error loading Google Maps</p>
                <p className="text-red-500 text-sm mt-2">{loadError.message}</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="p-8 bg-slate-50 rounded-3xl animate-pulse flex items-center justify-center" style={{ height: '500px' }}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading Map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={getCurrentLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                >
                    <Navigation className="w-5 h-5" />
                    <span className="font-bold">My Location</span>
                </button>

                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-200">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <select
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="bg-transparent outline-none font-medium text-slate-700"
                    >
                        <option value="5">5 km</option>
                        <option value="10">10 km</option>
                        <option value="25">25 km</option>
                        <option value="50">50 km</option>
                    </select>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-sm border ${showFilters
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">Filters</span>
                </button>

                <button
                    onClick={fetchNearbyProfessionals}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
                >
                    <Search className="w-5 h-5" />
                    <span className="font-bold">{isLoading ? 'Searching...' : 'Search'}</span>
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900">Filter by Category</h4>
                        <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'AC Repair', 'Cooking'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(category === cat ? '' : cat)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${category === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-yellow-800">
                    {error}
                </div>
            )}

            {/* Map */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={userLocation}
                    zoom={13}
                    options={mapOptions}
                >
                    {/* User Location Marker */}
                    <Marker
                        position={userLocation}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: '#3B82F6',
                            fillOpacity: 1,
                            strokeColor: '#fff',
                            strokeWeight: 3
                        }}
                        title="Your Location"
                    />

                    {/* Radius Circle */}
                    <Circle
                        center={userLocation}
                        radius={radius * 1000}
                        options={{
                            fillColor: '#3B82F6',
                            fillOpacity: 0.1,
                            strokeColor: '#3B82F6',
                            strokeOpacity: 0.3,
                            strokeWeight: 2
                        }}
                    />

                    {/* Professional Markers */}
                    {professionals.map((pro) => (
                        pro.profile?.coordinates && (
                            <Marker
                                key={pro._id}
                                position={pro.profile.coordinates}
                                onClick={() => setSelectedPro(pro)}
                                icon={{
                                    url: pro.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=10B981&color=fff`,
                                    scaledSize: new google.maps.Size(40, 40),
                                    origin: new google.maps.Point(0, 0),
                                    anchor: new google.maps.Point(20, 20)
                                }}
                                title={pro.name}
                            />
                        )
                    ))}

                    {/* Info Window */}
                    {selectedPro && selectedPro.profile?.coordinates && (
                        <InfoWindow
                            position={selectedPro.profile.coordinates}
                            onCloseClick={() => setSelectedPro(null)}
                        >
                            <div className="p-2 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={selectedPro.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPro.name)}`}
                                        alt={selectedPro.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-bold text-slate-900">{selectedPro.name}</h4>
                                        <p className="text-sm text-slate-500">{selectedPro.distance || 'Distance unknown'}</p>
                                    </div>
                                </div>

                                {selectedPro.profile?.skills && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {selectedPro.profile.skills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {selectedPro.profile?.hourlyRate && (
                                    <p className="text-sm text-green-600 font-semibold mb-2">
                                        {selectedPro.profile.hourlyRate}
                                    </p>
                                )}

                                <button
                                    onClick={() => onSelectProfessional?.(selectedPro)}
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700"
                                >
                                    View Profile
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>

            {/* Results Summary */}
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-700">
                        <span className="text-blue-600 font-bold">{professionals.length}</span> professionals found within{' '}
                        <span className="text-blue-600 font-bold">{radius} km</span>
                    </p>
                    {category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {category}
                        </span>
                    )}
                </div>
            </div>

            {/* Professional Cards List */}
            {professionals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {professionals.slice(0, 6).map((pro) => (
                        <div
                            key={pro._id}
                            onClick={() => {
                                setSelectedPro(pro);
                                onSelectProfessional?.(pro);
                            }}
                            className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={pro.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}`}
                                    alt={pro.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900">{pro.name}</h4>
                                    <p className="text-sm text-emerald-600 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {pro.distance || 'Distance unknown'}
                                    </p>
                                </div>
                            </div>

                            {pro.profile?.skills && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {pro.profile.skills.slice(0, 3).map((skill, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" />
                                    {pro.profile?.experience || 'New'}
                                </span>
                                {pro.profile?.hourlyRate && (
                                    <span className="text-green-600 font-bold">{pro.profile.hourlyRate}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfessionalMap;
