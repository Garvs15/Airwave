'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Flights, {
        as: 'departureFlights',
        foreignKey: 'departureAirportId'
      });
      this.hasMany(models.Flights, {
        as: 'arrivalFlights',
        foreignKey: 'arrivalAirportId'
      });
    }
  }
  Airport.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    }
  }, {
    sequelize,
    modelName: 'Airport',
    indexes: [
      {
        name: 'idx_airport_name',
        fields: ['name']
      },
      {
        name: 'idx_airport_city',
        fields: ['city']
      },
      {
        name: 'idx_airport_location',
        fields: ['longitude', 'latitude']
      }
    ]
  });
  return Airport;
};