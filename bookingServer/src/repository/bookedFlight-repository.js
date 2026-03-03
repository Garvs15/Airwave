const { BookedFlights } = require('../models/index');
const { redis } = require('../config/redis');
const { Sequelize } = require('sequelize');

class BookedFlightRepository {
    // Create a new booked flight
    async create(data, transaction) {
        try {
            const bookedFlight = await BookedFlights.create({ ...data }, { transaction });
            // Clear cache
            const cacheKey = `bookedFlights:flightId:${data.flightId}:date:${data.bookingDate}`;
            await redis.del(cacheKey);
            return bookedFlight;
        } catch (error) {
            console.log('Failed in repository layer (create)', error);
            throw error;
        }
    }

    // Find booked flight by flightId and bookingDate
    async findByFlightId(flightId, bookingDate) {
        try {
            const cacheKey = `bookedFlights:flightId:${flightId}:date:${bookingDate}`;
            const cached = await redis.get(cacheKey);

            if (cached) {
                // Convert plain object from Redis into Sequelize instance
                const obj = JSON.parse(cached);
                return BookedFlights.build(obj, { isNewRecord: false });
            }

            const bookedFlight = await BookedFlights.findOne({ where: { flightId, bookingDate } });
            if (bookedFlight) {
                await redis.set(cacheKey, JSON.stringify(bookedFlight), 'EX', 3600);
            }
            return bookedFlight;
        } catch (error) {
            console.log('Failed in repository layer (findByFlightId)', error);
            throw error;
        }
    }

    // Update existing booked flight
    async update(id, data, transaction) {
        try {
            // Ensure id is primitive
            const bookedFlight = await BookedFlights.findByPk(id, { transaction });
            if (!bookedFlight) throw new Error('BookedFlight not found');

            if (data.noOfSeats !== undefined) {
                bookedFlight.noOfSeats = data.noOfSeats;
            }

            await bookedFlight.save({ transaction });

            // Clear cache
            const cacheKey = `bookedFlights:flightId:${bookedFlight.flightId}:date:${bookedFlight.bookingDate}`;
            await redis.del(cacheKey);

            return bookedFlight;
        } catch (error) {
            console.log('Failed in repository layer (update)', error);
            throw error;
        }
    }
}

module.exports = BookedFlightRepository;