'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'initiated',
      },
      payment_method: {
        type: Sequelize.STRING
      },
      payment_details: {
        type: Sequelize.JSON
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
    await queryInterface.addIndex('Payments', ['booking_id'], {
      unique: false,
      name: 'idx_booking_id'
    });
    await queryInterface.addIndex('Payments', ['user_id'], {
      unique: false,
      name: 'idx_user_id'
    });
    await queryInterface.addIndex('Payments', ['status'], {
      unique: false,
      name: 'idx_status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payments');
  }
};