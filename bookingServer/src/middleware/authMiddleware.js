const axios = require('axios');
const { AUTH_PATH } = require('../config/serverConfig');

// Middleware to authorize user by validating the JWT token
const authorizeUser = async (req, res, next) => {
  // Extract the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, respond with 401 Unauthorized
  // if (!token) return res.sendStatus(401);

  try {
    // Validate the token by calling the authentication service
    const response = await axios.get(`${AUTH_PATH}/api/v1/isAuthenticated`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });


    // If the response is valid, proceed to the next middleware
    if (response.data.success) {
      next();
    } else {
      // If the token is invalid, respond with 403 Forbidden
      return res.sendStatus(403);
    }
  } catch (error) {
    console.error('Authorization error:', error.message);
    return res.sendStatus(500);
  }
};

module.exports = { authorizeUser };
