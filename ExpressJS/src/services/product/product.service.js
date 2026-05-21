'use strict';
import db from '../../models/index.js';

const { Promotion, Product, Brand, ProductImage } = db;

const productInclude = [
  {
    model: Brand,
    as: 'brand',
    attributes: ['id', 'name', 'logo']
  },
  {
    model: ProductImage,
    as: 'images',
    attributes: ['id', 'imageUrl']
  }
];

const getProductById = async (options = {}) => {
  const productId = options;
  return Product.findByPk(productId);
}

const getPromotions = async (limit = 5) => {
  return Promotion.findAll({
     where: {
      isActive: true
    },
    limit,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'title', 'discountPercent', 'image', 'createdAt'],
    include: [
      {
        model: Product,
        as: 'products',
        attributes: ['id', 'name', 'price', 'thumbnail', 'stock', 'sold', 'categoryId', 'brandId'],
        include: productInclude,
        through: { attributes: [] }
      }
    ]
  });
};

const getNewestProducts = async (limit = 10) => {
  return Product.findAll({
    limit,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'price', 'thumbnail', 'stock', 'sold', 'categoryId', 'brandId', 'createdAt'],
    include: productInclude
  });
};

const getBestSellingProducts = async (limit = 10) => {
  return Product.findAll({
    limit,
    order: [['sold', 'DESC']],
    attributes: ['id', 'name', 'price', 'thumbnail', 'stock', 'sold', 'categoryId', 'brandId'],
    include: productInclude
  });
};

const getProductDetail = async (productId) => {
  return Product.findByPk(productId, {
    attributes: [
      'id',
      'name',
      'price',
      'thumbnail',
      'stock',
      'sold',
      'categoryId',
      'brandId',
      'description',
      'createdAt',
      'updatedAt'
    ],
    include: productInclude
  });
};

const getProductsByCategory = async (categoryId, limit = 20) => {
  return Product.findAll({
    where: {
      categoryId
    },
    limit,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'price', 'thumbnail', 'stock', 'sold', 'categoryId', 'brandId'],
    include: productInclude
  });
};

export default {
  getProductDetail,
  getProductsByCategory,
  getProductById
};
