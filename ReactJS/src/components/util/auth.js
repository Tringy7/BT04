// src/components/util/auth.js

export const setAuthTokens = (accessToken, refreshToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
};

export const getAuthTokens = () => {
    // Thử lấy token với các tên key phổ biến (access_token hoặc accessToken)
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
};

export const removeAuthTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refreshToken');
};

export const decodeToken = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = decodeToken(token);
        if(!decoded || !decoded.exp) return true; // Nếu không parse được hoặc không có field exp thì coi như hết hạn
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Error checking token expiration:", error);
        return true;
    }
};