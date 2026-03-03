'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Passenger extends Model {
    static associate(models) {
      this.belongsTo(models.Booking, {
        as: 'booking',
        foreignKey: 'bookingId',
        targetKey: 'id'
      });
    }
  }

  Passenger.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passportNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passportCountry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passportExpiry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bookingId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
      references: {
        model: 'Bookings',  
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Passenger',
    indexes: [
      {
        unique: false,
        fields: ['bookingId']
      },
      {
        unique: false,
        fields: ['email']
      },
      {
        unique: false,
        fields: ['passportNo']
      }
    ]
  });

  return Passenger;
};
