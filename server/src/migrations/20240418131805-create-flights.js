'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      airplaneId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Airplanes',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      departureAirportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Airports',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      arrivalAirportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Airports',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      departureTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      arrivalTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      flightTime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nextDay: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      operatingDays: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      isInternational: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Adding indexes
    await queryInterface.addIndex('Flights', {
      name: 'idx_flight_number',
      unique: true,
      fields: ['flightNumber']
    });

    await queryInterface.addIndex('Flights', {
      name: 'idx_airplane_id',
      fields: ['airplaneId']
    });

    await queryInterface.addIndex('Flights', {
      name: 'idx_departure_airport_id',
      fields: ['departureAirportId']
    });

    await queryInterface.addIndex('Flights', {
      name: 'idx_arrival_airport_id',
      fields: ['arrivalAirportId']
    });

    await queryInterface.addIndex('Flights', {
      name: 'idx_price',
      fields: ['price']
    });

    await queryInterface.addIndex('Flights', {
      name: 'idx_departure_time',
      fields: ['departureTime']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Flights');
  }
};