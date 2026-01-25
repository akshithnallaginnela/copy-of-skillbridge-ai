import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

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

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
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
                NODE_ENV: process.env.NODE_ENV || 'not set'
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
