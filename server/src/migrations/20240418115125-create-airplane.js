'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Airplanes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      modelNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await queryInterface.addIndex('Airplanes', {
      name: 'idx_airplane_modelNumber',
      fields: ['modelNumber']
    });

    await queryInterface.addIndex('Airplanes', {
      name: 'idx_airplane_capacity',
      fields: ['capacity']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Airplanes');
  }
};