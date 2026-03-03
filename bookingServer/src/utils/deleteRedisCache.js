const { redis } = require("../config/redis");

const deletePaginatedBookingCache = async (user_id) => {
  try {
    // Define the pattern to match keys in Redis cache
    const pattern = `bookings:user:${user_id}:page:*`;
    let cursor = '0'; // Initialize cursor for scanning keys
    let keys = []; // Array to hold keys retrieved from Redis

    do {
      // Scan Redis for keys matching the pattern with a count of 100 keys per iteration
      const result = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = result[0]; // Update cursor for the next scan
      keys = result[1]; // Get the list of keys from the current scan

      // If keys are found, delete them from the cache
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`Deleted keys: ${keys.join(', ')}`);
      }
      
    } while (cursor !== '0'); // Continue until all keys have been scanned

    console.log(`Deleted cache for user: ${user_id}`);
  } catch (error) {
    console.error('Error deleting paginated booking cache:', error);
  }
};

module.exports = {
  deletePaginatedBookingCache
};