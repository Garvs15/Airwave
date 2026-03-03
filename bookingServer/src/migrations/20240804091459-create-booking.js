'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
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
      bookedFlightId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bookingDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      returnBookedFlightId: {
        type: Sequelize.INTEGER
      },
      returnFlightId: {
        type: Sequelize.INTEGER
      },
      returnBookingDate: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: 'InProcess',
        values: ['InProcess', 'Booked', 'Cancelled', 'Rejected'],
      },
      bookedSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.addIndex('Bookings', ['userId'], {
      unique: false,
      name: 'idx_userId'
    });
    await queryInterface.addIndex('Bookings', ['flightId'], {
      unique: false,
      name: 'idx_flightId'
    });
    await queryInterface.addIndex('Bookings', ['bookedFlightId'], {
      unique: false,
      name: 'idx_bookedFlightId'
    });
    await queryInterface.addIndex('Bookings', ['status'], {
      unique: false,
      name: 'idx_status'
    });
    await queryInterface.addIndex('Bookings', ['bookingDate'], {
      unique: false,
      name: 'idx_bookingDate'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};