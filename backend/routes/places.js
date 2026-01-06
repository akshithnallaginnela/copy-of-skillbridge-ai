const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    searchNearbyProfessionals,
    textSearchProfessionals,
    getPlaceDetails,
    getAvailableCategories
} = require('../services/placesService');

/**
 * @route   GET /api/places/nearby
 * @desc    Search for nearby professionals by category using Google Places
 * @access  Public (no auth required for searching)
 */
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, category, radius = 5000, query } = req.query;

        // Validate coordinates
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Location coordinates (lat, lng) are required'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const searchRadius = parseInt(radius);

        let professionals;

        if (query) {
            // Text-based search (e.g., "electrician near me")
            professionals = await textSearchProfessionals(query, latitude, longitude, searchRadius);
        } else if (category) {
            // Category-based search
            professionals = await searchNearbyProfessionals(latitude, longitude, category, searchRadius);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Either category or query is required'
            });
        }

        res.json({
            success: true,
            count: professionals.length,
            radius: searchRadius,
            location: { lat: latitude, lng: longitude },
            data: professionals
        });
    } catch (error) {
        console.error('Places search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching for professionals',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/places/search
 * @desc    Text search for any service type
 * @access  Public
 */
router.get('/search', async (req, res) => {
    try {
        const { q, lat, lng, radius = 5000 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query (q) is required'
            });
        }

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Location coordinates (lat, lng) are required'
            });
        }

        const professionals = await textSearchProfessionals(
            q,
            parseFloat(lat),
            parseFloat(lng),
            parseInt(radius)
        );

        res.json({
            success: true,
            query: q,
            count: professionals.length,
            data: professionals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search error',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/places/details/:placeId
 * @desc    Get detailed information about a specific place
 * @access  Public
 */
router.get('/details/:placeId', async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: 'Place ID is required'
            });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const details = await getPlaceDetails(placeId, apiKey);

        if (!details) {
            return res.status(404).json({
                success: false,
                message: 'Place not found'
            });
        }

        res.json({
            success: true,
            data: details
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting place details',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/places/categories
 * @desc    Get available service categories
 * @access  Public
 */
router.get('/categories', (req, res) => {
    const categories = getAvailableCategories();
    res.json({
        success: true,
        data: categories
    });
});

module.exports = router;
