import axios from '../axios.customize';

export const getProductDetailApi = (id) => {
    const URL_API = `/api/products/${id}`;
    return axios.get(URL_API);
};

export const getBestSellingProductsApi = (page = 1, limit = 10) => {
    return axios.get(`/api/products/bestselling?page=${page}&limit=${limit}`);
};

export const getAllProductsStoreApi = (page = 1, limit = 12, search = '', sort = 'default') => {
    return axios.get(`/api/products?page=${page}&limit=${limit}&search=${search}&sort=${sort}`);
};