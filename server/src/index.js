require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { PORT, SERVER_LINK } = require('./config/serverConfig');
const ApiRoutes = require('./routes/index');
const cors = require('cors');
const colors = require('colors');
const cron = require('node-cron');
const axios = require('axios');

const db = require('./models/index');
const { startRedis } = require('./config/redis');

const startUpServer = () => {
	const app = express(); // Create an instance of the express application
	
	// Enable CORS for all origins with credentials
	app.use(
		cors({
			origin: true,
			credentials: true,
		})
	);

	// Parse JSON and URL-encoded data
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	startRedis(); // Initialize Redis

	// Use the imported API routes for the '/api' prefix
	app.use('/api', ApiRoutes);

	// Health check endpoint
	app.get('/ping', (req, res) => {
		console.log(`Ping received at ${new Date().toISOString()}`);
		res.json({ message: "Server is awake" });
	});

	// Cron job scheduled to run every 14 minutes from 8:00 AM to 11:59 PM
	cron.schedule('*/14 8-23 * * *', async () => {
		try {
			console.log('Running cron job on IST schedule');
			const response = await axios.get(`${SERVER_LINK}/ping`);
			console.log('API response:', response.data);
		} catch (error) {
			console.error('Error in cron job:', error);
		}
	}, {
		timezone: "Asia/Kolkata"
	});

	// Start the server and listen on the specified PORT
	app.listen(PORT, async () => {
		console.log(`Server started at ${PORT}`.bgCyan);
		if (process.env.SYNC_DB === 'true') {
      try {
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.'.green);
      } catch (error) {
        console.error('❌ Failed to sync database:', error);
      }
    }
	});
}

startUpServer();