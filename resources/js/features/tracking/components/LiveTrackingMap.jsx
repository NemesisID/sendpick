import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom SVG icons for different marker types
const createCustomIcon = (color, type = 'driver') => {
    const svgIcons = {
        driver: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
            <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
            <path d="M8 10h8M8 14h8M12 6v12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`,
        pickup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="1.5"/>
            <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>`,
        delivery: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="1.5"/>
            <path d="M9 9l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>`
    };

    return L.divIcon({
        html: svgIcons[type],
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

// Driver marker colors based on status
const getDriverIcon = (isOnline, status) => {
    if (!isOnline) return createCustomIcon('#9CA3AF', 'driver'); // Gray - offline
    
    switch (status) {
        case 'onDelivery':
            return createCustomIcon('#3B82F6', 'driver'); // Blue - on delivery
        case 'pickup':
            return createCustomIcon('#F59E0B', 'driver'); // Amber - pickup
        case 'delayed':
            return createCustomIcon('#EF4444', 'driver'); // Red - delayed
        default:
            return createCustomIcon('#10B981', 'driver'); // Green - available
    }
};

// Pickup & Delivery location icons
const pickupIcon = createCustomIcon('#10B981', 'pickup'); // Green
const deliveryIcon = createCustomIcon('#EF4444', 'delivery'); // Red

// Component to auto-fit map bounds
function FitBounds({ locations }) {
    const map = useMap();

    useEffect(() => {
        if (locations && locations.length > 0) {
            const bounds = L.latLngBounds(
                locations.map(loc => [
                    parseFloat(loc.lat || loc.current_lat), 
                    parseFloat(loc.lng || loc.current_lng)
                ])
            );
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [locations, map]);

    return null;
}

/**
 * LiveTrackingMap Component
 * 
 * Props:
 * - driverLocations: Array of driver locations from API
 * - selectedDelivery: Selected delivery order for focused view
 * - showRoute: Whether to show route line
 * - height: Map height (default: 100%)
 */
const LiveTrackingMap = ({ 
    driverLocations = [], 
    selectedDelivery = null,
    showRoute = true,
    height = '100%'
}) => {
    // Default center (Jakarta) if no locations
    const defaultCenter = [-6.2088, 106.8456];
    
    // Calculate center from locations
    const mapCenter = useMemo(() => {
        if (selectedDelivery?.current_lat && selectedDelivery?.current_lng) {
            return [selectedDelivery.current_lat, selectedDelivery.current_lng];
        }
        if (driverLocations.length > 0) {
            const firstLoc = driverLocations[0];
            return [
                parseFloat(firstLoc.lat || firstLoc.current_lat), 
                parseFloat(firstLoc.lng || firstLoc.current_lng)
            ];
        }
        return defaultCenter;
    }, [driverLocations, selectedDelivery]);

    // Format time ago for display
    const formatTimeAgo = (timeAgo) => {
        if (!timeAgo) return 'Unknown';
        return timeAgo;
    };

    // Render no data state
    if (driverLocations.length === 0) {
        return (
            <div 
                style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}
                className="flex items-center justify-center bg-slate-100 border border-slate-200"
            >
                <div className="text-center p-6">
                    <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-slate-500 font-medium">Tidak ada driver aktif</p>
                    <p className="text-xs text-slate-400 mt-1">Data GPS akan muncul saat driver online</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <MapContainer 
                center={mapCenter} 
                zoom={12} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
            >
                {/* Base map layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Auto-fit bounds */}
                <FitBounds locations={driverLocations} />

                {/* Driver markers */}
                {driverLocations.map((driver, index) => {
                    const lat = parseFloat(driver.lat || driver.current_lat);
                    const lng = parseFloat(driver.lng || driver.current_lng);
                    
                    if (isNaN(lat) || isNaN(lng)) return null;

                    const driverName = driver.driver?.driver_name || driver.driver_name || 'Driver';
                    const plateNo = driver.vehicle?.plate_no || driver.vehicle?.license_plate || driver.plate_no || '-';
                    const isOnline = driver.is_online !== false;
                    const status = driver.status || 'available';

                    return (
                        <Marker 
                            key={driver.driver_id || index}
                            position={[lat, lng]}
                            icon={getDriverIcon(isOnline, status)}
                        >
                            <Popup>
                                <div className="min-w-[180px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <span className="font-semibold text-slate-800">{driverName}</span>
                                    </div>
                                    <div className="space-y-1 text-xs text-slate-600">
                                        <p><span className="font-medium">Kendaraan:</span> {plateNo}</p>
                                        <p><span className="font-medium">Status:</span> {isOnline ? 'Online' : 'Offline'}</p>
                                        {driver.active_delivery && (
                                            <p><span className="font-medium">Order:</span> {driver.active_delivery.job_order_id}</p>
                                        )}
                                        <p className="text-slate-400">Update: {formatTimeAgo(driver.time_ago)}</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Route line for selected delivery */}
                {showRoute && selectedDelivery?.tracking_history && selectedDelivery.tracking_history.length > 1 && (
                    <Polyline
                        positions={selectedDelivery.tracking_history.map(p => [p.lat, p.lng])}
                        color="#6366F1"
                        weight={3}
                        opacity={0.7}
                        dashArray="5, 10"
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LiveTrackingMap;