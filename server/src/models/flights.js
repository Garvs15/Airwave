'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Flights extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// Define associations here
			this.belongsTo(models.Airport, {
				as: 'departureAirport',
				foreignKey: 'departureAirportId',
				targetKey: 'id'
			});
			this.belongsTo(models.Airport, {
				as: 'arrivalAirport',
				foreignKey: 'arrivalAirportId',
				targetKey: 'id'
			});
			this.belongsTo(models.Airplane, {
				as: 'Airplane',
				foreignKey: 'airplaneId',
				targetKey: 'id'
			});
		}
	}

	Flights.init({
		flightNumber: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		airplaneId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		departureAirportId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		arrivalAirportId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		arrivalTime: {
			allowNull: false,
			type: DataTypes.STRING
		},
		departureTime: {
			allowNull: false,
			type: DataTypes.STRING
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		flightTime: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		nextDay: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		operatingDays: {
			type: DataTypes.JSON,
			allowNull: false,
			defaultValue: []
		},
		isInternational: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		sequelize,
		modelName: 'Flights',
		indexes: [
			{
				name: 'idx_flight_number',
				unique: true,
				fields: ['flightNumber']
			},
			{
				name: 'idx_airplane_id',
				fields: ['airplaneId']
			},
			{
				name: 'idx_departure_airport_id',
				fields: ['departureAirportId']
			},
			{
				name: 'idx_arrival_airport_id',
				fields: ['arrivalAirportId']
			},
			{
				name: 'idx_price',
				fields: ['price']
			},
			{
				name: 'idx_departure_time',
				fields: ['departureTime']
			},
		]
	});

	return Flights;
};
