import React, { useState, useEffect } from 'react';
import { getManifest } from '../services/manifestService';

// ==================== ICONS ====================
const PackageIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12' strokeLinecap='round' strokeLinejoin='round' />
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

const CalendarIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
        <line x1='16' y1='2' x2='16' y2='6' />
        <line x1='8' y1='2' x2='8' y2='6' />
        <line x1='3' y1='10' x2='21' y2='10' />
    </svg>
);

const EyeIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='12' r='3' />
    </svg>
);

const CheckCircleIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' strokeLinecap='round' strokeLinejoin='round' />
        <polyline points='22,4 12,14.01 9,11.01' strokeLinecap='round' strokeLinejoin='round' />
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
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${style.bg} ${style.text} border ${style.border}`}>
            {style.label}
        </span>
    );
}

// ==================== HELPER FUNCTIONS ====================
const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// ==================== MAIN COMPONENT ====================
const ManifestDetail = ({ manifestId, onBack }) => {
    const [manifest, setManifest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (manifestId) {
            loadManifestDetail();
        }
    }, [manifestId]);

    const loadManifestDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getManifest(manifestId);
            setManifest(data);
        } catch (err) {
            console.error('Error loading manifest detail:', err);
            setError('Gagal memuat detail manifest');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Memuat detail manifest...</div>;
    }

    if (error || !manifest) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500 mb-4">{error || 'Data tidak ditemukan'}</p>
                <button onClick={onBack} className="text-indigo-600 hover:underline">Kembali</button>
            </div>
        );
    }

    // Extract data from manifest
    const jobOrders = manifest?.jobOrders || manifest?.job_orders || [];
    const driver = manifest?.drivers || manifest?.driver;
    const vehicle = manifest?.vehicles || manifest?.vehicle;

    // Calculate totals
    const totalWeight = jobOrders.reduce((sum, jo) => sum + (parseFloat(jo.goods_weight) || 0), 0);
    const totalKoli = jobOrders.reduce((sum, jo) => sum + (parseInt(jo.goods_qty) || 0), 0);
    const vehicleCapacity = parseFloat(vehicle?.max_capacity) || 4000;
    const capacityUsed = ((totalWeight / vehicleCapacity) * 100).toFixed(1);

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
                        Back to Manifest
                    </button>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{manifestId}</h1>
                        <p className="text-slate-600">Detail Manifest & Packing List</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={manifest?.status} />
                        {/* Print Button */}
                        <button
                            onClick={() => window.open(`/manifests/${manifestId}/print`, '_blank')}
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
                        {/* Left Column - Daftar Muatan */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Daftar Muatan Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-50 to-slate-50 px-5 py-4 border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <PackageIcon className="h-5 w-5 text-indigo-600" />
                                        <h3 className="font-semibold text-slate-900">Daftar Muatan</h3>
                                        <span className="ml-auto text-xs text-slate-500 bg-white px-2 py-1 rounded-full">
                                            {jobOrders.length} Job Order
                                        </span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto bg-white">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                                                <th className="px-5 py-3">Job Order</th>
                                                <th className="px-5 py-3">Customer</th>
                                                <th className="px-5 py-3">Barang</th>
                                                <th className="px-5 py-3">Berat</th>
                                                <th className="px-5 py-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {jobOrders.length > 0 ? jobOrders.map((jo, index) => (
                                                <tr key={jo.job_order_id || index} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div>
                                                            <p className="font-semibold text-indigo-600 text-sm">{jo.job_order_id}</p>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mt-1 ${jo.order_type === 'FTL' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                {jo.order_type || 'LTL'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="font-medium text-slate-800 text-sm">{jo.customer?.customer_name || jo.customer_name || '-'}</p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="text-slate-700 text-sm truncate max-w-[150px]" title={jo.goods_desc || jo.commodity}>
                                                            {jo.goods_desc || jo.commodity || '-'}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold text-slate-900 text-sm">{jo.goods_weight || 0} kg</p>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <button
                                                            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition"
                                                            onClick={() => console.log('View JO:', jo.job_order_id)}
                                                        >
                                                            <EyeIcon className="h-3.5 w-3.5" />
                                                            Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
                                                        Tidak ada job order dalam manifest ini
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary Footer */}
                                <div className="bg-slate-50 px-5 py-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-medium">Total Berat</p>
                                                <p className="text-lg font-bold text-slate-900">{totalWeight.toLocaleString('id-ID')} Kg</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase font-medium">Total Koli</p>
                                                <p className="text-lg font-bold text-indigo-600">{totalKoli} Koli</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Tracking Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-slate-50 px-5 py-4 border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-5 w-5 text-purple-600" />
                                        <h3 className="font-semibold text-slate-900">Timeline Tracking</h3>
                                    </div>
                                </div>

                                <div className="p-5 bg-white">
                                    <div className="space-y-4">
                                        {/* Created */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <PackageIcon className="h-5 w-5 text-emerald-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">Manifest Dibuat</p>
                                                <p className="text-sm text-indigo-600">{formatDateTime(manifest?.created_at)}</p>
                                            </div>
                                        </div>

                                        {/* Dispatched (if applicable) */}
                                        {manifest?.status?.toLowerCase() !== 'pending' && (
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                                                        <TruckIcon className="h-5 w-5 text-sky-600" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Armada Berangkat</p>
                                                    <p className="text-sm text-indigo-600">{formatDateTime(manifest?.dispatched_at || manifest?.updated_at)}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Completed */}
                                        {manifest?.status?.toLowerCase() === 'completed' && (
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Pengiriman Selesai</p>
                                                    <p className="text-sm text-emerald-600">{formatDateTime(manifest?.completed_at)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary Cards */}
                        <div className="space-y-6">
                            {/* Driver & Armada Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Driver & Armada</h3>
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
                                            <p className="font-bold text-slate-900">{driver?.driver_name || 'Belum Assign'}</p>
                                            {driver?.phone && (
                                                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                                    <PhoneIcon className="h-4 w-4" />
                                                    <span className="text-sm">{driver.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                                                <TruckIcon className="h-6 w-6 text-sky-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-500">Armada</p>
                                            <p className="font-bold text-slate-900">{vehicle?.license_plate || vehicle?.plate_no || 'Belum Assign'}</p>
                                            {vehicle && (
                                                <p className="text-sm text-slate-500 mt-0.5">
                                                    {vehicle.brand} {vehicle.model || ''} ({vehicle.vehicle_type?.name || 'Truck'})
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Capacity Progress */}
                                    {vehicle && (
                                        <div className="pt-2 border-t border-slate-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium text-slate-500">Kapasitas Terpakai</span>
                                                <span className="text-sm font-bold text-slate-700">
                                                    {totalWeight.toLocaleString('id-ID')} / {vehicleCapacity.toLocaleString('id-ID')} kg
                                                </span>
                                            </div>
                                            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${parseFloat(capacityUsed) > 90 ? 'bg-red-500' : parseFloat(capacityUsed) > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(parseFloat(capacityUsed), 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rute & Jadwal Card */}
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Rute & Jadwal</h3>
                                <div className="space-y-4">
                                    {/* Origin */}
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Asal</p>
                                            <p className="font-semibold text-slate-900">{manifest?.origin_city || '-'}</p>
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
                                            <p className="font-semibold text-slate-900">{manifest?.dest_city || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="pt-4 mt-2 border-t border-slate-200 space-y-3">
                                        <div>
                                            <p className="text-sm text-slate-500">Tanggal Berangkat (ETD)</p>
                                            <p className="font-medium text-slate-900">{formatDate(manifest?.planned_departure)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Estimasi Tiba (ETA)</p>
                                            <p className="font-medium text-slate-900">{formatDate(manifest?.eta) || '-'}</p>
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

export default ManifestDetail;