export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    return `${backendUrl}${imageUrl}`;
};