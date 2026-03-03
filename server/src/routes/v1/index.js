const express = require('express');
const AirportController = require('../../controllers/airport-controller');
const FlightController = require('../../controllers/flight-controller');

const router = express.Router(); // Create a new router instance

// Airport routes
router.post('/airport', AirportController.create); // Route to create a new airport
router.get('/airport', AirportController.get); // Route to get a specific airport (consider adding an ID parameter)
router.get('/getAllAirport', AirportController.getAll); // Route to get all airports

// Flight routes
router.post('/flights', FlightController.create); // Route to create a new flight
router.get('/flights', FlightController.getAll); // Route to get all flights
router.get('/flights/:id', FlightController.get); // Route to get a specific flight by ID
router.patch('/flights/:id', FlightController.update); // Route to update a specific flight by ID

module.exports = router;