const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Gig = require('../models/Gig');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/gigs/all
// @desc    Get all open gigs (for professionals to browse)
// @access  Public
router.get('/all', async (req, res) => {
    try {
        // Get all gigs with type='Posted' and status='Open'
        const gigs = await Gig.find({
            type: 'Posted',
            status: 'Open'
        })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to 50 most recent gigs

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        console.error('Get all gigs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/gigs
// @desc    Get all gigs for current user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const gigs = await Gig.find({ userId: req.user.id })
            .populate('applicants', 'name email avatar')
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

// @route   GET /api/gigs/applied
// @desc    Get all gigs the current user has applied to (for professionals)
// @access  Private
router.get('/applied', protect, async (req, res) => {
    try {
        // Find all gigs where the current user is in the applicants array
        const gigs = await Gig.find({ applicants: req.user.id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        console.error('Get applied gigs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/gigs
// @desc    Create a new gig
// @access  Private
router.post('/', protect, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['Plumbing', 'Electrical', 'Beauty', 'Cleaning', 'Carpentry', 'Other']).withMessage('Invalid category'),
    body('budget').trim().notEmpty().withMessage('Budget is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('type').isIn(['Applied', 'Posted']).withMessage('Type must be Applied or Posted')
], async (req, res) => {
    try {
        console.log('POST /api/gigs - User:', req.user?.id);
        console.log('POST /api/gigs - Body:', req.body);

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { title, description, category, budget, location, type } = req.body;

        const gig = await Gig.create({
            userId: req.user.id,
            title,
            description,
            category,
            budget,
            location,
            type
        });

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

// @route   POST /api/gigs/:id/apply
// @desc    Apply for a gig (for professionals)
// @access  Private
router.post('/:id/apply', protect, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        // Check if gig is still open
        if (gig.status !== 'Open') {
            return res.status(400).json({
                success: false,
                message: 'This gig is no longer accepting applications'
            });
        }

        // Check if user already applied
        if (gig.applicants.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this gig'
            });
        }

        // Add user to applicants
        gig.applicants.push(req.user.id);
        gig.status = 'Pending'; // Change status to Pending when someone applies
        await gig.save();

        res.status(200).json({
            success: true,
            message: 'Successfully applied for gig',
            gig
        });
    } catch (error) {
        console.error('Apply for gig error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   PUT /api/gigs/:id
// @desc    Update a gig
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        // Check if user owns the gig
        if (gig.userId.toString() !== req.user.id) {
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

// @route   DELETE /api/gigs/:id
// @desc    Delete a gig
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found'
            });
        }

        // Check if user owns the gig
        if (gig.userId.toString() !== req.user.id) {
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

module.exports = router;
