'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Brand, {
        foreignKey: 'brandId',
        as: 'brand'
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: 'productId',
        as: 'images'
      });
      Product.belongsToMany(models.Promotion, {
        through: models.PromotionProduct,
        foreignKey: 'productId',
        otherKey: 'promotionId',
        as: 'promotions'
      });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'brands',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products'
  });
  return Product;
};