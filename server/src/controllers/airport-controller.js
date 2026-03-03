const { AirportService } = require('../services/index');

const airportService = new AirportService();

// Controller to create a new airport
const create = async (req, res) => {
    const { name, city, longitude, latitude } = req.body;

    // Input validation: Ensure that name and city are provided
    if (!name || !city || !longitude || !latitude) {
        return res.status(400).json({
            success: false,
            message: 'Name and city are required.',
            data: null,
            error: 'Validation Error'
        });
    }

    try {
        const response = await airportService.create(req.body);
        return res.status(201).json({
            message: 'Successfully created the airport',
            data: response,
            success: true,
            error: null
        });
    } catch (error) {
        console.error('Error in create airport controller:', error);
        return res.status(500).json({
            data: null,
            success: false,
            error: error.message || 'Cannot create a new airport',
            message: 'Internal Server Error'
        });
    }
};

// Controller to fetch an airport by city
const get = async (req, res) => {
    const { city } = req.query;

    // Input validation: Ensure that the city query parameter is provided
    if (!city) {
        return res.status(400).json({
            success: false,
            message: 'City query parameter is required.',
            data: null,
            error: 'Validation Error'
        });
    }

    try {
        const response = await airportService.get(city);
        
        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Airport not found for the specified city.',
                data: null
            });
        }

        return res.status(200).json({
            message: 'Successfully fetched the airport',
            data: response,
            success: true
        });
    } catch (error) {
        console.error('Error fetching airport:', error);
        return res.status(500).json({
            success: false,
            message: 'Cannot find the airport. Please try again later.',
            data: null,
            error: error.message || 'Internal Server Error'
        });
    }
};

// Controller to fetch all airports
const getAll = async (req, res) => {
    try {
        const response = await airportService.getAll();
        return res.status(200).json({
            message: 'Successfully fetched all airports',
            data: response,
            success: true
        });
    } catch (error) {
        console.error('Error fetching all airports:', error);
        return res.status(500).json({
            data: null,
            success: false,
            error: error.message || 'Cannot find airports',
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    create,
    get,
    getAll
};