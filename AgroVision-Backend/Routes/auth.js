const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust path if needed
const verifyToken = require('../middleware/auth');

// REGISTER / SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const savedUser = await newUser.save();

    // 4. Create Token (Optional: Auto-login after signup)
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // 5. Set Cookie and return token + user (without password)
    const userObj = savedUser._doc ? { ...savedUser._doc } : { ...savedUser };
    if (userObj.password) delete userObj.password;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: 'User created successfully', token, user: userObj });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Validate Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // 4. Remove password from response
    const { password: _, ...userInfo } = user._doc;

    // 5. Set Cookie and Send Response (include token)
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: 'Login successful', token, user: userInfo });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// USER DETAILS (Protected Route)
router.get('/me', verifyToken, async (req, res) => {
  try {
    // req.user.id comes from the verifyToken middleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res
    .clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })
    .status(200)
    .json({ message: 'Logged out successfully' });
});

module.exports = router;