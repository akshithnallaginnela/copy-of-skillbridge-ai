import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { Client } from '@googlemaps/google-maps-services-js';

// MongoDB Connection with caching for Vercel
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error("Please define MONGODB_URI in Vercel environment variables");
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB Connected (Vercel Serverless)');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

// User Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['WORKER', 'CUSTOMER'],
        required: [true, 'Please select a role']
    },
    avatar: {
        type: String,
        default: ''
    },
    profile: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Gig Model
const gigSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    budget: {
        type: String,
        required: [true, 'Please provide a budget']
    },
    location: {
        type: String,
        required: [true, 'Please provide a location']
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'OPEN',
        required: true
    }
}, { timestamps: true });

const Gig = mongoose.models.Gig || mongoose.model('Gig', gigSchema);


// Auth Middleware
const protect = async (req, res, next) => {
    let token;

    // Debug logging
    console.log('🔐 Auth check - Headers:', req.headers.authorization ? 'Present' : 'Missing');

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('✅ Token extracted, length:', token?.length);
    }

    if (!token) {
        console.log('❌ No token found in request');
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route - No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified for user:', decoded.id);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            console.log('❌ User not found for ID:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'Not authorized - User not found'
            });
        }

        console.log('✅ User authenticated:', req.user.email);
        next();
    } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route - Invalid token'
        });
    }
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ AUTH ROUTES ============

// POST /api/auth/signup
app.post('/api/auth/signup', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['WORKER', 'CUSTOMER']).withMessage('Role must be either WORKER or CUSTOMER')
], async (req, res) => {
    try {
        await connectDB();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup',
            error: error.message
        });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        await connectDB();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// GET /api/auth/me
app.get('/api/auth/me', protect, async (req, res) => {
    try {
        await connectDB();

        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// PUT /api/auth/profile
app.put('/api/auth/profile', protect, async (req, res) => {
    try {
        await connectDB();

        const { name, profile } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (profile) updateData.profile = profile;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============ GIG ROUTES ============

// GET /api/gigs
app.get('/api/gigs', async (req, res) => {
    try {
        await connectDB();

        const { category, status, search } = req.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const gigs = await Gig.find(query)
            .populate('user', 'name email avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        console.error('Get gigs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// POST /api/gigs
app.post('/api/gigs', protect, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('budget').trim().notEmpty().withMessage('Budget is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
], async (req, res) => {
    try {
        await connectDB();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const gigData = {
            ...req.body,
            user: req.user.id
        };

        const gig = await Gig.create(gigData);

        res.status(201).json({
            success: true,
            message: 'Gig created successfully',
            gig
        });
    } catch (error) {
        console.error('Create gig error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// GET /api/gigs/my
app.get('/api/gigs/my', protect, async (req, res) => {
    try {
        await connectDB();

        const gigs = await Gig.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        console.error('Get my gigs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// GET /api/gigs/:id
app.get('/api/gigs/:id', async (req, res) => {
    try {
        await connectDB();

        const gig = await Gig.findById(req.params.id)
            .populate('user', 'name email avatar');

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        res.status(200).json({
            success: true,
            gig
        });
    } catch (error) {
        console.error('Get gig error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// PUT /api/gigs/:id
app.put('/api/gigs/:id', protect, async (req, res) => {
    try {
        await connectDB();

        let gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        if (gig.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this gig'
            });
        }

        gig = await Gig.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Gig updated successfully',
            gig
        });
    } catch (error) {
        console.error('Update gig error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// DELETE /api/gigs/:id
app.delete('/api/gigs/:id', protect, async (req, res) => {
    try {
        await connectDB();

        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        if (gig.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this gig'
            });
        }

        await gig.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Gig deleted successfully'
        });
    } catch (error) {
        console.error('Delete gig error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// ============ GOOGLE MAPS PLACES API ROUTES ============

// Initialize Google Maps client
const mapsClient = new Client({});

// Service category mappings
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

// Helper function to get place details
const getPlaceDetails = async (placeId, apiKey) => {
    try {
        const response = await mapsClient.placeDetails({
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

// GET /api/places/nearby
app.get('/api/places/nearby', async (req, res) => {
    try {
        const { lat, lng, category, radius = 5000, query } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Location coordinates (lat, lng) are required'
            });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Google Maps API key not configured'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const searchRadius = parseInt(radius);

        let professionals = [];

        if (query) {
            // Text-based search
            const response = await mapsClient.textSearch({
                params: {
                    query: query,
                    location: { lat: latitude, lng: longitude },
                    radius: searchRadius,
                    key: apiKey
                }
            });

            if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
                professionals = (response.data.results || []).slice(0, 15).map(place => ({
                    id: place.place_id,
                    source: 'google_places',
                    name: place.name,
                    category: category || 'Professional',
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
            }
        } else if (category) {
            // Category-based search
            const categoryConfig = CATEGORY_MAPPINGS[category.toLowerCase()] || {
                type: 'point_of_interest',
                keywords: [category]
            };

            const response = await mapsClient.placesNearby({
                params: {
                    location: { lat: latitude, lng: longitude },
                    radius: searchRadius,
                    type: categoryConfig.type,
                    keyword: categoryConfig.keywords[0],
                    key: apiKey
                }
            });

            if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
                const places = (response.data.results || []).slice(0, 20);
                professionals = await Promise.all(
                    places.map(async (place) => {
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
                            phone: details?.formatted_phone_number || details?.international_phone_number || null,
                            website: details?.website || null,
                            photo: place.photos?.[0]
                                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(place.name)}&background=3B82F6&color=fff&size=200`,
                            hours: details?.opening_hours?.weekday_text || [],
                            reviews: (details?.reviews || []).slice(0, 3).map(review => ({
                                author: review.author_name,
                                rating: review.rating,
                                text: review.text,
                                time: review.relative_time_description
                            })),
                            mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                            directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}&destination_place_id=${place.place_id}`
                        };
                    })
                );
            }
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

// GET /api/places/search
app.get('/api/places/search', async (req, res) => {
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

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Google Maps API key not configured'
            });
        }

        const response = await mapsClient.textSearch({
            params: {
                query: q,
                location: { lat: parseFloat(lat), lng: parseFloat(lng) },
                radius: parseInt(radius),
                key: apiKey
            }
        });

        const professionals = (response.data.results || []).slice(0, 15).map(place => ({
            id: place.place_id,
            source: 'google_places',
            name: place.name,
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

// GET /api/places/details/:placeId
app.get('/api/places/details/:placeId', async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: 'Place ID is required'
            });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'Google Maps API key not configured'
            });
        }

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

// GET /api/places/categories
app.get('/api/places/categories', (req, res) => {
    const categories = Object.keys(CATEGORY_MAPPINGS).map(key => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
        description: CATEGORY_MAPPINGS[key].keywords[0]
    }));

    res.json({
        success: true,
        data: categories
    });
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
    try {
        const hasMongoUri = !!process.env.MONGODB_URI;
        const hasJwtSecret = !!process.env.JWT_SECRET;

        let dbStatus = 'not connected';
        let dbError = null;

        try {
            await connectDB();
            dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
        } catch (error) {
            dbStatus = 'error';
            dbError = error.message;
        }

        res.status(200).json({
            success: true,
            environment: {
                MONGODB_URI: hasMongoUri ? 'set' : 'missing',
                JWT_SECRET: hasJwtSecret ? 'set' : 'missing',
                JWT_EXPIRE: process.env.JWT_EXPIRE || 'not set',
                NODE_ENV: process.env.NODE_ENV || 'not set',
                GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ? 'set' : 'missing'
            },
            database: {
                status: dbStatus,
                error: dbError
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Debug endpoint error',
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SkillBridge API is running on Vercel',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedUrl: req.url
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Export for Vercel
export default app;
