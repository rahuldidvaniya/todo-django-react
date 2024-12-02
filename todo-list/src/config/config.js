export const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    TOAST_DURATION: 3000,
    DATE_FORMAT: 'YYYY-MM-DD',
    TOAST_CONFIG: {
        limit: 3,           
        throttle: 1000,     
    },
};
