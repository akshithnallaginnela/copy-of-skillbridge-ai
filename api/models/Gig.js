const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    userId: {
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
        enum: ['Plumbing', 'Electrical', 'Beauty', 'Cleaning', 'Carpentry', 'Other']
    },
    budget: {
        type: String,
        required: [true, 'Please provide a budget']
    },
    location: {
        type: String,
        required: [true, 'Please provide a location']
    },
    status: {
        type: String,
        enum: ['Open', 'Pending', 'Accepted', 'Completed'],
        default: 'Open'
    },
    type: {
        type: String,
        enum: ['Applied', 'Posted'],
        required: true
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp
gigSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Gig', gigSchema);
