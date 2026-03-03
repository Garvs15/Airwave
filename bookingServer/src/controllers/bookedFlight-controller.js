const { StatusCodes } = require('http-status-codes');
const BookedFlightService = require('../services/bookedFlight-service');

const bookedFlightService = new BookedFlightService();

class BookedFlightController {
    constructor() {}

    async create(data, transaction) {
        try {
            // Validate input data
            if (!data.flightId || !data.bookingDate || !data.noOfSeats) {
                throw new Error('flightId, bookingDate, and noOfSeats are required.');
            }
            if (typeof data.noOfSeats !== 'number' || data.noOfSeats <= 0) {
                throw new Error('noOfSeats must be a positive number.');
            }
    
            const response = await bookedFlightService.createBookedFlight(data, transaction); // Pass transaction
            return response;
        } catch (error) {
            console.log(error, 'In BookedFlight Controller');
            return {
                status: StatusCodes.BAD_REQUEST,
                message: error.message || 'Failed to create booked flight.',
            };
        }
    }    

    async findByFlightId(req, res) {
        try {
            const { flightId, bookingDate } = req.body;

            // Validate input data
            if (!flightId || !bookingDate) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'flightId and bookingDate are required.',
                    success: false,
                    err: {},
                    data: {},
                });
            }

            const bookedFlight = await bookedFlightService.findByFlightId(flightId, bookingDate);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully fetched booked flight',
                success: true,
                err: {},
                data: bookedFlight,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to fetch booked flight.',
                success: false,
                err: error.message,
                data: {},
            });
        }
    }
}

module.exports = BookedFlightController;
