import axios from '../axios.customize';

export const createUserApi = (name, email, password) => {
    const URL_API = "/api/auth/register";
    return axios.post(URL_API, { name, email, password });
};

export const loginApi = (email, password) => {
    const URL_API = "/api/auth/login";
    return axios.post(URL_API, { email, password });
};

export const logoutApi = () => {
    const URL_API = "/api/auth/logout";
    return axios.post(URL_API);
};

export const registerApi = (email, password, firstName, lastName, phoneNumber) => {
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

export const verifyRegisterOtpApi = (email, otp) => {
    const URL_API = "/api/auth/verify-otp";
    return axios.post(URL_API, { email, otp });
};

export const resendRegisterOtpApi = (email) => {
    const URL_API = "/api/auth/resend-otp";
    return axios.post(URL_API, { email });
};

export const forgotPasswordApi = (email) => {
    const URL_API = "/api/auth/forgot-password";
    return axios.post(URL_API, { email });
};

export const resetPasswordApi = (email, otp, tempToken, newPassword, confirmPassword) => {
    const URL_API = "/api/auth/reset-password";
    const data = { email, otp, tempToken, newPassword, confirmPassword };
    return axios.post(URL_API, data);
};

export const resendForgotOtpApi = (email) => {
    const URL_API = "/api/auth/resend-otp";
    return axios.post(URL_API, { email });
};