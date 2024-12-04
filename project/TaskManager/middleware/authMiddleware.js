import jsonwebtoken from 'jsonwebtoken';

/**
 * Middleware function that checks for a valid JWT token in the request headers. If the token is valid, it decodes the token and attaches the user information to the request object. If the token is missing or invalid, it sends an appropriate error response.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
authMiddleware = (req, res, next) => {
const token = req.header('Authorization')?.replace('Bearer ', '');

if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
}

try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
} catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
}
}

// authMiddleware.js
// Middleware for protecting routes
// This middleware checks for a valid JWT token in the Authorization header.
// If the token is valid, it allows the request to proceed; otherwise, it returns an error.
export {"default":"authMiddleware"};
