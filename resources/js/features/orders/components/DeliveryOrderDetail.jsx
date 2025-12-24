import React, { useState, useEffect } from 'react';
import { getDeliveryOrder } from '../services/deliveryOrderService';

// ==================== ICONS ====================
const MapPinIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='10' r='3' />
    </svg>
);

const TruckIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M14 18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' />
        <path d='M15 18H9' />
        <path d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' />
        <circle cx='17' cy='18' r='2' />
        <circle cx='7' cy='18' r='2' />
    </svg>
);

const UserIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
        <circle cx='12' cy='7' r='4' />
    </svg>
);

const PhoneIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ClockIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='10' />
        <polyline points='12,6 12,12 16,14' />
    </svg>
);

const PackageIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PrintIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M6 9V2h12v7' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 14h12v8H6z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

// ==================== STATUS BADGE ====================
const statusStyles = {
    pending: { label: 'Pending', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    intransit: { label: 'In Transit', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
    'in transit': { label: 'In Transit', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
    delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    returned: { label: 'Returned', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    completed: { label: 'Completed', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

function StatusBadge({ status }) {
    const normalizedStatus = status?.toLowerCase()?.replace(/\s+/g, '') || 'pending';
    const style = statusStyles[normalizedStatus] || statusStyles.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${style.bg} ${style.text} border ${style.border}`}>
            {style.label}
        </span>
    );
}

// ==================== HELPER FUNCTIONS ====================
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const formatFullDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// ==================== MAIN COMPONENT ====================
const DeliveryOrderDetail = ({ deliveryOrderId, onBack }) => {
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (deliveryOrderId) {
            loadDeliveryOrder();
        }
    }, [deliveryOrderId]);

    const loadDeliveryOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDeliveryOrder(deliveryOrderId);
            setDelivery(data);
        } catch (err) {
            console.error('Error loading delivery order detail:', err);
            setError('Gagal memuat detail delivery order');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Memuat detail delivery order...</div>;
    }

    if (error || !delivery) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500 mb-4">{error || 'Data tidak ditemukan'}</p>
                <button onClick={onBack} className="text-indigo-600 hover:underline">Kembali</button>
            </div>
        );
    }

    // Extract data
    const sourceInfo = delivery.source_info || {};
    const doId = delivery.do_id || deliveryOrderId;
    const status = delivery.status;

    // Driver & vehicle info
    const driverName = delivery.driver_name || delivery.assigned_driver || 'Belum ditugaskan';
    const driverPhone = sourceInfo.driver_phone || null;
    const vehiclePlate = delivery.vehicle_plate || delivery.assigned_vehicle || 'Belum ditugaskan';
    const vehicleType = delivery.vehicle_type || sourceInfo.vehicle_type || 'Armada';

    // Route info
    const originAddress = sourceInfo.pickup_address || delivery.pickup_address || '-';
    const originCity = sourceInfo.origin_city || sourceInfo.pickup_city || '-';
    const destAddress = sourceInfo.delivery_address || delivery.delivery_address || '-';
    const destCity = sourceInfo.dest_city || sourceInfo.delivery_city || '-';

    // Cargo info
    const weight = sourceInfo.goods_weight || delivery.weight || '-';
    const koli = sourceInfo.koli || sourceInfo.goods_qty || delivery.quantity || '-';
    const volume = sourceInfo.goods_volume || '-';
    const goodsDesc = delivery.goods_summary || sourceInfo.goods_desc || '-';

    // Dates
    const doDate = delivery.do_date || delivery.created_at;
    const departureDate = delivery.departure_date;
    const eta = delivery.eta;

    // Customer
    const customerName = delivery.customer?.customer_name || sourceInfo.customer_name || '-';

    // Source info
    const sourceType = delivery.source_type;
    const sourceId = delivery.source_id;
    let sourceLabel = sourceType === 'JO' ? `Job Order: ${sourceId}` : `Manifest: ${sourceId}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Delivery Orders
                    </button>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{doId}</h1>
                        <p className="text-slate-600">{customerName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={status} />
                        {/* Print Button */}
                        <button
                            onClick={() => window.open(`/delivery-orders/${doId}/print`, '_blank')}
                            className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-500 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
                        >
                            <PrintIcon className="h-4 w-4" />
                            Cetak
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs - Only Overview */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            className="flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition border-indigo-500 text-indigo-600"
                        >
                            <span>📋</span>
                            Overview
                        </button>
                    </nav>
                </div>

                {/* Tab Content - Overview */}
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Delivery Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery Order Details Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Order Details</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-slate-500">Tanggal DO</p>
                                        <p className="font-medium text-slate-900">{formatDate(doDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Customer</p>
                                        <p className="font-medium text-slate-900">{customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Origin</p>
                                        <p className="font-medium text-slate-900">{originCity}</p>
                                        <p className="text-xs text-slate-500 mt-1">{originAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Destination</p>
                                        <p className="font-medium text-slate-900">{destCity}</p>
                                        <p className="text-xs text-slate-500 mt-1">{destAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Driver</p>
                                        <p className="font-medium text-slate-900">{driverName}</p>
                                        {driverPhone && (
                                            <p className="text-xs text-slate-500 mt-1">{driverPhone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Vehicle</p>
                                        <p className="font-medium text-slate-900">{vehiclePlate}</p>
                                        <p className="text-xs text-slate-500 mt-1">{vehicleType}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <p className="text-sm text-slate-500">Sumber</p>
                                    <p className="font-medium text-slate-900">{sourceLabel}</p>
                                </div>
                            </div>

                            {/* Detail Muatan Card */}
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden">
                                <div className="px-5 py-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <PackageIcon className="h-5 w-5 text-amber-600" />
                                        <h3 className="font-semibold text-amber-800">Detail Muatan</h3>
                                    </div>
                                    <p className="text-slate-700 font-medium mb-4">{goodsDesc}</p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="bg-white/80 rounded-xl px-4 py-3 border border-amber-100">
                                            <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">Berat Total</p>
                                            <p className="text-xl font-bold text-slate-900">{weight} <span className="text-sm font-medium text-slate-500">Kg</span></p>
                                        </div>
                                        <div className="bg-white/80 rounded-xl px-4 py-3 border border-amber-100">
                                            <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">Qty / Jumlah</p>
                                            <p className="text-xl font-bold text-amber-600">{koli} <span className="text-sm font-medium text-slate-500">Koli</span></p>
                                        </div>
                                        {volume && volume !== '-' && (
                                            <div className="bg-white/80 rounded-xl px-4 py-3 border border-amber-100">
                                                <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">Volume</p>
                                                <p className="text-xl font-bold text-slate-900">{volume} <span className="text-sm font-medium text-slate-500">m³</span></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary Cards */}
                        <div className="space-y-6">
                            {/* Armada & Driver Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Armada & Driver</h3>
                                <div className="space-y-5">
                                    {/* Driver Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-slate-200">
                                                <UserIcon className="h-6 w-6 text-slate-500" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-500">Driver</p>
                                            <p className="font-bold text-slate-900">{driverName}</p>
                                            {driverPhone && (
                                                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                                    <PhoneIcon className="h-4 w-4" />
                                                    <span className="text-sm">{driverPhone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                                        <span className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 font-bold rounded-lg text-sm border border-indigo-200">
                                            {vehiclePlate}
                                        </span>
                                        <span className="text-slate-500 text-sm">• {vehicleType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline & Status Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Timeline & Status</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-600">Tanggal DO</span>
                                        <span className="font-bold text-slate-900">{formatFullDate(doDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200">
                                        <span className="text-slate-600">Jadwal Keberangkatan</span>
                                        <span className="font-bold text-slate-900">{formatFullDate(departureDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-600">Estimasi Tiba (ETA)</span>
                                        <span className="font-bold text-slate-900">{eta ? formatFullDate(eta) : '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rute Pengiriman Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Rute Pengiriman</h3>
                                <div className="space-y-4">
                                    {/* Origin */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Asal</p>
                                            <p className="font-semibold text-slate-900">{originCity}</p>
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    <div className="flex items-center gap-3 pl-1">
                                        <div className="w-0.5 h-4 bg-gradient-to-b from-emerald-300 to-sky-300 ml-1"></div>
                                    </div>

                                    {/* Destination */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-3 w-3 rounded-full bg-sky-500"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Tujuan</p>
                                            <p className="font-semibold text-slate-900">{destCity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryOrderDetail;
