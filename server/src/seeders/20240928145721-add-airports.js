'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Airports', [
      {
        id: 1,
        name: 'John F. Kennedy International Airport',
        city: 'New York, USA',
        latitude: 40.6413,
        longitude: -73.7781,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Los Angeles International Airport',
        city: 'Los Angeles, USA',
        latitude: 33.9416,
        longitude: -118.4085,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: "O'Hare International Airport",
        city: 'Chicago, USA',
        latitude: 41.9742,
        longitude: -87.9073,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Heathrow Airport',
        city: 'London, UK',
        latitude: 51.4700,
        longitude: -0.4543,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Tokyo Haneda Airport',
        city: 'Tokyo, Japan',
        latitude: 35.5494,
        longitude: 139.7798,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airports', null, {});
  }
};
