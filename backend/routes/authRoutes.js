const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper: Generate Coupon
const generateCouponCode = async (name, discount) => {
    let base = name.substring(0, 4).toUpperCase();
    if (base.length < 4) {
        base = base.padEnd(4, 'X');
    }
    const codeBase = `${base}${discount}`;

    // Check uniqueness
    let code = codeBase;
    let exists = await User.findOne({ couponCode: code });

    while (exists) {
        const random = Math.floor(Math.random() * 1000);
        code = `${codeBase}X${random}`;
        exists = await User.findOne({ couponCode: code });
    }
    return code;
};

// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, discount } = req.body;

    if (!name || !email || !password || !discount) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Coupon
    const couponCode = await generateCouponCode(name, discount);

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        discount: Number(discount),
        couponCode,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            couponCode: user.couponCode,
            discount: user.discount,
            expiresAt: user.expiresAt,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            couponCode: user.couponCode,
            discount: user.discount,
            expiresAt: user.expiresAt,
            status: user.status,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// @route   GET /api/auth/me
// @access  Private
const { protect } = require('../middleware/authMiddleware');
router.get('/me', protect, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user);
});

module.exports = router;
