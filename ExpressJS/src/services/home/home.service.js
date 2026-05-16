'use strict';
import db from '../models/index.js';

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

const getHomePageData = async () => {
  const [promotions, newestProducts, bestSellingProducts] = await Promise.all([
    getPromotions(5),
    getNewestProducts(10),
    getBestSellingProducts(10)
  ]);

  return {
    promotions,
    newestProducts,
    bestSellingProducts
  };
};

export default {
  getHomePageData
};
