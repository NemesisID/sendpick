import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import { getManifest } from '../services/manifestService';

// ==================== ICONS ====================
const PrinterIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M6 9V2h12v7' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 14h12v8H6z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const TruckIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M14 18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M15 18H9' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='17' cy='18' r='2' />
        <circle cx='7' cy='18' r='2' />
    </svg>
);

const UserIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='7' r='4' />
    </svg>
);

const PhoneIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const MapPinIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='10' r='3' />
    </svg>
);

const CalendarIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
        <path d='M16 2v4M8 2v4M3 10h18' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PackageIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='m16.5 9.4-9-5.19' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PlayIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M5 3l14 9-14 9V3z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const XIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M18 6L6 18M6 6l12 12' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const EyeIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='12' r='3' />
    </svg>
);

// ==================== STATUS STYLES ====================
const statusStyles = {
    pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    'in transit': { label: 'In Transit', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
    intransit: { label: 'In Transit', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
    arrived: { label: 'Arrived', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

function StatusBadge({ status }) {
    const normalizedStatus = status?.toLowerCase()?.replace(/\s+/g, '') || 'pending';
    const style = statusStyles[normalizedStatus] || statusStyles.pending;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${style.bg} ${style.text} ${style.border} border`}>
            {style.label}
        </span>
    );
}

// ==================== CAPACITY PROGRESS BAR ====================
function CapacityBar({ used, max }) {
    const percentage = max > 0 ? Math.min((used / max) * 100, 100) : 0;
    const isOverload = used > max;

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-600">Kapasitas Terpakai</span>
                <span className={`font-semibold ${isOverload ? 'text-red-600' : 'text-slate-900'}`}>
                    {used.toLocaleString('id-ID')} / {max.toLocaleString('id-ID')} kg
                </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${isOverload ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// ==================== TIMELINE ITEM ====================
function TimelineItem({ icon, color, title, timestamp, isLast }) {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
                    {icon}
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-slate-200" />}
            </div>
            <div className="flex-1 pb-4">
                <p className="font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{timestamp}</p>
            </div>
        </div>
    );
}

// ==================== MAIN COMPONENT ====================
export default function ManifestDetailModal({ isOpen, onClose, manifestId }) {
    const [manifest, setManifest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && manifestId) {
            loadManifestDetail();
        }
    }, [isOpen, manifestId]);

    const loadManifestDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getManifest(manifestId);
            if (data) {
                setManifest(data);
            } else {
                setError('Data manifest tidak ditemukan');
            }
        } catch (err) {
            console.error('Error loading manifest detail:', err);
            setError('Gagal memuat detail manifest');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate ETA (departure + 1 day by default)
    const calculateETA = (departureDate) => {
        if (!departureDate) return '-';
        const eta = new Date(departureDate);
        eta.setDate(eta.getDate() + 1);
        return formatDate(eta);
    };

    // Get job orders from manifest
    const jobOrders = manifest?.job_orders || manifest?.jobOrders || [];

    // Get driver info
    const driver = manifest?.drivers || manifest?.driver || null;
    const driverName = driver?.driver_name || 'Belum Assign';
    const driverPhone = driver?.phone || '-';

    // Get vehicle info
    const vehicle = manifest?.vehicles || manifest?.vehicle || null;
    const vehiclePlate = vehicle?.plate_no || '-';
    const vehicleBrand = vehicle?.brand || '';
    const vehicleModel = vehicle?.model || '';
    const vehicleType = vehicle?.vehicle_type?.name || vehicle?.vehicleType?.name || '-';
    const vehicleCapacity = vehicle?.vehicle_type?.capacity_max_kg || vehicle?.vehicleType?.capacity_max_kg || 4000;

    // Calculate total weight
    const totalWeight = manifest?.cargo_weight || 0;

    // Timeline data
    const getTimelineEvents = () => {
        const events = [];

        // Created event
        events.push({
            icon: <PackageIcon className="h-4 w-4 text-white" />,
            color: 'bg-emerald-500',
            title: 'Manifest Dibuat',
            timestamp: formatDateTime(manifest?.created_at),
            status: 'created'
        });

        // Status-based events
        const status = manifest?.status?.toLowerCase();
        if (status === 'in transit' || status === 'intransit' || status === 'arrived' || status === 'completed') {
            events.push({
                icon: <TruckIcon className="h-4 w-4 text-white" />,
                color: 'bg-sky-500',
                title: 'Armada Berangkat',
                timestamp: manifest?.departed_at ? formatDateTime(manifest.departed_at) : 'Sudah berangkat',
                status: 'in_transit'
            });
        }

        if (status === 'arrived' || status === 'completed') {
            events.push({
                icon: <MapPinIcon className="h-4 w-4 text-white" />,
                color: 'bg-indigo-500',
                title: 'Tiba di Tujuan',
                timestamp: manifest?.arrived_at ? formatDateTime(manifest.arrived_at) : 'Sudah tiba',
                status: 'arrived'
            });
        }

        if (status === 'completed') {
            events.push({
                icon: <PackageIcon className="h-4 w-4 text-white" />,
                color: 'bg-emerald-500',
                title: 'Pengiriman Selesai',
                timestamp: manifest?.completed_at ? formatDateTime(manifest.completed_at) : 'Selesai',
                status: 'completed'
            });
        }

        if (status === 'cancelled') {
            events.push({
                icon: <XIcon className="h-4 w-4 text-white" />,
                color: 'bg-red-500',
                title: 'Manifest Dibatalkan',
                timestamp: manifest?.cancelled_at ? formatDateTime(manifest.cancelled_at) : formatDateTime(manifest?.updated_at),
                status: 'cancelled'
            });
        }

        return events;
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="xl"
        >
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={onClose} className="text-indigo-600 hover:underline">Tutup</button>
                </div>
            ) : manifest ? (
                <div className="space-y-6">
                    {/* ==================== HEADER ==================== */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {manifest.manifest_id || manifest.id}
                            </h1>
                            <p className="text-slate-500 mt-1">Detail Manifest & Packing List</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge status={manifest.status} />
                        </div>
                    </div>

                    {/* ==================== MAIN CONTENT: 2 COLUMNS ==================== */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* LEFT COLUMN (70%) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* 📦 Daftar Muatan / Delivery Orders */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <PackageIcon className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-slate-900">Daftar Muatan</h3>
                                </div>

                                {jobOrders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-sm">
                                            <thead>
                                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                                                    <th className="py-3 pr-4">Job Order</th>
                                                    <th className="py-3 pr-4">Customer</th>
                                                    <th className="py-3 pr-4">Barang</th>
                                                    <th className="py-3 pr-4">Berat</th>
                                                    <th className="py-3 text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {jobOrders.map((jo, index) => (
                                                    <tr key={jo.job_order_id || index} className="hover:bg-slate-50">
                                                        <td className="py-3 pr-4">
                                                            <span className="font-semibold text-indigo-600">
                                                                {jo.job_order_id}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <span className="font-medium text-slate-900">
                                                                {jo.customer?.customer_name || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <div>
                                                                <p className="font-medium text-slate-700">
                                                                    {jo.goods_desc || jo.commodity || '-'}
                                                                </p>
                                                                <p className="text-xs text-slate-400">
                                                                    {jo.order_type || 'LTL'}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 pr-4">
                                                            <span className="font-medium text-slate-900">
                                                                {jo.goods_weight ? `${Number(jo.goods_weight).toLocaleString('id-ID')} kg` : '-'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
                                                                title="Lihat Detail Job Order"
                                                            >
                                                                <EyeIcon className="h-3 w-3" />
                                                                Detail
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">
                                        <PackageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>Tidak ada Job Order dalam manifest ini</p>
                                    </div>
                                )}
                            </div>

                            {/* ⏱️ Timeline / Tracking Log */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-semibold text-slate-900">Timeline Tracking</h3>
                                </div>

                                <div className="space-y-0">
                                    {getTimelineEvents().map((event, index, arr) => (
                                        <TimelineItem
                                            key={event.status}
                                            icon={event.icon}
                                            color={event.color}
                                            title={event.title}
                                            timestamp={event.timestamp}
                                            isLast={index === arr.length - 1}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (30%) - SIDEBAR */}
                        <div className="space-y-6">

                            {/* 🚛 Info Driver & Armada */}
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                                    Driver & Armada
                                </h3>

                                {/* Driver Info */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{driverName}</p>
                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <PhoneIcon className="h-3 w-3" />
                                            <a href={`tel:${driverPhone}`} className="hover:text-indigo-600 transition">
                                                {driverPhone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Info */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                                        <TruckIcon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{vehiclePlate}</p>
                                        <p className="text-sm text-slate-500">
                                            {vehicleType} {vehicleBrand && vehicleModel ? `(${vehicleBrand} ${vehicleModel})` : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Capacity Bar */}
                                <CapacityBar used={Number(totalWeight)} max={vehicleCapacity} />
                            </div>

                            {/* 🗺️ Info Rute & Jadwal */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                                    Rute & Jadwal
                                </h3>

                                {/* Origin */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Asal</p>
                                        <p className="font-semibold text-slate-900">{manifest.origin_city || '-'}</p>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="ml-4 border-l-2 border-dashed border-slate-200 h-6" />

                                {/* Destination */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
                                        <div className="h-3 w-3 rounded-full bg-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Tujuan</p>
                                        <p className="font-semibold text-slate-900">{manifest.dest_city || '-'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Tanggal Berangkat (ETD)</span>
                                        <span className="text-sm font-semibold text-slate-900">
                                            {formatDate(manifest.planned_departure)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500">Estimasi Tiba (ETA)</span>
                                        <span className="text-sm font-semibold text-slate-900">
                                            {calculateETA(manifest.planned_departure)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 🎯 Action Buttons */}
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-white px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                                >
                                    <PrinterIcon className="h-4 w-4" />
                                    Cetak Manifest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
