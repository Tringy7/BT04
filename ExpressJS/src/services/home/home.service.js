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

const getPromotions = async (options = {}) => {
  const { page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;
  return Promotion.findAll({
     where: {
      isActive: true
    },
    offset,
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

const getBestSellingProducts = async (options = {}) => {
  const { page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;
  return Product.findAndCountAll({
    offset,
    limit,
    order: [['sold', 'DESC']],
    attributes: ['id', 'name', 'price', 'thumbnail', 'stock', 'sold', 'categoryId', 'brandId'],
    include: productInclude,
    distinct: true
  });
};

const getAllProducts = async (options = {}) => {
  const { page = 1, limit = 12, search = '', sort = 'default' } = options;
  const offset = (page - 1) * limit;

  let order = [['createdAt', 'DESC']];
  if (sort === 'price-asc') order = [['price', 'ASC']];
  if (sort === 'price-desc') order = [['price', 'DESC']];

  let whereClause = {};
  if (search) {
    whereClause.name = {
      [db.Sequelize.Op.like]: `%${search}%`
    };
  }

  return Product.findAndCountAll({
    where: whereClause,
    offset,
    limit,
    order,
    attributes: ['id', 'name', 'price', 'thumbnail', 'stock', 'sold', 'categoryId', 'brandId', 'createdAt'],
    include: productInclude,
    distinct: true
  });
};

const getHomePageData = async () => {
  const [promotions, bestSellingProducts] = await Promise.all([
    getPromotions({ limit: 5 }),
    getBestSellingProducts({ page: 1, limit: 10 })
  ]);

  return {
    promotions,
    bestSellingProducts
  };
};

export default {
  getHomePageData,
  getPromotions,
  getBestSellingProducts,
  getAllProducts
};
