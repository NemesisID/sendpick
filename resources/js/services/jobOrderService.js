import api from '../utils/api';

export async function fetchJobOrders(params = {}) {
    const response = await api.get('/job-orders', { params });
    const payload = response.data ?? {};

    return {
        items: Array.isArray(payload.data) ? payload.data : [],
        pagination: payload.pagination ?? null,
        raw: payload,
    };
}