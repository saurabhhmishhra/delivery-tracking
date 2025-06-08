const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '80D23w$2'; // Use env variable in production

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, name, email } = req.body;

    // Check if user exists
    let existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'Username already taken' });

    // Create user
    const user = new User({ username, role, name, email });
    await user.setPassword(password);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const validPassword = await user.validatePassword(password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

    // Create JWT payload
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    // Sign token (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
