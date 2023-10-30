'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderId extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Order, { foreignKey: 'orderId' });
    }
  }
  OrderId.init(
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'OrderId',
    }
  );
  return OrderId;
};
