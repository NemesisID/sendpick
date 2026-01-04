import { useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentLocations, getActiveDeliveries, getLiveTracking } from '../services/trackingService';

/**
 * useTracking - Custom hook untuk Real-Time Tracking
 * 
 * Features:
 * - Auto-refresh setiap 30 detik (sesuai interval bulk GPS dari mobile app)
 * - Loading & error states
 * - Filter by status
 * - Manual refresh
 */
export function useTracking(options = {}) {
    const {
        autoRefresh = true,
        refreshInterval = 30000, // 30 detik - sesuai interval bulk GPS
        statusFilter = 'all'
    } = options;

    const [driverLocations, setDriverLocations] = useState([]);
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [metadata, setMetadata] = useState({
        total_drivers: 0,
        online_drivers: 0,
        active_deliveries: 0,
        completed_today: 0,
        delayed: 0,
        last_updated: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(null);
    
    const intervalRef = useRef(null);

    // Fetch data from API
    const fetchData = useCallback(async () => {
        try {
            setError(null);
            
            const result = await getActiveDeliveries();

            if (result.success) {
                const { activeDeliveries: deliveries, allDriverLocations, metadata: meta } = result.data;
                
                setDriverLocations(allDriverLocations);
                setActiveDeliveries(deliveries);
                setMetadata({
                    total_drivers: meta.total_drivers || allDriverLocations.length,
                    online_drivers: meta.online_drivers || allDriverLocations.filter(d => d.is_online).length,
                    active_deliveries: deliveries.length,
                    completed_today: 0, // TODO: ambil dari API terpisah jika diperlukan
                    delayed: deliveries.filter(d => d.status === 'delayed').length,
                    last_updated: new Date().toISOString()
                });
                setLastRefresh(new Date());
            } else {
                setError(result.error || 'Gagal mengambil data tracking');
            }
        } catch (err) {
            console.error('Error in useTracking:', err);
            setError('Terjadi kesalahan saat mengambil data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Manual refresh
    const refresh = useCallback(() => {
        setIsLoading(true);
        fetchData();
    }, [fetchData]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-refresh interval
    useEffect(() => {
        if (autoRefresh && refreshInterval > 0) {
            intervalRef.current = setInterval(() => {
                fetchData();
            }, refreshInterval);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [autoRefresh, refreshInterval, fetchData]);

    // Filter deliveries by status
    const filteredDeliveries = useCallback(() => {
        if (statusFilter === 'all') {
            return activeDeliveries;
        }
        return activeDeliveries.filter(d => d.status === statusFilter);
    }, [activeDeliveries, statusFilter]);

    return {
        // Data
        driverLocations,
        activeDeliveries: filteredDeliveries(),
        allActiveDeliveries: activeDeliveries,
        metadata,
        
        // States
        isLoading,
        error,
        lastRefresh,
        
        // Actions
        refresh
    };
}

/**
 * useLiveTracking - Hook untuk tracking satu delivery order spesifik
 * 
 * @param {string} doId - Delivery Order ID
 */
export function useLiveTracking(doId) {
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!doId) {
            setIsLoading(false);
            return;
        }

        try {
            setError(null);
            const result = await getLiveTracking(doId);

            if (result.success) {
                setTrackingData(result.data);
            } else {
                setError(result.error || 'Gagal mengambil data tracking');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data');
        } finally {
            setIsLoading(false);
        }
    }, [doId]);

    useEffect(() => {
        fetchData();
        
        // Auto-refresh setiap 10 detik untuk live tracking
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return {
        trackingData,
        isLoading,
        error,
        refresh: fetchData
    };
}

export default useTracking;
