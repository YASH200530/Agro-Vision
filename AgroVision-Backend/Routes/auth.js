// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// helper to create token
function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// sanitize user object (from mongoose transform this is often redundant but safe)
function formatUser(user) {
  if (!user) return null;
  // if user is a Mongoose doc, conversion already handled by schema transform
  return {
    id: user.id || user._id?.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || user.phoneNumber,
    preferredLanguage: user.preferredLanguage || 'en'
  };
}

/**
 * POST /api/auth/signup
 * body: { name, email, password, phone }
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, preferredLanguage } = req.body;
    console.log("Received signup data:", req.body);
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Signup error: Email already exists:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const created = await User.create({
      name,
      email,
      phone,
      password: hashed,
      preferredLanguage: preferredLanguage || "en"
    });

    const user = formatUser(created);
    const token = createToken({ id: user.id });

    return res.status(201).json({ message: 'User registered', user, token });
  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

    const userDoc = await User.findOne({ email }).select('+password'); // ensure password is selectable if schema set select:false
    if (!userDoc) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const user = formatUser(userDoc);
    const token = createToken({ id: user.id });

    // optional: set a cookie (if frontend uses it); also return token in JSON
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.json({ message: 'Logged in', user, token });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/auth/me
 * Protected — update profile fields: { name?, phone?, preferredLanguage? }
 */
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // set by authMiddleware
    const updates = {};
    const { name, phone, preferredLanguage } = req.body;
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;

    const updated = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const user = formatUser(updated);
    return res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error('updateProfile error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/auth/me
 * optional: return current user info
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: formatUser(userDoc) });
  } catch (err) {
    console.error('getMe error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
