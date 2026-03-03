'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const existingFlights = await queryInterface.sequelize.query(
      `SELECT flightNumber FROM Flights WHERE flightNumber IN ('AI101', 'AI102', 'AI201', 'AI202', 'AI301')`
    );
    
    const existingFlightNumbers = existingFlights[0].map(flight => flight.flightNumber);

    const flightsToInsert = [
      {
        id: 1,
        flightNumber: 'AI101',
        airplaneId: 1,
        departureAirportId: 1,
        arrivalAirportId: 2,
        departureTime: '10:00',
        arrivalTime: '12:00',
        price: 2000,
        flightTime: '2h',
        nextDay: 0,
        operatingDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
        isInternational: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        flightNumber: 'AI102',
        airplaneId: 2,
        departureAirportId: 1,
        arrivalAirportId: 3,
        departureTime: '14:00',
        arrivalTime: '16:00',
        price: 2500,
        flightTime: '2h',
        nextDay: 0,
        operatingDays: JSON.stringify(['Saturday', 'Sunday']),
        isInternational: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        flightNumber: 'AI201',
        airplaneId: 3,
        departureAirportId: 2,
        arrivalAirportId: 4,
        departureTime: '08:00',
        arrivalTime: '11:00',
        price: 3500,
        flightTime: '3h',
        nextDay: 0,
        operatingDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
        isInternational: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        flightNumber: 'AI202',
        airplaneId: 4,
        departureAirportId: 3,
        arrivalAirportId: 5,
        departureTime: '18:00',
        arrivalTime: '21:00',
        price: 4000,
        flightTime: '3h',
        nextDay: 1,
        operatingDays: JSON.stringify(['Tuesday', 'Thursday']),
        isInternational: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        flightNumber: 'AI301',
        airplaneId: 5,
        departureAirportId: 4,
        arrivalAirportId: 1,
        departureTime: '20:00',
        arrivalTime: '23:00',
        price: 3000,
        flightTime: '3h',
        nextDay: 1,
        operatingDays: JSON.stringify(['Friday', 'Saturday']),
        isInternational: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Filter flights to insert only if they don't already exist
    const filteredFlights = flightsToInsert.filter(flight => !existingFlightNumbers.includes(flight.flightNumber));

    if (filteredFlights.length > 0) {
      await queryInterface.bulkInsert('Flights', filteredFlights);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Flights', null, {});
  }
};
