'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Flights, {
        as: 'Airplane',
        foreignKey: 'airplaneId'
      });
    }
  }
  Airplane.init({
    modelNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Airplane',
    indexes: [
      {
        name: 'idx_airplane_modelNumber',
        fields: ['modelNumber']
      },
      {
        name: 'idx_airplane_capacity',
        fields: ['capacity']
      }
    ]
  });
  return Airplane;
};