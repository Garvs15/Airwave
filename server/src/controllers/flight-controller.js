const { FlightService } = require('../services/index');

const flightService = new FlightService();

// Controller to create a new flight
const create = async (req, res) => {
    const { flightNumber, airplaneId, departureAirportId, arrivalAirportId, arrivalTime, departureTime, price } = req.body;

    if (!flightNumber || !airplaneId || !departureAirportId || !arrivalAirportId || !arrivalTime || !departureTime || !price) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.',
            data: null,
            error: null
        });
    }

    try {
        const flightRequestData = { flightNumber, airplaneId, departureAirportId, arrivalAirportId, arrivalTime, departureTime, price };
        const flight = await flightService.createFlight(flightRequestData);
        return res.status(201).json({
            success: true,
            message: 'Successfully created a flight',
            data: flight,
            error: null
        });
    } catch (error) {
        console.error('Error creating flight:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Unable to create flight',
            data: null,
            error: error
        });
    }
};

// Controller to fetch all flights
const getAll = async (req, res) => {
    try {
        const response = await flightService.getAllFlightData(req.query);
        return res.status(200).json({
            success: true,
            message: 'Successfully fetched the flights',
            data: response,
            error: null
        });
    } catch (error) {
        console.error('Error fetching flights:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: 'Unable to fetch flights',
            data: null,
            error: error
        });
    }
};

// Controller to fetch a flight by ID
const get = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Flight ID is required.',
            data: null,
            error: null
        });
    }

    try {
        const response = await flightService.getFlight(id);
        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Flight not found.',
                data: null,
                error: null
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully fetched the flight',
            data: response,
            error: null
        });
    } catch (error) {
        console.error('Error fetching flight:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: 'Unable to fetch flight',
            data: null,
            error: error
        });
    }
};

// Controller to update flight details by ID
const update = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Flight ID is required.',
            data: null,
            error: null
        });
    }

    try {
        const response = await flightService.updateFlight(id, req.body);
        if (!response) {
            return res.status(404).json({
                success: false,
                message: 'Flight not found.',
                data: null,
                error: null
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully updated the flight',
            data: response,
            error: null
        });
    } catch (error) {
        console.error('Error updating flight:', error);
        return res.status(error.status || 500).json({
            success: false,
            message: 'Unable to update flight',
            data: null,
            error: error
        });
    }
};

module.exports = {
    create,
    getAll,
    get,
    update
};