const { JWT_SECRET } = require("../config/serverConfig");
const UserRepository = require("../repository/user-repository");
const jwt = require('jsonwebtoken');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // Create a new user
  async createUser(data) {
    try {
      const user = await this.userRepository.createUser(data);
      return user;
    } catch (error) {
      console.log('Something went wrong at service layer');
      throw { error };
    }
  }

  // Handle user login
  async login(data) {
    try {
      const response = await this.userRepository.login(data);
      return response;
    } catch (error) {
      console.log('Something went wrong at service layer');
      throw { error };
    }
  }

  // Validate if the provided email is registered
  async validEmail(email) {
    try {
      const response = await this.userRepository.validEmail(email);
      return response;
    } catch (error) {
      console.error('Error in service layer:', error);
      throw { success: false, message: 'Failed to validate email' };
    }
  }

  // Change the user's password
  async changePassword(email, password) {
    try {
      const response = await this.userRepository.changePassword(email, password);
      return response;
    } catch (error) {
      console.error('Service Layer Error:', error);
      throw { success: false, message: 'Failed to change password' };
    }
  }  

  // Update user information
  async updateUser(data) {
    try {
      const userId = data.id; // Extract user ID from data
      const { id: _, ...updateData } = data; // Exclude ID from update data
  
      const user = await this.userRepository.updateUser(userId, updateData);
      return user;
    } catch (error) {
      console.error('Service Layer Error:', error);
      throw new Error('Error updating user');
    }
  }  

  // Send an OTP to the user's email
  async sendOtp(data) {
    try {
      const otp = await this.userRepository.sendOtp(data);
      return otp;
    } catch (error) {
      console.error('Service Layer Error:', error);
      throw new Error('Failed to send OTP');
    }
  }  

  // Verify the OTP provided by the user
  async verifyOtp(data) {
    try {
      const response = await this.userRepository.verifyOtp(data);
      return response;
    } catch (error) {
      console.error('Service Layer Error:', error);
      throw new Error('Failed to verify OTP');
    }
  }  

  // Fetch user details by user ID
  async getUser(id) {
    try {
      const response = await this.userRepository.getUserById(id);
      return response;
    } catch (error) {
      console.error('Service Layer Error:', error);
      throw new Error('Failed to fetch user');
    }
  }  

  // Verify the provided JWT token
  async verifyToken(token) {
    try {
      const decoded = this.tokenVerification(token);
  
      const user = await this.userRepository.getUserById(decoded.id);
      if (!user.success) {
        throw { status: 404, message: 'No user with the corresponding token exists' };
      }
  
      return { userId: user.user.id, email: user.user.email };
    } catch (error) {
      console.error('Service Layer Error:', error);
      throw { status: 401, message: error.message || 'Invalid token' };
    }
  }  

  // Token verification utility method
  tokenVerification(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token validation error:', error);
      throw new Error('Invalid or expired token');
    }
  }  

  // Handle Google login callback
  async googleCallback(user) {
    try {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { token };
    } catch (error) {
      console.error('Service Layer Error:', error);
      throw new Error('Failed to process Google login at service layer');
    }
  }
}

module.exports = UserService;
