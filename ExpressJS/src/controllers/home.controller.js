import homeService from '../services/home/home.service.js';

const getHomePage = async (req, res) => {
  try {
    const data = await homeService.getHomePageData();
    return res.json({
      message: 'Home page data loaded successfully',
      data
    });
  } catch (error) {
    console.error('Home controller error:', error);
    return res.status(500).json({ message: 'Server error while loading home page data' });
  }
};

const getBestSellingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const data = await homeService.getBestSellingProducts({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
    return res.json({
      message: 'Best selling products loaded successfully',
      data
    });
  } catch (error) {
    console.error('Home controller error:', error);
    return res.status(500).json({ message: 'Server error while loading best selling products' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', sort = 'default' } = req.query;
    const data = await homeService.getAllProducts({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      sort
    });
    return res.json({
      message: 'All products loaded successfully',
      data
    });
  } catch (error) {
    console.error('Home controller error:', error);
    return res.status(500).json({ message: 'Server error while loading all products' });
  }
};

export default {
  getHomePage,
  getBestSellingProducts,
  getAllProducts
};
