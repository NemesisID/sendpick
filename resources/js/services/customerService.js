import api from '../utils/api';

export async function fetchCustomers(params = {}) {
    const response = await api.get('/customers', { params });
    const payload = response.data ?? {};
    const paginated = payload.data ?? {};

    return {
        items: Array.isArray(paginated.data) ? paginated.data : [],
        pagination: {
            total: paginated.total ?? 0,
            perPage: paginated.per_page ?? paginated.perPage ?? 0,
            currentPage: paginated.current_page ?? paginated.currentPage ?? 1,
            lastPage: paginated.last_page ?? paginated.lastPage ?? 1,
        },
        raw: payload,
    };
}