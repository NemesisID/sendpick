import axios from 'axios';

if (!window.axios) {
    window.axios = axios;
}

const baseURL = import.meta.env?.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';

window.axios.defaults.baseURL = baseURL;
window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
