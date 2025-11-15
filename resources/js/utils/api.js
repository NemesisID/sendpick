import axios from 'axios';

// Untuk development, pakai base URL local
const localBaseUrl = 'http://127.0.0.1:8000/api';

// Untuk production, pakai base URL production
const productionBaseUrl = 'https://api.sendpick.com/api';

// Buat instance axios dengan base URL yang sesuai
const api = axios.create({
    baseURL: import.meta.env?.VITE_API_BASE_URL ?? localBaseUrl,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan token autentikasi pada setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor untuk menangani response error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika status response adalah 401, maka hapus token autentikasi dari localStorage
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
        }
        return Promise.reject(error);
    }
);

// Export instance axios buat dipake di file" yg ada di folder services
export default api;