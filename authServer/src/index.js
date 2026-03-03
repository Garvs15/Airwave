const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const colors = require('colors');
const passport = require('./config/passport');
const { PORT } = require('./config/serverConfig');
const ApiRoutes = require('./routes/index');
const db = require('./models/index');
const { startRedis } = require('./config/redis');

// Securely load environment variables
require('dotenv').config();

const startUpServer = () => {
  const app = express();

  // CORS Configuration
  app.use(
    cors({
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
    })
  );

  // Express Session Configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Start Redis Connection
  startRedis();

  // API Routes
  app.use('/api', ApiRoutes);

  // Start the server
  app.listen(PORT, async () => {
    console.log(`🚀 Server started on port ${PORT}`.bgCyan);

    if (process.env.SYNC_DB === 'true') {
      try {
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.'.green);
      } catch (error) {
        console.error('❌ Failed to sync database:', error);
      }
    }
  });
};

startUpServer();