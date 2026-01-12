const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check admin ID
const checkAdmin = (req, res, next) => {
    if (req.params.adminId === process.env.ADMIN_ID) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Invalid Admin ID' });
    }
};

// @route   GET /api/admin/:adminId/users
// @access  Private (Hardcoded ID)
router.get('/:adminId/users', checkAdmin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/:adminId/mark/:userId
// @access  Private (Hardcoded ID)
router.put('/:adminId/mark/:userId', checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status === 'used') {
            return res.status(400).json({ message: 'Coupon already used' });
        }

        user.status = 'used';
        user.redemptionDate = new Date();
        user.adminComments = req.body.comments || '';
        await user.save();

        res.json({ message: 'Coupon marked as used', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
