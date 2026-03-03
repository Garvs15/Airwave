const { Flights, Airplane, Airport, sequelize } = require("../models/index");
const { Op } = require("sequelize");
const { redis } = require('../config/redis');

class FlightRepository {
    // Private method to create a filter object for flight searches
    #createFilter(data) {
        const filter = {};

        // Add arrival airport ID to filter if provided
        if (data.arrivalAirportId) {
            filter.arrivalAirportId = data.arrivalAirportId;
        }

        // Add departure airport ID to filter if provided
        if (data.departureAirportId) {
            filter.departureAirportId = data.departureAirportId;
        }

        const priceFilter = [];
        // Add minimum price filter if provided
        if (data.minPrice) {
            priceFilter.push({ price: { [Op.gte]: data.minPrice } }); // Greater than or equal to minPrice
        }
        // Add maximum price filter if provided
        if (data.maxPrice) {
            priceFilter.push({ price: { [Op.lte]: data.maxPrice } }); // Less than or equal to maxPrice
        }

        const timeFilter = [];
        // Add departure time filter if provided
        if (data.time) {
            const [hours, minutes] = data.time.split(":").map(Number);
            const nextHour = (hours + 1) % 24;
            const updatedTime = `${nextHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            timeFilter.push({ departureTime: { [Op.gte]: updatedTime } }); // Greater than or equal to updatedTime
        }

        const dateFilter = [];
        // Add date filter based on the operating days if provided
        if (data.date) {
            const date = new Date(data.date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            dateFilter.push({
                [Op.and]: [
                    sequelize.where(
                        sequelize.json('operatingDays'),
                        Op.like,
                        `%${dayOfWeek}%` // Check if the day is included in operatingDays
                    )
                ]
            });
        }

        // Combine filters into the main filter object
        if (priceFilter.length || timeFilter.length || dateFilter.length) {
            filter[Op.and] = [
                ...priceFilter.length ? [{ [Op.and]: priceFilter }] : [],
                ...timeFilter.length ? [{ [Op.and]: timeFilter }] : [],
                ...dateFilter
            ];
        }

        return filter;
    }

    // Method to create a new flight
    async createFlight(data) {
        try {
            const flight = await Flights.create(data);
            return flight;
        } catch (error) {
            console.error("Error in createFlight:", error);
            throw new Error(error.message || 'Something went wrong while creating flight.');
        }
    }

    // Method to fetch a flight by its ID
    async getFlight(flightId) {
        try {
            const cachedFlight = await redis.get(`flight:${flightId}`);

            if (cachedFlight) {
                console.log('Serving flight from cache');
                return JSON.parse(cachedFlight);
            }

            const flight = await Flights.findOne({
                where: { id: flightId },
                include: [
                    {
                        model: Airplane,
                        as: 'Airplane',
                        attributes: ['modelNumber', 'capacity']
                    },
                    {
                        model: Airport,
                        as: 'departureAirport',
                        attributes: ['name', 'city']
                    },
                    {
                        model: Airport,
                        as: 'arrivalAirport',
                        attributes: ['name', 'city']
                    }
                ],
                attributes: ['id', 'flightNumber', 'departureTime', 'arrivalTime', 'price', 'flightTime', 'nextDay', 'isInternational'] // Flight attributes to fetch
            });

            if (!flight) {
                throw new Error('Flight not found.');
            }

            await redis.set(`flight:${flightId}`, JSON.stringify(flight), 'EX', 3600);
            return flight;
        } catch (error) {
            console.error("Error in getFlight:", error);
            throw new Error(error.message || 'Something went wrong while fetching flight.');
        }
    }

    // Method to fetch all flights with optional filtering and pagination
    async getAllFlights(filter, page = 1) {
        try {
            const pageSize = 2;
            const offset = (page - 1) * pageSize;
            const filterObject = this.#createFilter(filter);

            const cacheKey = `flights:${JSON.stringify(filter)}:page:${page}`;
            const cachedFlights = await redis.get(cacheKey);

            if (cachedFlights) {
                console.log('Serving flights from cache');
                return JSON.parse(cachedFlights);
            }

            const { count, rows: flights } = await Flights.findAndCountAll({
                where: filterObject,
                include: [
                    {
                        model: Airplane,
                        as: 'Airplane',
                        attributes: ['modelNumber', 'capacity']
                    },
                    {
                        model: Airport,
                        as: 'departureAirport',
                        attributes: ['name', 'city']
                    },
                    {
                        model: Airport,
                        as: 'arrivalAirport',
                        attributes: ['name', 'city']
                    }
                ],
                order: [['departureTime', 'ASC']],
                attributes: ['id', 'flightNumber', 'departureTime', 'arrivalTime', 'price', 'flightTime', 'nextDay', 'isInternational'], // Flight attributes to fetch
                limit: pageSize,
                offset: offset
            });

            const totalPages = Math.ceil(count / pageSize);

            const result = {
                flights,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalFlights: count
                }
            };

            await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
            return result;
        } catch (error) {
            console.error("Error in getAllFlights:", error);
            throw new Error(error.message || 'Error fetching flights');
        }
    }

    // Method to update an existing flight
    async updateFlights(flightId, data) {
        try {
            await Flights.update(data, {
                where: { id: flightId },
            });
            await redis.del(`flight:${flightId}`);
            return true;
        } catch (error) {
            console.error("Error in updateFlights:", error);
            throw new Error(error.message || 'Something went wrong while updating flight.');
        }
    }
}

module.exports = FlightRepository;
