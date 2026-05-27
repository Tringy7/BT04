import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    function (response) {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    async function (error) {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && !originalRequest._retry) {
            
            if (originalRequest.url.includes('/api/auth/refresh')) {
                // Nếu API refresh token thất bại, phát ra event để logout
                window.dispatchEvent(new Event('force_logout'));
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    return instance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                processQueue(null);
                return instance(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                // Phát ra event để AuthContext xử lý việc logout và redirect nếu cần
                window.dispatchEvent(new Event('force_logout'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;