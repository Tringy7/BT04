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

export default {
  getHomePage
};
