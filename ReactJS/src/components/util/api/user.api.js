import axios from '../axios.customize';

export const getUserApi = () => {
    const URL_API = "/api/auth/profile";
    return axios.get(URL_API);
};

// Reusing getUserApi since the endpoint is identical
export const getUserProfileApi = getUserApi;

export const updateUserProfileApi = (profileData) => {
    const URL_API = "/api/user/profile";
    return axios.patch(URL_API, profileData);
};

export const updateAdminProfileApi = (userId, profileData) => {
    const URL_API = userId ? `/api/admin/profile/${userId}` : "/api/admin/profile";
    return axios.patch(URL_API, profileData);
};

export const getAllUsersApi = () => {
    const URL_API = "/api/admin/users";
    return axios.get(URL_API);
};