import axios from '../axios.customize';

// Tạo đơn hàng (Checkout)
export const createOrder = (data) => {
    const URL_API = '/api/order/add';
    return axios.post(URL_API, data);
};

// Lấy danh sách đơn hàng của user
export const getOrders = () => {
    const URL_API = '/api/orders';
    return axios.get(URL_API);
};

// Lấy chi tiết 1 đơn hàng
export const getOrderById = (orderId) => {
    const URL_API = `/api/orders/${orderId}`;
    return axios.get(URL_API);
};

// Huỷ đơn hàng
export const cancelOrder = (orderId) => {
    const URL_API = `/api/orders/${orderId}/cancel`;
    return axios.put(URL_API);
};