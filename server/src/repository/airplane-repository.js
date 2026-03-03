const { Airplane } = require('../models/index');
const { redis } = require('../config/redis');

class AirplaneRepository {
    // Method to fetch an airplane by its ID
    async getAirplane(id) {
        try {
            const cachedAirplane = await redis.get(`airplane:${id}`);
            
            if (cachedAirplane) {
                console.log('Serving airplane from cache');
                return JSON.parse(cachedAirplane);
            }

            const airplane = await Airplane.findByPk(id);
            
            if (airplane) {
                await redis.set(`airplane:${id}`, JSON.stringify(airplane), 'EX', 3600);
            }

            return airplane;
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw { error };
        }
    }
}

module.exports = AirplaneRepository;
