import api from '../../../utils/api';

/**
 * Tracking Service - API calls untuk GPS/Tracking di Admin Panel
 * 
 * Backend Endpoints:
 * - GET /api/gps/current - Lokasi real-time semua driver aktif
 * - GET /api/gps/tracking-history - Riwayat tracking driver/vehicle/order
 * - GET /api/gps/live/{doId} - Live tracking untuk delivery order spesifik
 */

/**
 * Get current locations of all active drivers
 * Untuk menampilkan semua driver di peta
 * 
 * @returns {Promise<Object>} { data: [...drivers], metadata: { total_drivers, online_drivers } }
 */
export async function getCurrentLocations() {
    try {
        const response = await api.get('/gps/current');
        return {
            success: true,
            data: response.data?.data || [],
            metadata: response.data?.metadata || {
                total_drivers: 0,
                online_drivers: 0,
                last_updated: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('❌ Error fetching current locations:', error);
        return {
            success: false,
            data: [],
            metadata: { total_drivers: 0, online_drivers: 0 },
            error: error.response?.data?.message || 'Gagal mengambil data lokasi driver'
        };
    }
}

/**
 * Get GPS tracking history for a specific driver/vehicle/order
 * Untuk menggambar jejak rute perjalanan di peta
 * 
 * @param {Object} params - { driver_id, vehicle_id, order_id, start_date, end_date }
 * @returns {Promise<Object>} { tracking_points: [...], statistics: {...} }
 */
export async function getTrackingHistory(params = {}) {
    try {
        const response = await api.get('/gps/tracking-history', { params });
        return {
            success: true,
            data: response.data?.data || { tracking_points: [], statistics: {} }
        };
    } catch (error) {
        console.error('❌ Error fetching tracking history:', error);
        return {
            success: false,
            data: { tracking_points: [], statistics: {} },
            error: error.response?.data?.message || 'Gagal mengambil riwayat tracking'
        };
    }
}

/**
 * Get live tracking for a specific delivery order
 * Untuk menampilkan detail tracking satu pengiriman
 * 
 * @param {string} doId - Delivery Order ID
 * @returns {Promise<Object>} { delivery_order, driver, vehicle, current_location, tracking_history }
 */
export async function getLiveTracking(doId) {
    try {
        const response = await api.get(`/gps/live/${doId}`);
        return {
            success: true,
            data: response.data?.data || null
        };
    } catch (error) {
        console.error(`❌ Error fetching live tracking for ${doId}:`, error);
        return {
            success: false,
            data: null,
            error: error.response?.data?.message || 'Gagal mengambil data live tracking'
        };
    }
}

/**
 * Get active deliveries with driver locations
 * Menggabungkan data job orders aktif dengan lokasi GPS driver
 * 
 * @returns {Promise<Object>} Combined data for tracking dashboard
 */
export async function getActiveDeliveries() {
    try {
        // Ambil lokasi driver saat ini
        const locationsResult = await getCurrentLocations();
        
        if (!locationsResult.success) {
            return locationsResult;
        }

        // Transform data untuk dashboard
        const activeDeliveries = locationsResult.data
            .filter(loc => loc.active_delivery) // Hanya yang sedang delivery
            .map(loc => ({
                // Driver info
                driver_id: loc.driver_id,
                driver_name: loc.driver?.driver_name || 'Unknown',
                driver_phone: loc.driver?.phone || '-',
                
                // Vehicle info
                vehicle_id: loc.vehicle_id,
                plate_no: loc.vehicle?.plate_no || loc.vehicle?.license_plate || '-',
                
                // Location info
                current_lat: parseFloat(loc.lat),
                current_lng: parseFloat(loc.lng),
                last_update: loc.sent_at,
                time_ago: loc.time_ago,
                is_online: loc.is_online,
                
                // Active delivery info
                job_order_id: loc.active_delivery?.job_order_id,
                delivery_status: loc.active_delivery?.status,
                
                // Status for UI
                status: mapStatusForUI(loc.active_delivery?.status)
            }));

        return {
            success: true,
            data: {
                activeDeliveries,
                allDriverLocations: locationsResult.data,
                metadata: locationsResult.metadata
            }
        };
    } catch (error) {
        console.error('❌ Error fetching active deliveries:', error);
        return {
            success: false,
            data: { activeDeliveries: [], allDriverLocations: [], metadata: {} },
            error: 'Gagal mengambil data pengiriman aktif'
        };
    }
}

/**
 * Map backend status to UI status
 */
function mapStatusForUI(status) {
    const statusMap = {
        'Processing': 'pickup',
        'In Transit': 'onDelivery',
        'Pickup Complete': 'onDelivery',
        'Nearby': 'onDelivery',
        'Delivered': 'completed',
        'Delayed': 'delayed'
    };
    return statusMap[status] || 'onDelivery';
}

export default {
    getCurrentLocations,
    getTrackingHistory,
    getLiveTracking,
    getActiveDeliveries
};
