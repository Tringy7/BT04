'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product, {
        foreignKey: 'brandId',
        as: 'products'
      });
    }
  }
  Brand.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands'
  });
  return Brand;
};