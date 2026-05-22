'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
      Order.hasOne(models.Payment, { foreignKey: 'orderId', as: 'payment' });
      Order.hasMany(models.OrderStatusHistory, { foreignKey: 'orderId', as: 'statusHistory' });
    }
  }
  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(
        'new',
        'confirmed',
        'preparing',
        'shipping',
        'delivered',
        'cancelled',
        'cancel_request'
      ),
      defaultValue: 'new'
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelRequestedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders'
  });
  return Order;
};