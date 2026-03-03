'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Payments extends Model {
    static associate(models) {
      this.belongsTo(models.Booking, {
        as: 'bookings',
        foreignKey: 'booking_id',
        targetKey: 'id'
      });
    }
  }

  Payments.init({
    payment_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Bookings',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'initiated',
    },
    payment_method: {
      type: DataTypes.STRING,
    },
    payment_details: {
      type: DataTypes.JSON,
    },
  }, {
    sequelize,
    modelName: 'Payments',
    indexes: [
      {
        unique: false,
        fields: ['booking_id'],
      },
      {
        unique: false,
        fields: ['user_id'],
      },
      {
        unique: false,
        fields: ['status'],
      },
    ],
  });

  return Payments;
};
