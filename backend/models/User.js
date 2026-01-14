const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        unique: true
    },
    discount: {
        type: String, // Changed from Number to String to support offer codes
        required: true
    },
    status: {
        type: String,
        enum: ['unused', 'used'],
        default: 'unused'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    redemptionDate: {
        type: Date
    },
    adminComments: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);
