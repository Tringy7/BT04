import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

instance.interceptors.response.use(

    function (response) {

        if (response && response.data) {
            return response.data;
        }

        return response;
    },

    async function (error) {

        const originalRequest = error.config;

        if (
            error?.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                // refresh bằng cookie
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
                    {},
                    {
                        withCredentials: true
                    }
                );

                // gọi lại request cũ
                return instance(originalRequest);

            } catch (refreshError) {

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;