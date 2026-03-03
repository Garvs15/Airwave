const axios = require('axios');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const BookingRepository = require('../repository/booking-repository');

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(bookingData, passengersData, transaction) { // Accept transaction
        try {
            const { flightId, returnFlightId, bookedSeats } = bookingData;
    
            // Validate required data
            if (!flightId || !bookedSeats || bookedSeats <= 0) {
                throw new Error('Invalid booking data: Flight ID and booked seats are required.');
            }
    
            const flightResponse = await axios.get(`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`);
            const flightData = flightResponse.data.data;
    
            if (!flightData || flightData.price == null) {
                throw new Error('Flight not found or price is not available.');
            }
    
            let totalCost = flightData.price * bookedSeats;
    
            // If return flight ID is provided, fetch return flight data
            if (returnFlightId) {
                const returnFlightResponse = await axios.get(`${FLIGHT_SERVICE_PATH}/api/v1/flights/${returnFlightId}`);
                const returnFlightData = returnFlightResponse.data.data;
    
                if (!returnFlightData || returnFlightData.price == null) {
                    throw new Error('Return flight not found or price is not available.');
                }
    
                totalCost += returnFlightData.price * bookedSeats;
            }
    
            // Apply a service charge
            totalCost += totalCost * 0.10;
    
            const bookingPayload = { ...bookingData, totalCost };
            const booking = await this.bookingRepository.create(bookingPayload, passengersData, transaction); // Pass transaction
            return booking;
        } catch (error) {
            console.error('Failed in service layer', error);
            if (error.response) {
                // Axios error handling
                throw new Error(`External service error: ${error.response.data.message || error.message}`);
            }
            throw new Error(error.message || 'Failed to create booking');
        }
    }    

    async updateBooking(bookingId, status, transaction) {
        try {
            if (!bookingId || !status) {
                throw new Error('Invalid booking ID or status.');
            }
    
            const updatedBooking = await this.bookingRepository.update(bookingId, status, transaction);
            return updatedBooking;
        } catch (error) {
            console.error('Failed in service layer', error);
            throw new Error(error.message || 'Failed to update booking');
        }
    }    

    async getBookings(userId, page) {
        try {
            if (!userId || page <= 0) {
                throw new Error('Invalid user ID or page number.');
            }

            const bookings = await this.bookingRepository.getBookings(userId, page);
            return bookings;
        } catch (error) {
            console.error('Failed in service layer', error);
            throw new Error(error.message || 'Failed to fetch bookings');
        }
    }

    async getBookingById(bookingId) {
        try {
            if (!bookingId) {
                throw new Error('Missing booking ID.');
            }

            const booking = await this.bookingRepository.getBookingById(bookingId);
            return booking;
        } catch (error) {
            console.error('Failed in service layer', error);
            throw new Error(error.message || 'Failed to fetch booking');
        }
    }

    async createPaymentIntent(amount) {
        try {
            if (!amount || amount <= 0) {
                throw new Error('Invalid payment amount.');
            }

            const paymentIntent = await this.bookingRepository.createPaymentIntent(amount);
            return paymentIntent;
        } catch (error) {
            console.error('Failed in service layer', error);
            throw new Error(error.message || 'Failed to create payment intent');
        }
    }
}

module.exports = BookingService;