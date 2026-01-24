const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

/**
 * Google Places Service - Fetches real-time data about nearby businesses
 * Uses Google Places API to find electricians, plumbers, beauticians, etc.
 */

// Service category mappings to Google Places types and keywords
const CATEGORY_MAPPINGS = {
    'electrician': { type: 'electrician', keywords: ['electrician', 'electrical shop', 'electrical services'] },
    'plumber': { type: 'plumber', keywords: ['plumber', 'plumbing services', 'plumbing shop'] },
    'carpenter': { type: 'general_contractor', keywords: ['carpenter', 'carpentry', 'woodwork'] },
    'painter': { type: 'painter', keywords: ['painter', 'painting services', 'house painter'] },
    'beautician': { type: 'beauty_salon', keywords: ['beautician', 'beauty parlor', 'salon'] },
    'mechanic': { type: 'car_repair', keywords: ['mechanic', 'auto repair', 'car service'] },
    'ac_repair': { type: 'home_goods_store', keywords: ['ac repair', 'air conditioner service', 'hvac'] },
    'cleaning': { type: 'home_goods_store', keywords: ['cleaning services', 'house cleaning', 'maid service'] },
    'cook': { type: 'meal_delivery', keywords: ['cook', 'catering', 'home chef', 'tiffin service'] },
    'gardener': { type: 'home_goods_store', keywords: ['gardener', 'landscaping', 'garden services'] }
};

/**
 * Search for nearby professionals using Google Places API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} category - Service category (electrician, plumber, etc.)
 * @param {number} radius - Search radius in meters
 * @returns {Array} Array of professional profiles from Google
 */
const searchNearbyProfessionals = async (lat, lng, category, radius = 5000) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.warn('Google Maps API key not configured');
            return [];
        }

        const categoryConfig = CATEGORY_MAPPINGS[category.toLowerCase()] || {
            type: 'point_of_interest',
            keywords: [category]
        };

        // Search using Places Nearby Search
        const response = await client.placesNearby({
            params: {
                location: { lat, lng },
                radius,
                type: categoryConfig.type,
                keyword: categoryConfig.keywords[0],
                key: apiKey
            }
        });

        if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
            console.error('Places API error:', response.data.status);
            return [];
        }

        // Transform Google Places data to professional profiles
        const professionals = await Promise.all(
            (response.data.results || []).slice(0, 20).map(async (place) => {
                // Get detailed info for each place
                const details = await getPlaceDetails(place.place_id, apiKey);

                return {
                    id: place.place_id,
                    source: 'google_places',
                    name: place.name,
                    category: category,
                    rating: place.rating || 0,
                    totalRatings: place.user_ratings_total || 0,
                    priceLevel: place.price_level || null,
                    isOpen: place.opening_hours?.open_now || null,
                    location: {
                        address: place.vicinity || details?.formatted_address || '',
                        lat: place.geometry.location.lat,
                        lng: place.geometry.location.lng
                    },
                    // Contact details from Place Details API
                    phone: details?.formatted_phone_number || details?.international_phone_number || null,
                    website: details?.website || null,
                    // Photos
                    photo: place.photos?.[0]
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(place.name)}&background=3B82F6&color=fff&size=200`,
                    // Business hours
                    hours: details?.opening_hours?.weekday_text || [],
                    // Reviews
                    reviews: (details?.reviews || []).slice(0, 3).map(review => ({
                        author: review.author_name,
                        rating: review.rating,
                        text: review.text,
                        time: review.relative_time_description
                    })),
                    // Google Maps link
                    mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}&destination_place_id=${place.place_id}`
                };
            })
        );

        return professionals;
    } catch (error) {
        console.error('Error searching nearby professionals:', error);
        return [];
    }
};

/**
 * Get detailed information about a place
 */
const getPlaceDetails = async (placeId, apiKey) => {
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                fields: [
                    'formatted_phone_number',
                    'international_phone_number',
                    'website',
                    'opening_hours',
                    'reviews',
                    'formatted_address',
                    'url'
                ],
                key: apiKey
            }
        });

        return response.data.result || null;
    } catch (error) {
        console.warn('Error getting place details:', error.message);
        return null;
    }
};

/**
 * Text search for professionals
 * More flexible search based on user query
 */
const textSearchProfessionals = async (query, lat, lng, radius = 5000) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) return [];

        const response = await client.textSearch({
            params: {
                query: query,
                location: { lat, lng },
                radius,
                key: apiKey
            }
        });

        if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
            return [];
        }

        return (response.data.results || []).slice(0, 15).map(place => ({
            id: place.place_id,
            source: 'google_places',
            name: place.name,
            category: extractCategory(place.types),
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            isOpen: place.opening_hours?.open_now || null,
            location: {
                address: place.formatted_address,
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
            },
            photo: place.photos?.[0]
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(place.name)}&background=3B82F6&color=fff&size=200`,
            mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        }));
    } catch (error) {
        console.error('Text search error:', error);
        return [];
    }
};

/**
 * Extract primary category from Google place types
 */
const extractCategory = (types) => {
    const categoryMap = {
        'electrician': 'Electrician',
        'plumber': 'Plumber',
        'painter': 'Painter',
        'carpenter': 'Carpenter',
        'beauty_salon': 'Beautician',
        'hair_care': 'Hair Stylist',
        'car_repair': 'Mechanic',
        'general_contractor': 'Contractor',
        'home_goods_store': 'Home Services',
        'restaurant': 'Cook/Catering',
        'meal_delivery': 'Food Services'
    };

    for (const type of types || []) {
        if (categoryMap[type]) {
            return categoryMap[type];
        }
    }
    return 'Professional';
};

/**
 * Get available service categories
 */
const getAvailableCategories = () => {
    return Object.keys(CATEGORY_MAPPINGS).map(key => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        description: CATEGORY_MAPPINGS[key].keywords[0]
    }));
};

module.exports = {
    searchNearbyProfessionals,
    textSearchProfessionals,
    getPlaceDetails,
    getAvailableCategories,
    CATEGORY_MAPPINGS
};
