const axios = require('axios');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const BookedFlightRepository = require('../repository/bookedFlight-repository');

class BookedFlightService {
    constructor() {
        this.bookedFlightRepository = new BookedFlightRepository();
    }

    // Create or update a booked flight
    async createBookedFlight(data, transaction) {
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;

            // Validate seat availability
            if (data.noOfSeats > flightData.totalSeats) {
                throw new Error('Insufficient seats in the flight');
            }

            // Check if booked flight already exists
            let bookedFlight = await this.bookedFlightRepository.findByFlightId(flightId, data.bookingDate);

            if (bookedFlight) {
                // Validate remaining seats
                const noOfSeats = data.noOfSeats;
                if (flightData.totalSeats - bookedFlight.noOfSeats < noOfSeats) {
                    throw new Error('Insufficient seats in the flight');
                }

                // Update existing booked flight using repository
                const updatedSeats = bookedFlight.noOfSeats + noOfSeats;
                bookedFlight = await this.bookedFlightRepository.update(bookedFlight.id, { noOfSeats: updatedSeats }, transaction);

            } else {
                // Create new booked flight
                bookedFlight = await this.bookedFlightRepository.create(data, transaction);
            }

            return bookedFlight;

        } catch (error) {
            console.log('Error in BookedFlightService:', error.message || error);
            if (error.name === 'RepositoryError' || error.name === 'ValidationError') {
                throw error;
            }
            throw new Error(error.message);
        }
    }

    // Find booked flight by flightId and date
    async findByFlightId(flightId, bookingDate) {
        try {
            const bookedFlight = await this.bookedFlightRepository.findByFlightId(flightId, bookingDate);
            return bookedFlight;
        } catch (error) {
            console.log('Error in findByFlightId service:', error.message || error);
            throw error;
        }
    }
}

module.exports = BookedFlightService;