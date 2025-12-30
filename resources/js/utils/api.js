// File untuk melakukan konfigurasi Axios

import axios from 'axios';

// URL Production
const productionBaseUrl = 'https://sendpick.isslab.web.id/api';

// Cek apakah kita sedang berada di domain production
// Ini mencegah localhost "terbakar" saat build local
const isProduction = window.location.hostname === 'sendpick.isslab.web.id';

// Tentukan Base URL
// 1. Jika domain browser adalah sendpick.isslab.web.id, PAKSA pakai productionBaseUrl
// 2. Jika bukan (misal localhost), baru cek .env atau fallback ke localhost
const baseURL = isProduction 
    ? productionBaseUrl 
    : (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api');

console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`🔗 API Base URL: ${baseURL}`);

// Buat instance axios dengan base URL yang sesuai
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Interceptor untuk menambahkan token autentikasi pada setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor untuk menangani response error & Token Expired
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;

        // Jika status response adalah 401, maka hapus token autentikasi dari localStorage
        if (status === 401) {
            console.error("🔐 Token expired atau invalid");
            localStorage.removeItem("authToken");
            // Opsional: Redirect hanya jika bukan di halaman login agar tidak loop
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;