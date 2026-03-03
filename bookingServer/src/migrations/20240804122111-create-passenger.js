'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Passengers', {
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
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dob: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passportNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passportCountry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passportExpiry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addIndex('Passengers', ['bookingId'], {
      unique: false,
      name: 'idx_bookingId'
    });
    await queryInterface.addIndex('Passengers', ['email'], {
      unique: false,
      name: 'idx_email'
    });
    await queryInterface.addIndex('Passengers', ['passportNo'], {
      unique: false,
      name: 'idx_passportNo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Passengers');
  }
};