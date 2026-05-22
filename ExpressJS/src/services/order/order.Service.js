import db from '../../models/index.js';

const { Order, OrderItem, OrderStatusHistory, Payment, Cart, CartItem, Product } = db;

const createOrder = async (userId, { shippingAddress, phoneNumber, note, paymentMethod = 'COD', items }) => {
  // Lấy cart của user
  const cart = await Cart.findOne({
    where: { userId },
    include: [{
      model: CartItem,
      as: 'items',
      include: [{ model: Product, as: 'product' }]
    }]
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error('Giỏ hàng trống');
  }

  // Chỉ lấy những item được truyền lên (nếu có)
  let selectedCartItems = cart.items;
  if (items && items.length > 0) {
    const selectedProductIds = items.map(item => item.productId);
    selectedCartItems = cart.items.filter(cartItem => selectedProductIds.includes(cartItem.productId));
  }

  if (selectedCartItems.length === 0) {
    throw new Error('Không có sản phẩm nào được chọn để thanh toán');
  }

  // Kiểm tra stock
  for (const item of selectedCartItems) {
    if (!item.product) throw new Error(`Sản phẩm không tồn tại`);
    if (item.product.stock < item.quantity) {
      throw new Error(`Sản phẩm "${item.product.name}" không đủ số lượng trong kho`);
    }
  }

  // Tính tổng tiền
  const totalPrice = selectedCartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Dùng transaction để đảm bảo toàn vẹn dữ liệu
  const result = await db.sequelize.transaction(async (t) => {
    // Tạo order
    const order = await Order.create({
      userId,
      totalPrice,
      shippingAddress,
      phoneNumber,
      note,
      status: 'new'
    }, { transaction: t });

    // Tạo order items
    const orderItems = selectedCartItems.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }));
    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // Tạo payment
    await Payment.create({
      orderId: order.id,
      method: paymentMethod,
      status: 'pending',
      amount: totalPrice
    }, { transaction: t });

    // Ghi lịch sử trạng thái
    await OrderStatusHistory.create({
      orderId: order.id,
      status: 'new',
      note: 'Đơn hàng mới được tạo',
      changedBy: userId
    }, { transaction: t });

    // Xóa cart items sau khi đặt hàng (chỉ xóa những item đã thanh toán)
    const cartItemIdsToRemove = selectedCartItems.map(item => item.id);
    await CartItem.destroy({
      where: { 
        cartId: cart.id,
        id: cartItemIdsToRemove
      },
      transaction: t
    });

    return order;
  });

  // Tự động xác nhận đơn hàng sau 30 phút
  if (result && result.id) {
    const AUTO_CONFIRM_DELAY = 30 * 60 * 1000; // 30 phút

    setTimeout(async () => {
      try {
        const orderToUpdate = await Order.findByPk(result.id);
        
        // Chỉ tự động xác nhận nếu đơn hàng vẫn ở trạng thái 'new' và chưa bị hủy
        if (orderToUpdate && orderToUpdate.status === 'new') {
          await orderToUpdate.update({ status: 'confirmed' });

          // Ghi lại lịch sử thay đổi trạng thái
          await OrderStatusHistory.create({
            orderId: orderToUpdate.id,
            status: 'confirmed',
            note: 'Hệ thống tự động xác nhận sau 30 phút.',
            changedBy: 'system' // Ghi nhận là do hệ thống thay đổi
          });
        }
      } catch (error) {
        console.error(`[Auto-Confirm] Lỗi khi tự động xác nhận đơn hàng #${result.id}:`, error);
      }
    }, AUTO_CONFIRM_DELAY);
  }

  return result;
};

const getOrders = async (userId) => {
  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'thumbnail'] }]
      },
      {
        model: Payment,
        as: 'payment',
        attributes: ['method', 'status', 'amount', 'paidAt']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return orders;
};

const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'thumbnail', 'price'] }]
      },
      {
        model: Payment,
        as: 'payment'
      },
      {
        model: OrderStatusHistory,
        as: 'statusHistory',
        order: [['createdAt', 'ASC']]
      }
    ]
  });

  if (!order) throw new Error('Không tìm thấy đơn hàng');
  return order;
};

const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ where: { id: orderId, userId } });
  if (!order) throw new Error('Không tìm thấy đơn hàng');

  const now = new Date();
  const createdAt = new Date(order.createdAt);
  const diffMinutes = (now - createdAt) / 1000 / 60;

  // Đang ở bước preparing → gửi yêu cầu hủy
  if (order.status === 'preparing') {
    await order.update({
      status: 'cancel_request',
      cancelRequestedAt: now
    });

    await OrderStatusHistory.create({
      orderId: order.id,
      status: 'cancel_request',
      note: 'Người dùng gửi yêu cầu hủy đơn',
      changedBy: userId
    });

    return { message: 'Đã gửi yêu cầu hủy đơn, chờ shop xác nhận' };
  }

  // Chỉ cho hủy khi status là new hoặc confirmed và trong vòng 30 phút
  if (!['new', 'confirmed'].includes(order.status)) {
    throw new Error('Không thể hủy đơn hàng ở trạng thái này');
  }

  if (diffMinutes > 30) {
    throw new Error('Đã quá 30 phút, không thể hủy đơn hàng');
  }

  await order.update({ status: 'cancelled' });

  await OrderStatusHistory.create({
    orderId: order.id,
    status: 'cancelled',
    note: 'Người dùng hủy đơn hàng',
    changedBy: userId
  });

  return { message: 'Hủy đơn hàng thành công' };
};

export default { createOrder, getOrders, getOrderById, cancelOrder };