'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Airports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: -180,
          max: 180
        }
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: -90,
          max: 90
        }
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

    await queryInterface.addIndex('Airports', {
      name: 'idx_airport_name',
      fields: ['name']
    });

    await queryInterface.addIndex('Airports', {
      name: 'idx_airport_city',
      fields: ['city']
    });

    await queryInterface.addIndex('Airports', {
      name: 'idx_airport_location',
      fields: ['longitude', 'latitude']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Airports', 'idx_airport_location');
    await queryInterface.removeIndex('Airports', 'idx_airport_city');
    await queryInterface.removeIndex('Airports', 'idx_airport_name');
    await queryInterface.dropTable('Airports');
  }
};