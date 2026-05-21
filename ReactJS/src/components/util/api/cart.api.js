import axios from '../axios.customize';

export const getCart = () => {
    const URL_API = '/api/cart';
    return axios.get(URL_API);
};

export const addToCart = (data) => {
    const URL_API = '/api/cart/add';

    return axios.post(URL_API, data);
};

export const deleteCartItem = (cartItemId) => {
    const URL_API = `/api/cart/${cartItemId}`;

    return axios.delete(URL_API);
};

export const updateCartItem = (cartItemId) => {
    const URL_API = `/api/cart/${cartItemId}`;

    return axios.delete(URL_API);
};