'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BookedFlights extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Booking, {
        as: 'outgoingBookings',
        foreignKey: 'bookedFlightId'
      });
      this.hasMany(models.Booking, {
        as: 'returnBookings',
        foreignKey: 'returnBookedFlightId'
      });
    }
  }

  BookedFlights.init({
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    noOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bookingDate: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'BookedFlights',
    indexes: [
      {
        unique: false,
        fields: ['flightId']
      },
      {
        unique: false,
        fields: ['bookingDate']
      }
    ]
  });

  return BookedFlights;
};
