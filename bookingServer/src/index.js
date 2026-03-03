require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const cors = require('cors');
const app = express();

const { PORT } = require('./config/serverConfig');
const db = require('./models/index');
const apiRoutes = require('./routes/index');
const { startRedis } = require('./config/redis');

// Function to set up and start the server
const setupAndStartServer = () => {
  // Configure CORS for cross-origin requests
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Parse incoming request bodies in JSON format
  app.use(bodyParser.json());
  // Parse URL-encoded bodies (as sent by HTML forms)
  app.use(bodyParser.urlencoded({ extended: true }));

  // Initialize and start Redis
  startRedis();

  // Use API routes
  app.use('/api', apiRoutes);

  // Start the server and listen on the specified port
  app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`.bgMagenta);

    // Sync the database if the DB_SYNC environment variable is set to true
    if (process.env.DB_SYNC === 'true') {
      try {
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.'.green);
      } catch (error) {
        console.error('❌ Failed to sync database:', error);
      }
    }
  });
};

// Call the function to set up and start the server
setupAndStartServer();