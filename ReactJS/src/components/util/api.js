import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/api/auth/register";
    const data = {
        name,
        email,
        password
    };

    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "/api/auth/login";
    const data = {
        email,
        password
    };

    return axios.post(URL_API, data);
};

const getUserApi = () => {
    const URL_API = "/api/auth/profile";
    return axios.get(URL_API);
};

const logoutApi = () => {
    const URL_API = "/api/auth/logout";
    return axios.post(URL_API);
};

const registerApi = (email, password, firstName, lastName, phoneNumber) => {
    const URL_API = "/api/auth/register";
    const data = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined
    };

    return axios.post(URL_API, data);
};

const verifyRegisterOtpApi = (email, otp) => {
    const URL_API = "/api/auth/verify-otp";
    const data = {
        email,
        otp
    };

    return axios.post(URL_API, data);
};

const resendRegisterOtpApi = (email) => {
    const URL_API = "/api/auth/resend-otp";
    const data = {
        email
    };

    return axios.post(URL_API, data);
};

const getUserProfileApi = () => {
    const URL_API = "/api/auth/profile";
    return axios.get(URL_API);
};

const updateUserProfileApi = (profileData) => {
    const URL_API = "/api/user/profile";
    return axios.patch(URL_API, profileData);
};

const updateAdminProfileApi = (userId, profileData) => {
    const URL_API = userId ? `/api/admin/profile/${userId}` : "/api/admin/profile";
    return axios.patch(URL_API, profileData);
};

const getAllUsersApi = () => {
    const URL_API = "/api/admin/users"; // expected backend endpoint; adjust if different
    return axios.get(URL_API);
};

const forgotPasswordApi = (email) => {
    const URL_API = "/api/auth/forgot-password";
    const data = { email };

    return axios.post(URL_API, data);
};

const getHomePageApi = () => {
    const URL_API = "/api/home";
    return axios.get(URL_API);
};

const getProductDetailApi = (id) => {
    const URL_API = `/api/products/${id}`;
    return axios.get(URL_API);
};

const resetPasswordApi = (email, otp, tempToken, newPassword, confirmPassword) => {
    const URL_API = "/api/auth/reset-password";
    const data = {
        email,
        otp,
        tempToken,
        newPassword,
        confirmPassword,
    };

    return axios.post(URL_API, data);
};

const resendForgotOtpApi = (email) => {
    const URL_API = "/api/auth/resend-otp";
    const data = { email };

    return axios.post(URL_API, data);
};

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    return `${backendUrl}${imageUrl}`;
};

export {
    createUserApi,
    loginApi,
    getUserApi,
    logoutApi,
    registerApi,
    verifyRegisterOtpApi,
    resendRegisterOtpApi,
    getHomePageApi,
    getProductDetailApi,
    getUserProfileApi,
    updateUserProfileApi,
    updateAdminProfileApi,
    getAllUsersApi,
    forgotPasswordApi,
    resetPasswordApi,
    resendForgotOtpApi,
    getImageUrl,
};

export const getBestSellingProductsApi = (page = 1, limit = 10) => {
    // Gọi đến route /api/products/bestselling
    return axios.get(`/api/products/bestselling?page=${page}&limit=${limit}`);
};

export const getAllProductsStoreApi = (page = 1, limit = 12, search = '', sort = 'default') => {
    return axios.get(`/api/products?page=${page}&limit=${limit}&search=${search}&sort=${sort}`);
};