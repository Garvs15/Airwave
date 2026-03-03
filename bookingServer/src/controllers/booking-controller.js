const { StatusCodes } = require('http-status-codes');
const BookingService = require('../services/booking-service');
const BookedFlightController = require('./bookedFlight-controller');
const { scheduleBookingStatusUpdate } = require('../services/scheduler');
const transporter = require('../config/transporter');
const { sequelize } = require('../models/index');

const bookingService = new BookingService();
const bookedFlightController = new BookedFlightController();

class BookingController {
    constructor() {}

    async create(req, res) {
        const transaction = await sequelize.transaction(); // Initialize the transaction
        try {
            const { bookingData, email, passengersData } = req.body;
    
            if (!bookingData || !email || !passengersData) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Missing required fields',
                    success: false,
                    err: {},
                    data: {}
                });
            }
    
            const { flightId, bookedSeats, bookingDate, returnFlightId, returnBookingDate } = bookingData;
    
            if (!flightId || bookedSeats <= 0 || !bookingDate) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid booking data',
                    success: false,
                    err: {},
                    data: {}
                });
            }
    
            const bookingDetails = {
                flightId,
                noOfSeats: bookedSeats,
                bookingDate
            };
    
            const returnBookingDetails = returnFlightId
                ? {
                    flightId: returnFlightId,
                    noOfSeats: bookedSeats,
                    bookingDate: returnBookingDate
                }
                : null;
    
            const bookedFlight = await bookedFlightController.create(bookingDetails, transaction); // Pass transaction
            let returnBookedFlight;
            if (returnBookingDetails) {
                returnBookedFlight = await bookedFlightController.create(returnBookingDetails, transaction); // Pass transaction
            }
    
            const finalBookingData = {
                ...bookingData,
                bookedFlightId: bookedFlight.id,
                ...(returnBookingDetails && { returnBookedFlightId: returnBookedFlight.id })
            };
    
            const response = await bookingService.createBooking(finalBookingData, passengersData, transaction); // Pass transaction
            scheduleBookingStatusUpdate(response.booking.id, response.booking.createdAt);
    
            await transporter.sendMail({
                to: email,
                subject: 'Booking Successful',
                text: 'Your booking is successful. Please complete the payment process within 30 minutes to avoid rejection.'
            });
    
            await transaction.commit(); // Commit transaction
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed booking',
                success: true,
                err: {},
                data: response
            });
        } catch (error) {
            await transaction.rollback(); // Rollback on error
            console.error('Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to complete booking',
                success: false,
                err: error.message,
                data: {}
            });
        }
    }    

    async getBookings(req, res) {
        try {
            const { userId, page } = req.body;

            if (!userId || page <= 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid user ID or page number',
                    success: false,
                    err: {},
                    data: {}
                });
            }

            const bookings = await bookingService.getBookings(userId, page);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully fetched bookings',
                success: true,
                err: {},
                data: bookings
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to fetch bookings',
                success: false,
                err: error.message,
                data: {}
            });
        }
    }

    async getBookingById(req, res) {
        try {
            const { bookingId } = req.body;

            if (!bookingId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Missing booking ID',
                    success: false,
                    err: {},
                    data: {}
                });
            }

            const booking = await bookingService.getBookingById(bookingId);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully fetched booking',
                success: true,
                err: {},
                data: booking
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to fetch booking',
                success: false,
                err: error.message,
                data: {}
            });
        }
    }

    async createPaymentIntent(req, res) {
        try {
            const { amount } = req.body;

            if (!amount || amount <= 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid amount',
                    success: false,
                    err: {},
                    data: {}
                });
            }

            const response = await bookingService.createPaymentIntent(amount);
            return res.status(StatusCodes.OK).json({
                clientSecret: response.clientSecret
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to create payment intent',
                success: false,
                err: error.message,
                data: {}
            });
        }
    }
}

module.exports = BookingController;
