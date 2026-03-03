const { AirportRepository } = require('../repository/index');

const airportRepository = new AirportRepository();

class AirportService {
    // Method to create a new airport
    async create(data) {
        try {
            const existingAirport = await this.getAirportByName(data.name);
            if (existingAirport) {
                throw new Error('Airport with this name already exists.');
            }

            const response = await airportRepository.create(data);
            return response;
        } catch (error) {
            console.error('Error in create airport service:', error);
            throw new Error(error.message || 'Failed to create airport');
        }
    }

    // Method to fetch an airport by its name
    async getAirportByName(name) {
        try {
            return await Airport.findOne({ where: { name } });
        } catch (error) {
            console.error('Error fetching airport by name:', error);
            throw new Error('Failed to fetch airport by name');
        }
    }

    // Method to get an airport by city
    async get(city) {
        try {
            const response = await airportRepository.get(city);
            return response;
        } catch (error) {
            console.error('Error in get airport service:', error);
            throw new Error('Failed to fetch airport from the service layer');
        }
    }

    // Method to get all airports
    async getAll(longitude, latitude) {
        try {
            const response = await airportRepository.getAll(longitude, latitude);
            return response;
        } catch (error) {
            console.error('Error in get all airports service:', error);
            throw new Error('Failed to fetch all airports');
        }
    }
}

module.exports = AirportService;