import orderService from '../services/order/order.service.js';

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, phoneNumber, note, paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      throw new Error('Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng');
    }

    const order = await orderService.createOrder(userId, {
      shippingAddress,
      phoneNumber,
      note,
      paymentMethod,
      items
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: order
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getOrders(userId);

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params; 
    const order = await orderService.getOrderById(userId, orderId);
    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const result = await orderService.cancelOrder(userId, orderId);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export default { createOrder, getOrders, getOrderById, cancelOrder };