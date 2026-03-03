'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookedFlights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      noOfSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bookingDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Adding indexes
    await queryInterface.addIndex('BookedFlights', ['flightId'], {
      unique: false,
      name: 'idx_flightId'
    });

    await queryInterface.addIndex('BookedFlights', ['bookingDate'], {
      unique: false,
      name: 'idx_bookingDate'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BookedFlights');
  }
};