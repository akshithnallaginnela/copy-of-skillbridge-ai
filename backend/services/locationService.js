const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

/**
 * Location Service - Uses Google Maps APIs for:
 * - Finding nearby professionals
 * - Calculating distances
 * - Geocoding addresses
 */

// Geocode an address to coordinates
const geocodeAddress = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.warn('Google Maps API key not configured');
            return null;
        }

        const response = await client.geocode({
            params: {
                address,
                key: apiKey
            }
        });

        if (response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

// Reverse geocode coordinates to address
const reverseGeocode = async (lat, lng) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) return null;

        const response = await client.reverseGeocode({
            params: {
                latlng: { lat, lng },
                key: apiKey
            }
        });

        if (response.data.results.length > 0) {
            return response.data.results[0].formatted_address;
        }
        return null;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
};

// Calculate distance between two points
const calculateDistance = async (origin, destination) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) return null;

        const response = await client.distancematrix({
            params: {
                origins: [`${origin.lat},${origin.lng}`],
                destinations: [`${destination.lat},${destination.lng}`],
                key: apiKey
            }
        });

        const element = response.data.rows[0]?.elements[0];
        if (element?.status === 'OK') {
            return {
                distance: element.distance.text,
                duration: element.duration.text
            };
        }
        return null;
    } catch (error) {
        console.error('Distance calculation error:', error);
        return null;
    }
};

// Calculate distances for multiple destinations
const calculateMultipleDistances = async (origin, destinations) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) return [];

        const destinationStrings = destinations.map(d => `${d.lat},${d.lng}`);

        const response = await client.distancematrix({
            params: {
                origins: [`${origin.lat},${origin.lng}`],
                destinations: destinationStrings,
                key: apiKey
            }
        });

        const results = [];

        response.data.rows[0]?.elements.forEach((element, index) => {
            if (element.status === 'OK') {
                results.push({
                    id: destinations[index].id,
                    distance: element.distance.text,
                    duration: element.duration.text,
                    distanceValue: element.distance.value // in meters
                });
            }
        });

        return results.sort((a, b) => a.distanceValue - b.distanceValue);
    } catch (error) {
        console.error('Multiple distance calculation error:', error);
        return [];
    }
};

// Find nearby places (for suggesting job locations)
const findNearbyPlaces = async (lat, lng, type = 'point_of_interest', radius = 5000) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) return [];

        const response = await client.placesNearby({
            params: {
                location: { lat, lng },
                radius,
                type,
                key: apiKey
            }
        });

        return response.data.results.map((place) => ({
            name: place.name,
            address: place.vicinity || '',
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
        }));
    } catch (error) {
        console.error('Nearby places error:', error);
        return [];
    }
};

// Default coordinates for major Indian cities
const CITY_COORDINATES = {
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 }
};

module.exports = {
    geocodeAddress,
    reverseGeocode,
    calculateDistance,
    calculateMultipleDistances,
    findNearbyPlaces,
    CITY_COORDINATES
};
