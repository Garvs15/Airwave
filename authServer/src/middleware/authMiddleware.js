const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/serverConfig');

// Middleware to authenticate and verify JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing or malformed',
    });
  }

  // Extract the token from the 'Bearer' scheme
  const token = authHeader.split(' ')[1];

  // Handle case where token is not provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token not found in authorization header',
    });
  }

  // Verify the JWT token using the secret key
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Handle token expiration or invalid token errors
      const message =
        err.name === 'TokenExpiredError'
          ? 'Token has expired'
          : 'Invalid token';

      return res.status(403).json({
        success: false,
        message,
      });
    }

    // Attach the user data to the request object for further use
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
