const Redis = require('ioredis');
const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = require('./serverConfig');

// Initialize Redis with host, port, and password
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASS
});

// Function to start the Redis connection and set up event listeners
const startRedis = () => {
  redis.on('connect', () => {
    console.log('Connected to Redis!');
  });
  
  redis.on('error', (err) => {
    console.error('Redis error:', err);
  });
}

module.exports = {
  redis,
  startRedis
}