const bcrypt = require("bcryptjs");
const { User, Otp } = require("../models/index");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const {
  EMAIL_USER,
  EMAIL_PASS,
  JWT_SECRET,
  CLIENT_LINK,
} = require("../config/serverConfig");
const { redis } = require("../config/redis");

// Configure the email transporter using Gmail service
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const JWT_SECRET_KEY = JWT_SECRET;

class UserRepository {
  // Create a new user after hashing the password and checking for existing users
  async createUser(data) {
    const { name, email, password, phone, countryCode } = data;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return { success: false, message: "User already exists" };
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        countryCode,
        type: 0, // Default user type
      });

      return { success: true, user };
    } catch (error) {
      console.error("Error during user creation in repository layer:", error);
      throw { success: false, message: "Failed to create user" };
    }
  }

  // Handle user login by verifying credentials
  async login(data) {
    const { email, password } = data;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return { success: false, message: "Invalid credentials" };
      }

      if (user.type !== 0) {
        return {
          success: false,
          message: "This email is used by another login method.",
        };
      }

      // Compare provided password with stored hashed password
      if (!(await bcrypt.compare(password, user.password))) {
        return { success: false, message: "Invalid credentials" };
      }

      // Check if OTP is verified
      if (!user.otpVerified) {
        return {
          success: false,
          message: "OTP not verified",
          otpVerified: false,
        };
      }

      // Generate JWT token for the authenticated user
      const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
        expiresIn: "7d",
      });

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          type: user.type,
        },
        token,
      };
    } catch (error) {
      console.error("Error during login in repository layer:", error);
      throw { success: false, message: "Login failed" };
    }
  }

  // Validate if the provided email is registered
  async validEmail(email) {
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          message: "User not found.",
        };
      }

      // Check user type
      if (user.type !== 0) {
        return {
          success: false,
          message: "This email is used by another login method.",
        };
      }

      await this.sendChangePassMail(email); // Send change password email
      return { success: true };
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw { success: false, message: "Failed to process email validation" };
    }
  }

  // Change the user's password
  async changePassword(email, password) {
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return { success: false, message: "User not found" };
      }
  
      // Check if the new password is the same as the current password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return { success: false, message: "New password cannot be the same as the old password" };
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
  
      return { success: true };
    } catch (error) {
      console.error("Repository Layer Error:", error);
      throw { success: false, message: "Error changing password" };
    }
  }  

  // Update user information
  async updateUser(userId, data) {
    try {
      // Check if the new email is already taken by another user
      if (data.email) {
        const existingUser = await User.findOne({
          where: {
            email: data.email,
            id: { [Op.ne]: userId },
          },
        });
        if (existingUser) {
          return {
            success: false,
            message: 'Email already taken.'
          }
        }
        data.otpVerified = false; // Reset OTP verification status
      }

      const [updated] = await User.update(data, { where: { id: userId } });

      if (!updated) {
        throw new Error("User not found");
      }

      const user = await User.findByPk(userId);
      await redis.set(`user_${userId}`, JSON.stringify(user), "EX", 3600);

      return user;
    } catch (error) {
      console.error("Repository Layer Error:", error);
      throw error;
    }
  }

  // Send an OTP to the user's email
  async sendOtp(data) {
    const { email } = data;
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Generate a 5-digit OTP code
      const otpCode = Math.floor(10000 + Math.random() * 90000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Store the OTP in the database
      await Otp.create({
        user_id: user.id,
        otp_code: otpCode,
        expires_at: expiresAt,
        is_used: false,
      });

      // Send the OTP code to the user's email
      await transporter.sendMail({
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otpCode}. It will expire in 15 minutes.`,
      });

      await redis.set(`otp_${user.id}`, otpCode, "EX", 900);

      return {
        success: true,
        message: "OTP sent successfully",
        user: { id: user.id, email: user.email },
      };
    } catch (error) {
      console.error("Repository Layer Error:", error);
      throw new Error("Failed to send OTP");
    }
  }

  // Verify the OTP provided by the user
  async verifyOtp(data) {
    const { email, otp } = data;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Verify OTP against the database record
      const otpRecord = await Otp.findOne({
        where: {
          user_id: user.id,
          otp_code: otp,
          expires_at: { [Op.gt]: new Date() },
          is_used: false,
        },
      });

      if (!otpRecord) {
        return { success: false, message: "Invalid or expired OTP" };
      }

      // Mark the OTP as used
      otpRecord.is_used = true;
      await otpRecord.save();

      user.otpVerified = true;
      await user.save();

      await redis.del(`otp_${user.id}`);

      return this._generateTokenForUser(user); // Generate token for user
    } catch (error) {
      console.error("Repository Layer Error:", error);
      throw new Error("Failed to verify OTP");
    }
  }

  // Fetch user details by user ID
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          type: user.type,
        },
      };
    } catch (error) {
      console.error("Repository Layer Error:", error);
      throw error;
    }
  }

  // Generate JWT token for the user
  _generateTokenForUser(user) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        countryCode: user.countryCode,
        type: user.type,
      },
      token,
    };
  }

  // Mark the OTP as used in the database
  async _markOtpUsed(userId) {
    await Otp.update({ is_used: true }, { where: { user_id: userId } });
  }

  // Send a password change email to the user
  async sendChangePassMail(email) {
    try {
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: "Change Password Request",
        text: `We received a request to change your password. Please click the link below to proceed:\n\n${CLIENT_LINK}change-password/?email=${email}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      return { success: true, message: "Change password email sent" };
    } catch (error) {
      console.error("Error sending change password email:", error);
      throw new Error("Failed to send email");
    }
  }
}

module.exports = UserRepository;
