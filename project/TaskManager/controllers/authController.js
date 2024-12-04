import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

/**
 * Handles user registration by checking for existing users, hashing passwords, and saving new users.
 * @param {*} req
 * @param {*} res
 */
registerUser = (req, res) => {
const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
}

/**
 * Handles user login by verifying credentials and generating a JWT token.
 * @param {*} req
 * @param {*} res
 */
loginUser = (req, res) => {
const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
}

/**
 * Fetches the authenticated user's profile, excluding sensitive information like the password.
 * @param {*} req
 * @param {*} res
 */
getUserProfile = (req, res) => {
const userId = req.user.id;

    // Fetch user profile
    const user = await User.findById(userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
}

// Load environment variables
require('dotenv').config();

// User registration route
app.post('/api/auth/register', registerUser);

// User login route
app.post('/api/auth/login', loginUser);

// Get user profile route
app.get('/api/auth/profile', authMiddleware, getUserProfile);
export {"default":"registerUser, loginUser, getUserProfile"};
