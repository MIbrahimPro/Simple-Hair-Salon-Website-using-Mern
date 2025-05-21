const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const GeneralInfo = require('../models/GeneralInfo');
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

// @desc    Get general info (public—no password)
// @route   GET /api/general
// @access  Public
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const info = await GeneralInfo.findOne().select('-password -username');
        if (!info) {
            res.status(404);
            throw new Error('General info not set');
        }
        res.json(info);
    })
);

// @desc    Update general info (admin)
// @route   PUT /api/general
// @access  Admin
router.put(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const info = await GeneralInfo.findOne();
        if (!info) {
            res.status(404);
            throw new Error('General info not set');
        }
        Object.assign(info, req.body);
        await info.save();
        res.json(info);
    })
);

// @desc    Admin login
// @route   POST /api/general/login
// @access  Public
router.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { username, password } = req.body;
        const user = await GeneralInfo.findOne({ username });
        if (
            user &&
            (await bcrypt.compare(password, user.password))
        ) {
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );
            return res.json({ token });
        }
        res.status(401);
        throw new Error('Invalid credentials');
    })
);

module.exports = router;
