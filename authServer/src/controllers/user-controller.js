const { CLIENT_LINK } = require("../config/serverConfig");
const UserService = require("../services/user-service");

const userService = new UserService();

// Create a new user with basic validation
const createUser = async (req, res) => {
  const { name, email, password, phone, countryCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.',
    });
  }

  try {
    const response = await userService.createUser({ name, email, password, phone, countryCode });

    if (!response.success) {
      return res.status(409).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(201).json({
      success: true,
      data: response,
      message: 'Successfully created a user',
    });
  } catch (error) {
    console.error('Error during user creation:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to create user. Please try again later.',
      data: null,
      error: error.message
    });
  }
};

// Handle user login with optional OTP verification status
const login = async (req, res) => {
  try {
    const response = await userService.login(req.body);

    if (!response.success) {
      return res.status(401).json({
        data: {},
        success: false,
        message: response.message,
        ...(response.otpVerified !== undefined && { otpVerified: response.otpVerified }),
      });
    }

    return res.status(200).json({
      data: response,
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Check if an email is valid and send a reset email if it exists
const validEmail = async (req, res) => {
  try {
    const response = await userService.validEmail(req.body.email);

    if (!response.success) {
      return res.status(404).json({
        data: {},
        success: false,
        message: response.message || 'Email not found',
      });
    }

    return res.status(200).json({
      data: {},
      success: true,
      message: 'Email exists, change password email sent',
    });
  } catch (error) {
    console.error('Error validating email:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

// Change user password with validation
const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        data: {},
        success: false,
        message: 'Email and password are required',
        error: error.message
      });
    }

    const response = await userService.changePassword(email, password);

    if (!response.success) {
      return res.status(404).json({
        data: {},
        success: false,
        message: response.message || 'Error changing password.',
      });
    }

    return res.status(200).json({
      data: {},
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: 'Unable to change password',
      error: error.message
    });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.body);
    if(user?.success == false) {
      return res.status(404).json({
        data: {},
        success: false,
        message: user.message || 'Email already taken.',
      });
    }

    if (!user) {
      return res.status(404).json({
        data: {},
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      data: user,
      success: true,
      message: 'Successfully updated the user',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: error.message || 'Failed to update user',
      error: error.message
    });
  }
};

// Send OTP to the user
const sendOtp = async (req, res) => {
  try {
    const response = await userService.sendOtp(req.body);

    if (!response.success) {
      return res.status(404).json({
        data: {},
        success: false,
        message: response.message,
      });
    }

    return res.status(201).json({
      data: response,
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: 'Unable to send OTP',
      error: error.message,
    });
  }
};

// Verify the OTP sent to the user
const verifyOtp = async (req, res) => {
  try {
    const response = await userService.verifyOtp(req.body);

    if (!response.success) {
      return res.status(401).json({
        data: {},
        success: false,
        message: response.message,
      });
    }

    return res.status(200).json({
      data: response,
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: 'Unable to verify OTP',
      error: error.message,
    });
  }
};

// Get a user by their ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUser(req.query.id);

    if (!user.success) {
      return res.status(404).json({
        data: {},
        success: false,
        message: user.message,
      });
    }

    return res.status(200).json({
      data: {
        user: user.user
      },
      success: true,
      message: 'Fetched user successfully',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: 'User fetching failed',
      error: error.message,
    });
  }
};

// Get the authenticated user
const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.user.id);

    if (!user.success) {
      return res.status(404).json({
        data: {},
        success: false,
        message: user.message,
      });
    }

    return res.status(200).json({
      data: {
        user: user.user
      },
      success: true,
      message: 'Fetched user successfully',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      data: {},
      success: false,
      message: 'User fetching failed',
      error: error.message,
    });
  }
};

// Verify the token from the authorization header
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token not found in authorization header',
      });
    }

    const response = await userService.verifyToken(token);
    return res.status(200).json({
      success: true,
      data: response,
      message: 'User is authenticated and token is valid',
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    });
  }
};

// Handle Google OAuth callback and redirect with token
const googleCallback = async (req, res) => {
  try {
    const { token } = await userService.googleCallback(req.user);
    return res.redirect(`${CLIENT_LINK}auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      data: {},
      error: error.message || 'Unexpected error',
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  sendOtp,
  verifyOtp,
  login,
  googleCallback,
  getUser,
  verifyToken,
  validEmail,
  changePassword,
  getUserById,
};
