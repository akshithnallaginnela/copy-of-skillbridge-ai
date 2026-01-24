const express = require('express');
const cors = require('cors');
const connectDB = require('./lib/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (uses cached connection)
let dbConnectionPromise = null;

app.use(async (req, res, next) => {
    try {
        if (!dbConnectionPromise) {
            dbConnectionPromise = connectDB();
        }
        await dbConnectionPromise;
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

// Import routes
const authRoutes = require('./routes/auth');
const gigsRoutes = require('./routes/gigs');
const locationRoutes = require('./routes/location');
const placesRoutes = require('./routes/places');

// API Routes (no /api prefix needed - already in /api/index.js)
app.use('/auth', authRoutes);
app.use('/gigs', gigsRoutes);
app.use('/location', locationRoutes);
app.use('/places', placesRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SkillBridge API is running on Vercel',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to SkillBridge API',
        version: '1.0.0'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Export for Vercel (NO app.listen!)
module.exports = app;
