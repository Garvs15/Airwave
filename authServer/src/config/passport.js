const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const { clientID, clientSecret, SERVER_LINK } = require('./serverConfig');

// Define user types as constants for clarity
const GOOGLE_USER_TYPE = 1;

// ✅ Create final callback first
const finalCallback = `${SERVER_LINK}/api/v1/google/callback`;

// ✅ ADD LOG HERE
console.log("Google Callback URL being sent to Google:", finalCallback);

// Set up the Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: finalCallback, // Google OAuth callback
    },
    // console.log("Google Callback URL:", finalCallback)
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { displayName, emails } = profile;
        const email = emails[0].value;
   
        // Check if the user exists in the database
        let user = await User.findOne({ where: { email } });

        if (!user) {
          // Create a new user if not found
          user = await User.create({
            name: displayName,
            email,
            type: GOOGLE_USER_TYPE,
          });
        } else if (user.type !== GOOGLE_USER_TYPE) {
          // Handle users registered with different login methods
          return done(null, false, {
            message: "This email is registered using a different login method.",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
