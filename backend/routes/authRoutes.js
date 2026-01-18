const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Helper: Generate Token
const generateToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Seed Default Admin
const seedAdmin = async () => {
    try {
        const admins = [
            'admin@droneecareexpert.com',

        ];

        for (const email of admins) {
            const adminExists = await Admin.findOne({ email });
            if (!adminExists) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('admin123', salt);
                await Admin.create({
                    email,
                    password: hashedPassword
                });
                console.log(`Admin Account Created: ${email}`);
            }
        }
    } catch (err) {
        console.error('Admin Seeding Failed:', err);
    }
};

seedAdmin(); // Run on server start

// Helper: Generate Coupon
const generateCouponCode = async (name, discount) => {
    let base = name.substring(0, 4).toUpperCase();
    if (base.length < 4) {
        base = base.padEnd(4, 'X');
    }

    // Map offer codes to short suffixes (Max 3 chars)
    const suffixMap = {
        'service-10': 'S10',  // 4+3 = 7
        'service-20': 'S20',
        'basic-30': 'B30',
        'basic-40': 'B40',
        'basic-50': 'B50',
        'bill-10': 'BIL',    // Bill
        'voucher-1000': 'V1K',
        'full-free': 'FUL',  // Full
        'half-free': 'HLF'   // Half
    };

    const suffix = suffixMap[discount] || 'GEN'; // Default if unknown
    const codeBase = `${base}${suffix}`;

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
    const { name, email, password, discount, phoneNumber } = req.body;

    if (!name || !email || !password || !discount || !phoneNumber) {
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
        phoneNumber,
        password: hashedPassword,
        discount: discount, // Store as string
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
            role: 'user',
            token: generateToken(user._id, 'user')
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check for Admin
    const admin = await Admin.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
        return res.json({
            _id: admin._id,
            email: admin.email,
            role: 'admin',
            token: generateToken(admin._id, 'admin')
        });
    }

    // Check for User
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            couponCode: user.couponCode,
            discount: user.discount,
            expiresAt: user.expiresAt,
            status: user.status,
            role: 'user',
            token: generateToken(user._id, 'user')
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// @route   GET /api/auth/me
// @access  Private
const { protect } = require('../middleware/authMiddleware');
router.get('/me', protect, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const admin = await Admin.findById(req.user.id).select('-password');
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            return res.json({ ...admin.toObject(), role: 'admin' });
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ ...user.toObject(), role: 'user' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
