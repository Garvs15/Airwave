const { FlightRepository, AirplaneRepository } = require('../repository/index');

class FlightService {
    constructor() {
        this.airplaneRepository = new AirplaneRepository();
        this.flightRepository = new FlightRepository();
    }

    // Method to create a flight
    async createFlight(data) {
        try {
            const airplane = await this.airplaneRepository.getAirplane(data.airplaneId);
            if (!airplane) {
                throw new Error('Airplane not found.');
            }

            const flight = await this.flightRepository.createFlight({ ...data, totalSeats: airplane.capacity });
            return flight;
        } catch (error) {
            console.error('Error in createFlight service:', error);
            throw { status: 400, message: error.message || 'Failed to create flight' };
        }
    }

    // Method to get all flight data with optional pagination
    async getAllFlightData({ page, ...data }) {
        try {
            // Compute current weekday and departureTime filter if needed
        const now = new Date();
        const weekday = now.toLocaleString('en-US', { weekday: 'long' }); // e.g., Monday
        const departureTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Debug logs to understand why flights may be excluded
        console.log('--- Flight Search Debug ---');
        console.log('Departure Airport ID:', data.departureAirportId);
        console.log('Arrival Airport ID:', data.arrivalAirportId);
        console.log('Search Date:', data.date || now.toISOString());
        console.log('Weekday:', weekday);
        console.log('Price Range:', data.minPrice, '-', data.maxPrice);
        console.log('Departure Time Filter (>=):', departureTime); // This was the filter limiting results
        
            const flights = await this.flightRepository.getAllFlights(data, page);
            return flights;
        } catch (error) {
            console.error('Error in getAllFlightData service:', error);
            throw { status: 500, message: 'Failed to fetch flights' };
        }
    }

    // Method to get a specific flight by its ID
    async getFlight(flightId) {
        try {
            console.log('--- Flight Fetch Debug ---');
            console.log('Fetching flight with ID:', flightId);

            const flight = await this.flightRepository.getFlight(flightId);
            if (!flight) {
                console.log('Flight not found in database.');
                throw { status: 404, message: 'Flight not found' };
            }

            console.log('Flight found:');
            console.log('Flight Number:', flight.flightNumber);
            console.log('Airplane ID:', flight.airplaneId);
            console.log('Departure Airport ID:', flight.departureAirportId);
            console.log('Arrival Airport ID:', flight.arrivalAirportId);
            console.log('Departure Time:', flight.departureTime);
            console.log('Arrival Time:', flight.arrivalTime);
            console.log('Price:', flight.price);
            console.log('Operating Days:', flight.operatingDays); // JSON array of days
            console.log('Is International:', flight.isInternational);

            return flight;
        } catch (error) {
            console.error('Error in getFlight service:', error);
            throw { status: 404, message: 'Flight not found' };
        }
    }

    // Method to update a flight's details
    async updateFlight(flightId, data) {
        try {
            const response = await this.flightRepository.updateFlights(flightId, data);
            return response;
        } catch (error) {
            console.error('Error in updateFlight service:', error);
            throw { status: 400, message: 'Failed to update flight' };
        }
    }
}

module.exports = FlightService;