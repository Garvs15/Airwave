const { Airport } = require('../models/index');
const { redis } = require('../config/redis');

class AirportRepository {
    // Method to create a new airport
    async create(data) {
        try {
            const airport = await Airport.create(data);
            await redis.del('airports:all');
            return airport;
        } catch (error) {
            console.error('Error in create airport repository:', error);
            throw new Error('Failed to create airport in the database');
        }
    }    

    // Method to fetch an airport by city
    async get(city) {
        try {
            const cachedAirport = await redis.get(`airport:city:${city}`);
            
            if (cachedAirport) {
                console.log('Serving airport from cache');
                return JSON.parse(cachedAirport);
            }
    
            const airport = await Airport.findOne({ where: { city } });

            if (!airport) {
                console.warn('Airport not found for city:', city);
                return null;
            }
    
            await redis.set(`airport:city:${city}`, JSON.stringify(airport), 'EX', 3600);
            return airport;
        } catch (error) {
            console.error('Error during fetching airport in repository layer:', error);
            throw new Error('Failed to fetch airport from the database');
        }
    }    

    // Method to fetch all airports
    async getAll() {
        try {
            const cachedAirports = await redis.get('airports:all');

            if (cachedAirports) {
                console.log('Serving all airports from cache');
                return JSON.parse(cachedAirports);
            }

            const airports = await Airport.findAll();

            if (airports) {
                await redis.set('airports:all', JSON.stringify(airports), 'EX', 3600);
            }

            return airports;
        } catch (error) {
            console.error('Error during fetching all airports in repository layer:', error);
            throw new Error('Failed to fetch all airports from the database');
        }
    }
}

module.exports = AirportRepository;
