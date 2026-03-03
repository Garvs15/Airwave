'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		*/
		await queryInterface.bulkInsert('Airplanes', [
			{
				id: 1,
				modelNumber: 'Boeing 737',
				capacity: 300,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 2,
				modelNumber: 'Airbus A320',
				capacity: 350,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 3,
				modelNumber: 'Boeing 777',
				capacity: 400,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 4,
				modelNumber: 'Boeing 747',
				capacity: 320,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 5,
				modelNumber: 'Airbus A330',
				capacity: 150,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		], {});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
