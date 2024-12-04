import express from 'express';
import authController from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

/**
 * Defines the authentication routes for user registration, login, and profile retrieval.
 */
router = () => {
const router = express.Router();

// Route for user registration
router.post('/register', authController.register);

// Route for user login
router.post('/login', authController.login);

// Route for getting user profile (protected)
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

// Export the router
module.exports = router;
}

// Import express to create a router for authentication routes
const express = require('express');

// Import the authentication controller for handling requests
const authController = require('../controllers/authController');

// Import authentication middleware for protecting routes
const authMiddleware = require('../middleware/authMiddleware');

// Create a new router instance
const router = express.Router();

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

// Export the router for use in the main application
module.exports = router;
export {"module":"exports","value":"router"};
