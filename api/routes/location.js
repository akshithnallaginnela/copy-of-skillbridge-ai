const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// Import location service functions
const {
    geocodeAddress,
    reverseGeocode,
    calculateDistance,
    calculateMultipleDistances,
    CITY_COORDINATES
} = require('../services/locationService');

/**
 * @route   GET /api/location/nearby-professionals
 * @desc    Find professionals near a location
 * @access  Private
 */
router.get('/nearby-professionals', protect, async (req, res) => {
    try {
        const { lat, lng, radius = 10, category } = req.query;

        // Validate coordinates
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const radiusKm = parseFloat(radius);

        // Find workers with location data
        let query = {
            role: 'WORKER',
            'profile.location': { $exists: true, $ne: '' }
        };

        // Filter by category if provided
        if (category) {
            query['profile.skills'] = { $in: [new RegExp(category, 'i')] };
        }

        const workers = await User.find(query).select('-password');

        // If workers don't have coordinates, try to geocode their location
        const workersWithCoords = await Promise.all(
            workers.map(async (worker) => {
                let coords = worker.profile?.coordinates;

                // If no coordinates, try to geocode
                if (!coords && worker.profile?.location) {
                    coords = await geocodeAddress(worker.profile.location);

                    // Save coordinates for future use
                    if (coords) {
                        await User.findByIdAndUpdate(worker._id, {
                            'profile.coordinates': coords
                        });
                    }
                }

                return {
                    ...worker.toObject(),
                    coordinates: coords
                };
            })
        );

        // Filter workers with valid coordinates
        const workersWithValidCoords = workersWithCoords.filter(w => w.coordinates);

        // Calculate distances
        if (workersWithValidCoords.length > 0) {
            const destinations = workersWithValidCoords.map(w => ({
                id: w._id.toString(),
                lat: w.coordinates.lat,
                lng: w.coordinates.lng
            }));

            const distances = await calculateMultipleDistances(
                { lat: userLat, lng: userLng },
                destinations
            );

            // Merge distance data with worker data
            const workersWithDistance = workersWithValidCoords.map(worker => {
                const distanceInfo = distances.find(d => d.id === worker._id.toString());
                return {
                    ...worker,
                    distance: distanceInfo?.distance || 'Unknown',
                    duration: distanceInfo?.duration || 'Unknown',
                    distanceValue: distanceInfo?.distanceValue || Infinity
                };
            });

            // Filter by radius and sort by distance
            const nearbyWorkers = workersWithDistance
                .filter(w => w.distanceValue <= radiusKm * 1000)
                .sort((a, b) => a.distanceValue - b.distanceValue);

            return res.json({
                success: true,
                count: nearbyWorkers.length,
                radius: radiusKm,
                data: nearbyWorkers
            });
        }

        // Return workers without distance if no coordinates available
        res.json({
            success: true,
            count: workersWithCoords.length,
            data: workersWithCoords,
            message: 'Distance calculation not available - workers missing location data'
        });
    } catch (error) {
        console.error('Nearby professionals error:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding nearby professionals',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/location/geocode
 * @desc    Convert address to coordinates
 * @access  Private
 */
router.post('/geocode', protect, async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Address is required'
            });
        }

        const coordinates = await geocodeAddress(address);

        if (coordinates) {
            res.json({
                success: true,
                data: coordinates
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Could not geocode address'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Geocoding error',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/location/reverse-geocode
 * @desc    Convert coordinates to address
 * @access  Private
 */
router.post('/reverse-geocode', protect, async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const address = await reverseGeocode(lat, lng);

        if (address) {
            res.json({
                success: true,
                data: { address }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Could not reverse geocode coordinates'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Reverse geocoding error',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/location/distance
 * @desc    Calculate distance between two points
 * @access  Private
 */
router.post('/distance', protect, async (req, res) => {
    try {
        const { origin, destination } = req.body;

        if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
            return res.status(400).json({
                success: false,
                message: 'Origin and destination coordinates are required'
            });
        }

        const distance = await calculateDistance(origin, destination);

        if (distance) {
            res.json({
                success: true,
                data: distance
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Could not calculate distance'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Distance calculation error',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/location/update-my-location
 * @desc    Update current user's location
 * @access  Private
 */
router.post('/update-my-location', protect, async (req, res) => {
    try {
        const { lat, lng, address } = req.body;

        let location = address;
        let coordinates = { lat, lng };

        // If only address provided, geocode it
        if (address && (!lat || !lng)) {
            coordinates = await geocodeAddress(address);
            if (!coordinates) {
                return res.status(400).json({
                    success: false,
                    message: 'Could not geocode the provided address'
                });
            }
        }

        // If only coordinates provided, reverse geocode
        if (lat && lng && !address) {
            location = await reverseGeocode(lat, lng);
        }

        // Update user's location
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                'profile.location': location,
                'profile.coordinates': coordinates
            },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Location updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating location',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/location/cities
 * @desc    Get predefined city coordinates
 * @access  Public
 */
router.get('/cities', (req, res) => {
    res.json({
        success: true,
        data: CITY_COORDINATES
    });
});

module.exports = router;
