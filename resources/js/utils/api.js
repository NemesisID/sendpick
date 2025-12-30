// File untuk melakukan konfigurasi Axios

import axios from 'axios';

// 1. Dapatkan hostname saat ini dari browser
const hostname = window.location.hostname;

// 2. Cek apakah sedang berjalan di Localhost / 127.0.0.1
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// 3. Tentukan Base URL
// Jika Local -> Pakai port 8000
// Jika Production (apapun domainnya) -> Pakai https://sendpick.isslab.web.id/api
const baseURL = isLocal 
    ? 'http://127.0.0.1:8000/api' 
    : 'https://sendpick.isslab.web.id/api';

console.log(`🌍 Hostname detected: ${hostname}`);
console.log(`🔗 API Base URL set to: ${baseURL}`);

// Buat instance axios
const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Interceptor Request (Pasang Token)
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

// Interceptor Response (Handle Error & 401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;

        // Jika 401 (Unauthorized), hapus token dan redirect login
        if (status === 401) {
            console.error("🔐 Token expired atau invalid");
            localStorage.removeItem("authToken");

            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;