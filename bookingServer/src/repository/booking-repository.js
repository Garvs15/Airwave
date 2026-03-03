const { Booking, Passenger, Payments } = require('../models/index');
const { STRIPE_KEY, FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const axios = require('axios');
const stripe = require('stripe')(STRIPE_KEY);
const { redis } = require('../config/redis');
const { sequelize } = require('../models/index');
const { deletePaginatedBookingCache } = require('../utils/deleteRedisCache');

class BookingRepository {
    async create(bookingPayload, passengersData, transaction) { // Accept transaction
        try {
            const booking = await Booking.create(bookingPayload, { transaction }); // Pass transaction
    
            // Validate passengersData
            if (!Array.isArray(passengersData) || passengersData.length === 0) {
                throw new Error('Passengers data must be a non-empty array.');
            }
    
            const updatedPassengersData = passengersData.map(passenger => ({
                ...passenger,
                bookingId: booking.id
            }));
    
            const passengers = await Passenger.bulkCreate(updatedPassengersData, { transaction }); // Pass transaction
            await deletePaginatedBookingCache(bookingPayload.userId);
    
            return { booking, passengers };
        } catch (error) {
            console.error('Failed in repository layer', error);
            throw new Error(error.message || 'Failed to create booking');
        }
    }    

    async update(bookingId, status, transaction) {
        try {
            const booking = await Booking.findByPk(bookingId, { transaction });
            if (!booking) {
                throw new Error('Booking not found.');
            }
    
            booking.status = status;
            await booking.save({ transaction });
    
            await redis.del(`booking:${bookingId}`);
            await redis.del(`bookings:user:${booking.userId}`);
    
            return booking;
        } catch (error) {
            console.error('Failed in repository layer', error);
            throw new Error(error.message || 'Failed to update booking');
        }
    }    

    async getBookings(userId, page) {
        try {
            if (!userId || page <= 0) {
                throw new Error('Invalid user ID or page number.');
            }

            const cacheKey = `bookings:user:${userId}:page:${page}`;
            const cachedBookings = await redis.get(cacheKey);

            if (cachedBookings) {
                return JSON.parse(cachedBookings);
            }

            const pageSize = 3;
            const offset = (page - 1) * pageSize;

            const { count, rows: bookings } = await Booking.findAndCountAll({
                where: { userId },
                order: [
                    [sequelize.literal("STR_TO_DATE(bookingDate, '%d %M %Y')"), 'DESC']
                ],
                offset,
                limit: pageSize,
            });            
            

            const bookingDetails = await Promise.all(bookings.map(booking => this.enrichBookingWithFlightDetails(booking)));

            const totalPages = Math.ceil(count / pageSize);
            const result = {
                bookingDetails,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBookings: count,
                },
            };

            await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
            return result;
        } catch (error) {
            console.error('Failed in repository layer', error);
            throw new Error(error.message || 'Failed to fetch bookings');
        }
    }

    async getBookingById(bookingId) {
        try {
            if (!bookingId) {
                throw new Error('Missing booking ID.');
            }

            const cacheKey = `booking:${bookingId}`;
            const cachedBooking = await redis.get(cacheKey);

            if (cachedBooking) {
                return JSON.parse(cachedBooking);
            }

            const booking = await Booking.findOne({
                where: { id: bookingId },
                include: [
                    { model: Passenger, as: 'passengers' },
                    { model: Payments, as: 'payments' },
                ],
            });

            if (!booking) {
                throw new Error('Booking not found.');
            }

            const result = await this.enrichBookingWithFlightDetails(booking);
            await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);

            return result;
        } catch (error) {
            console.error('Failed in repository layer', error);
            throw new Error(error.message || 'Failed to fetch booking');
        }
    }

    async createPaymentIntent(amount) {
        try {
            if (!amount || amount <= 0) {
                throw new Error('Invalid payment amount.');
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'INR',
                payment_method_types: ['card'],
            });
            return { clientSecret: paymentIntent.client_secret };
        } catch (error) {
            console.error('Failed in repository layer', error);
            throw new Error(error.message || 'Failed to create payment intent');
        }
    }

    async enrichBookingWithFlightDetails(booking) {
        const flightDetails = await this.getFlightDetails(booking.flightId);
        const returnFlightDetails = booking.returnFlightId
            ? await this.getFlightDetails(booking.returnFlightId)
            : null;

        return {
            ...booking.toJSON(),
            flightDetails,
            returnFlightDetails,
        };
    }

    async getFlightDetails(flightId) {
        try {
            const cacheKey = `flight:${flightId}`;
            const cachedFlight = await redis.get(cacheKey);

            if (cachedFlight) {
                return JSON.parse(cachedFlight);
            }

            const flightResponse = await axios.get(`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`);
            const flightDetails = flightResponse.data.data;

            await redis.set(cacheKey, JSON.stringify(flightDetails), 'EX', 3600);
            return flightDetails;
        } catch (error) {
            console.error('Failed to fetch flight details', error);
            throw new Error(error.message || 'Failed to fetch flight details');
        }
    }
}

module.exports = BookingRepository;
