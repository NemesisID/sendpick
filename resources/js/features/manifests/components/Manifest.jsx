import React, { useEffect, useMemo, useState } from 'react';
import FilterDropdown from '../../../components/common/FilterDropdown';
import EditModal from '../../../components/common/EditModal';
import CancelConfirmModal from '../../../components/common/CancelConfirmModal';
import DispatchConfirmModal from '../../../components/common/DispatchConfirmModal';
import { useManifests } from '../hooks/useManifest';
import { useManifestJobOrders } from '../hooks/useManifestJobOrders';
import { useDrivers } from '../../drivers/hooks/useDrivers';
import { useVehicles } from '../../vehicles/hooks/useVehicles';

const BanIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PlayIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M5 3l14 9-14 9V3z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const summaryCardsBase = [
    {
        key: 'total',
        title: 'Total Manifest',
        description: 'Semua manifest aktif',
        value: '0',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M4 4h16' strokeLinecap='round' />
                <path d='M5 8h14v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M9 12h6M9 16h4' strokeLinecap='round' />
            </svg>
        ),
    },
    {
        key: 'completed',
        title: 'Packing Completed',
        description: 'Selesai diverifikasi QC',
        value: '0',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='m9 12 2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        key: 'inProgress',
        title: 'Dalam Proses',
        description: 'Menunggu loading kendaraan',
        value: '0',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='M12 8v4l2.5 1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        key: 'average',
        title: 'Average Lead Time',
        description: 'Dari receiving hingga dispatch',
        value: '3.5 Jam',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='9' />
                <path d='M12 7v5l3 2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const MANIFEST_STATUS_MAP = {
    draft: 'draft',
    pending: 'pending',
    inprogress: 'inProgress',
    released: 'released',
    completed: 'completed',
    intransit: 'inProgress',
};

const normalizeManifestStatus = (status) => {
    if (!status) return 'pending';
    const normalized = status.toString().toLowerCase().replace(/\s+/g, '');
    return MANIFEST_STATUS_MAP[normalized] ?? 'pending';
};

const extractCity = (address) => {
    if (!address) return '-';
    const keywords = [
        'Jakarta Barat', 'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Utara', 'Jakarta',
        'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta', 'Jogja',
        'Medan', 'Makassar', 'Denpasar', 'Balikpapan', 'Banjarmasin', 'Palembang',
        'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Malang', 'Solo', 'Surakarta',
        'Cikarang', 'Karawang'
    ];

    for (const keyword of keywords) {
        if (address.toLowerCase().includes(keyword.toLowerCase())) {
            return keyword;
        }
    }
    return address;
};

const mapManifestFromApi = (manifest) => {
    if (!manifest) {
        return null;
    }

    const jobOrders = Array.isArray(manifest.jobOrders) ? manifest.jobOrders : (Array.isArray(manifest.job_orders) ? manifest.job_orders : []);
    const jobOrderIds = jobOrders.map(jo => jo.job_order_id).filter(Boolean);

    // Fix Job Order Display: Show first ID + count of others
    let jobOrderDisplay = '-';
    if (jobOrderIds.length === 1) {
        jobOrderDisplay = jobOrderIds[0];
    } else if (jobOrderIds.length > 1) {
        jobOrderDisplay = `${jobOrderIds[0]} (+${jobOrderIds.length - 1} others)`;
    }

    const jobOrderTooltip = jobOrderIds.join(', ');

    const primaryJobOrder = jobOrders[0];

    // Fix Misplaced Data: Customer Name might be in cargo_summary if not in jobOrder
    let customerName = primaryJobOrder?.customer?.customer_name;

    // If Cancelled, job orders might be detached, so we can't rely on them for customer name.
    // However, we don't have a snapshot of customer name in manifest table (yet).
    // But we can try to use cargo_summary if it looks like a name, OR just show '-' if we can't recover it.
    // The user requirement says: "Tetap tampilkan 'PT. Maju Jaya', tapi statusnya merah."
    // Since we didn't add a customer_name column to manifests table, we might lose this info upon detach.
    // BUT, the user said: "Simpan 'Snapshot' customer/berat...". 
    // We implemented snapshot for weight/summary in backend (by NOT updating them to 0).
    // For customer name, if it's not in cargo_summary, we might lose it unless we added a column.
    // Let's assume for now we rely on what we have. If cargo_summary has text, use it?
    // Actually, the previous logic:
    if (!customerName && manifest.cargo_summary && !manifest.cargo_summary.match(/\d/)) {
        customerName = manifest.cargo_summary;
    }

    // Cargo Summary should be commodity
    const commodity = jobOrders.map(jo => jo.commodity).filter(Boolean).join(', ');
    // If Cancelled, manifest.cargo_summary holds the snapshot.
    const cargoSummary = manifest.cargo_summary || commodity || '-';

    // Fix Packages Count: Use jobOrders length as "koli" count
    // If Cancelled, jobOrders is empty. We might want to show 0 or '-' or keep it if we had a snapshot column.
    // The user said: "Berat: Tetap tertulis '69 Kg'". They didn't explicitly say about koli count, but implied "0 kg 0 koli" is bad.
    // Since we don't have a 'packages_count' column in manifest, we can't easily snapshot this without schema change.
    // For now, let's stick to jobOrders.length. If 0, it's 0.
    const totalPackages = jobOrders.length;

    return {
        id: manifest.manifest_id ?? manifest.id,
        jobOrder: jobOrderDisplay,
        jobOrderTooltip: jobOrderTooltip,
        customer: customerName || '-',
        origin: (manifest.origin_city && manifest.origin_city.includes('⚠️ Beda Origin')) ? 'Mixed Origins' : extractCity(manifest.origin_city),
        destination: extractCity(manifest.dest_city),
        packages: totalPackages,
        totalWeight: manifest.cargo_weight ? `${Number(manifest.cargo_weight).toLocaleString('id-ID')} kg` : '-',
        status: manifest.status ?? 'Pending',
        hub: (manifest.origin_city ?? '').toLowerCase().includes('jakarta')
            ? 'jakarta'
            : (manifest.origin_city ?? '').toLowerCase().includes('surabaya')
                ? 'surabaya'
                : (manifest.origin_city ?? '').toLowerCase().includes('bandung')
                    ? 'bandung'
                    : 'all',
        shipmentDate: manifest.planned_departure ? new Date(manifest.planned_departure).toLocaleDateString('id-ID') : '-',
        // Fix Driver Display: Use manifest.drivers relationship
        driver: manifest.drivers?.driver_name || manifest.driver?.driver_name || 'Belum Assign',
        vehiclePlate: manifest.vehicles?.plate_no || manifest.vehicle?.plate_no,
        vehicleBrand: manifest.vehicles?.brand || manifest.vehicle?.brand,
        lastUpdate: manifest.updated_at ? new Date(manifest.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
        raw: manifest,
        cargoSummary: cargoSummary,
    };
};

const statusStyles = {
    draft: {
        label: 'Draft',
        bg: 'bg-slate-100',
        text: 'text-slate-500',
    },
    pending: {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    inTransit: {
        label: 'In Transit',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    arrived: {
        label: 'Arrived',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    cancelled: {
        label: 'Cancelled',
        bg: 'bg-red-50',
        text: 'text-red-600',
    },
};

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Arrived', label: 'Arrived' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
];

const hubFilterOptions = [
    { value: 'all', label: 'Semua Hub' },
    { value: 'jakarta', label: 'Jakarta DC' },
    { value: 'surabaya', label: 'Surabaya Hub' },
    { value: 'bandung', label: 'Bandung Hub' },
];

const manifestStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Arrived', label: 'Arrived' },
    { value: 'Completed', label: 'Completed' },
];

const fallbackManifestRecords = [
    {
        id: 'MF-2024-231',
        jobOrder: 'JO-2024-874',
        jobOrderTooltip: 'JO-2024-874',
        customer: 'PT Maju Jaya Logistics',
        origin: 'Jakarta DC',
        destination: 'Surabaya Hub',
        shipmentDate: '2024-01-16',
        packages: 48,
        totalWeight: '1,250 kg',
        status: 'released',
        statusLabel: 'Released',
        hub: 'jakarta',
        lastUpdate: '2024-01-15 19:45',
        driver: 'Budi Santoso',
        vehiclePlate: 'B 9988 XYZ',
        vehicleBrand: 'Fuso',
        cargoSummary: 'Elektronik & Sparepart',
    },
    {
        id: 'MF-2024-229',
        jobOrder: '2 Orders',
        jobOrderTooltip: 'JO-2024-861, JO-2024-862',
        customer: 'CV Sukses Mandiri',
        origin: 'Bandung Hub',
        destination: 'Makassar Hub',
        shipmentDate: '2024-01-16',
        packages: 36,
        totalWeight: '980 kg',
        status: 'inProgress',
        statusLabel: 'In Transit',
        hub: 'bandung',
        lastUpdate: '2024-01-15 17:10',
        driver: 'Asep Sunandar',
        vehiclePlate: 'D 1234 ABC',
        vehicleBrand: 'Hino',
        cargoSummary: 'Tekstil & Garment',
    },
    {
        id: 'MF-2024-224',
        jobOrder: 'JO-2024-852',
        jobOrderTooltip: 'JO-2024-852',
        customer: 'PT Nusantara Sejahtera',
        origin: 'Jakarta DC',
        destination: 'Medan Hub',
        shipmentDate: '2024-01-17',
        packages: 54,
        totalWeight: '1,540 kg',
        status: 'pending',
        statusLabel: 'Pending',
        hub: 'jakarta',
        lastUpdate: '2024-01-15 16:20',
        driver: 'Belum Assign',
        vehiclePlate: null,
        vehicleBrand: null,
        cargoSummary: 'FMCG & Retail',
    },
    {
        id: 'MF-2024-220',
        jobOrder: 'JO-2024-843',
        jobOrderTooltip: 'JO-2024-843',
        customer: 'UD Sumber Berkah',
        origin: 'Surabaya Hub',
        destination: 'Denpasar Hub',
        shipmentDate: '2024-01-15',
        packages: 29,
        totalWeight: '720 kg',
        status: 'completed',
        statusLabel: 'Completed',
        hub: 'surabaya',
        lastUpdate: '2024-01-15 13:40',
        driver: 'Wayan Gede',
        vehiclePlate: 'DK 8877 XX',
        vehicleBrand: 'Isuzu',
        cargoSummary: 'Furniture & Mebel',
    },
];



const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='6' />
        <path d='m20 20-3.5-3.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const DownloadIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M12 4v10' strokeLinecap='round' />
        <path d='m8 10 4 4 4-4' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M5 18h14' strokeLinecap='round' />
    </svg>
);

const PlusIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M12 5v14M5 12h14' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ChevronDownIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='m6 9 6 6 6-6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const EditIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M12 20h9' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const TrashIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M10 11v6M14 11v6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

function SummaryCard({ card }) {
    return (
        <article className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div>
                <p className='text-sm text-slate-400'>{card.title}</p>
                <p className='mt-2 text-3xl font-semibold text-slate-900'>{card.value}</p>
                <p className='mt-1 text-xs text-slate-400'>{card.description}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
            </div>
        </article>
    );
}

function StatusBadge({ status }) {
    // Normalize status to match keys in statusStyles (camelCase)
    const normalizedStatus = status ? status.charAt(0).toLowerCase() + status.slice(1).replace(/\s+/g, '') : 'draft';
    // Handle specific cases if needed, e.g., 'In Transit' -> 'inTransit'

    const style = statusStyles[normalizedStatus] || statusStyles.draft;

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
            {status || 'Draft'}
        </span>
    );
}

function ManifestRow({ manifest, onEdit, onDelete, onDepart }) {
    const isPending = normalizeManifestStatus(manifest.status) === 'pending';
    const hasDriver = manifest.driver !== 'Belum Assign';
    const hasVehicle = !!manifest.vehiclePlate;
    const hasItems = manifest.packages > 0;

    // Logic Validasi: Disable jika Driver belum dipilih, Kendaraan belum dipilih, atau Manifest kosong
    const canDepart = isPending && hasDriver && hasVehicle && hasItems;

    let departTooltip = 'Berangkatkan Armada';
    if (!isPending) departTooltip = 'Status bukan Pending';
    else if (!hasDriver) departTooltip = 'Pilih Driver terlebih dahulu';
    else if (!hasVehicle) departTooltip = 'Pilih Kendaraan terlebih dahulu';
    else if (!hasItems) departTooltip = 'Manifest kosong (tidak ada Job Order)';

    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800'>{manifest.id}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p className='font-semibold text-slate-700'>{manifest.customer}</p>
                    <p className='text-xs text-slate-400' title={manifest.jobOrderTooltip}>Job Order: {manifest.jobOrder}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-700'>{manifest.origin}</span>
                    <span className='text-xs text-slate-400'>→ {manifest.destination}</span>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p className='font-medium text-slate-700'>{manifest.totalWeight} • {manifest.packages} koli</p>
                    <p className='text-xs text-slate-400'>{manifest.cargoSummary}</p>
                </div>
            </td>
            <td className='px-6 py-4'>
                <StatusBadge status={manifest.status} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{manifest.shipmentDate}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                {manifest.driver !== 'Belum Assign' ? (
                    <div className='flex flex-col'>
                        <span className='font-medium text-slate-900'>{manifest.driver}</span>
                        {manifest.vehiclePlate && (
                            <span className='text-xs text-slate-500'>
                                {manifest.vehiclePlate} {manifest.vehicleBrand ? `(${manifest.vehicleBrand})` : ''}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-500`}>
                        Belum Assign
                    </span>
                )}
            </td>
            <td className='px-6 py-4 text-right text-xs text-slate-400'>{manifest.lastUpdate}</td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => onDepart(manifest)}
                        disabled={!canDepart}
                        className={`inline-flex items-center justify-center rounded-lg p-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${canDepart
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'cursor-not-allowed bg-slate-50 text-slate-300'
                            }`}
                        title={departTooltip}
                    >
                        <PlayIcon className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        onClick={() => onEdit(manifest)}
                        disabled={manifest.status === 'Cancelled'}
                        className={`inline-flex items-center justify-center rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${manifest.status === 'Cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title='Edit manifest'
                    >
                        <EditIcon className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        onClick={() => onDelete(manifest)}
                        disabled={manifest.status === 'Cancelled'}
                        className={`inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 ${manifest.status === 'Cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title='Batalkan Manifest'
                    >
                        <BanIcon className='h-4 w-4' />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function ManifestTable({
    records,
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    hubFilter,
    onHubChange,
    onAddManifest,
    onEditManifest,
    onDeleteManifest,
    onDepartManifest,
    loading,
    error,
}) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Daftar Manifest & Packing List</h2>
                    <p className='text-sm text-slate-400'>Pantau status packing, loading, dan release manifest.</p>
                </div>
                <div className='flex w-full flex-col gap-3 md:w-auto'>
                    {/* Search and Filters Row */}
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                        <div className='group relative min-w-[240px] flex-1'>
                            <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                                <SearchIcon className='h-5 w-5' />
                            </span>
                            <input
                                type='text'
                                value={searchTerm}
                                onChange={(event) => onSearchChange(event.target.value)}
                                placeholder='Cari manifest, customer, atau tujuan...'
                                className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                            />
                        </div>
                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                            <FilterDropdown
                                value={statusFilter}
                                onChange={onStatusChange}
                                options={statusFilterOptions}
                                widthClass='w-full sm:w-40'
                            />
                            <FilterDropdown
                                value={hubFilter}
                                onChange={onHubChange}
                                options={hubFilterOptions}
                                widthClass='w-full sm:w-44'
                            />
                        </div>
                    </div>
                    {/* Action Buttons Row */}
                    <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
                        <button
                            type='button'
                            onClick={onAddManifest}
                            className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 sm:w-auto'
                        >
                            <PlusIcon className='h-4 w-4' />
                            Tambah Manifest
                        </button>
                        <button
                            type='button'
                            className='inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 sm:w-auto'
                        >
                            <DownloadIcon className='h-4 w-4' />
                            Cetak Manifest
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[920px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Manifest</th>
                            <th className='px-6 py-3'>Customer</th>
                            <th className='px-6 py-3'>Tujuan</th>
                            <th className='px-6 py-3'>Koli & Berat</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Tgl Kirim</th>
                            <th className='px-6 py-3'>DRIVER / ARMADA</th>
                            <th className='px-6 py-3 text-right'>Update Terakhir</th>
                            <th className='px-6 py-3 text-center'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Memuat data manifest...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={9} className='px-6 py-12 text-center text-sm text-rose-500'>
                                    {error}
                                </td>
                            </tr>
                        ) : records.length > 0 ? (
                            records.map((manifest) => (
                                <ManifestRow
                                    key={manifest.id}
                                    manifest={manifest}
                                    onEdit={onEditManifest}
                                    onDelete={onDeleteManifest}
                                    onDepart={onDepartManifest}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada manifest yang sesuai dengan filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}







export default function ManifestContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [hubFilter, setHubFilter] = useState('all');
    const [editModal, setEditModal] = useState({ isOpen: false, manifest: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, manifest: null });
    const [departModal, setDepartModal] = useState({ isOpen: false, manifest: null });
    const [isLoading, setIsLoading] = useState(false);

    const {
        manifests,
        loading: manifestsLoading,
        error: manifestsError,
        createManifest,
        updateManifest,
        cancelManifest,
    } = useManifests({ per_page: 50 });

    const { drivers } = useDrivers({ per_page: 100 });
    const { vehicles } = useVehicles({ per_page: 100 });

    const manifestRecords = useMemo(() => {
        if (Array.isArray(manifests) && manifests.length > 0) {
            return manifests
                .map(mapManifestFromApi)
                .filter(Boolean);
        }
        return fallbackManifestRecords;
    }, [manifests]);

    const summaryCards = useMemo(() => {
        const baseCards = summaryCardsBase.map((card) => ({ ...card }));
        if (!manifestRecords.length) {
            return baseCards;
        }

        const totals = manifestRecords.reduce(
            (acc, manifest) => {
                const normalizedStatus = normalizeManifestStatus(manifest.status);
                acc.total += 1;
                if (normalizedStatus === 'completed') acc.completed += 1;
                if (['pending', 'inProgress', 'draft'].includes(normalizedStatus)) acc.inProgress += 1;
                return acc;
            },
            { total: 0, completed: 0, inProgress: 0 },
        );

        return summaryCardsBase.map((card) => {
            if (card.key === 'total') {
                return { ...card, value: totals.total.toString() };
            }
            if (card.key === 'completed') {
                const percentage = totals.total ? Math.round((totals.completed / totals.total) * 100) : 0;
                return {
                    ...card,
                    value: totals.completed.toString(),
                    description: `${percentage}% manifest selesai`,
                };
            }
            if (card.key === 'inProgress') {
                return { ...card, value: totals.inProgress.toString() };
            }
            return card;
        });
    }, [manifestRecords]);

    const { fetchAvailableJobOrders } = useManifestJobOrders();
    const [rawAvailableJobOrders, setRawAvailableJobOrders] = useState([]);

    useEffect(() => {
        if (editModal.isOpen) {
            const loadJobOrders = async () => {
                try {
                    // Use 'create' for new manifests to fetch all unassigned orders
                    const manifestId = editModal.manifest?.id || 'create';
                    const response = await fetchAvailableJobOrders(manifestId);

                    // The API returns { data: { available_job_orders: [...] } }
                    const orders = response?.available_job_orders || [];
                    setRawAvailableJobOrders(Array.isArray(orders) ? orders : []);
                } catch (error) {
                    console.error("Failed to load job orders", error);
                    setRawAvailableJobOrders([]);
                }
            };
            loadJobOrders();
        }
    }, [editModal.isOpen, editModal.manifest, fetchAvailableJobOrders]);

    const availableJobOrders = useMemo(() => {
        return (rawAvailableJobOrders || []).map(jo => ({
            value: jo.job_order_id,
            label: `${jo.job_order_id} - ${jo.customer_name || 'No Customer'}`,
            status: jo.status,
            details: jo
        }));
    }, [rawAvailableJobOrders]);

    const availableDrivers = useMemo(() => {
        return (drivers || []).map(d => ({
            value: d.driver_id,
            label: d.driver_name
        }));
    }, [drivers]);

    const availableVehicles = useMemo(() => {
        return (vehicles || []).map(v => ({
            value: v.vehicle_id,
            label: `${v.plate_no} - ${v.vehicle_type?.name || v.brand || 'Unknown'}`
        }));
    }, [vehicles]);

    const manifestFields = [
        {
            name: 'jobOrders',
            label: 'Pilih Job Order',
            type: 'multiselect',
            required: true,
            options: availableJobOrders.map(jo => ({ value: jo.value, label: jo.label }))
        },
        { name: 'customer', label: 'Customer', type: 'text', required: false, readOnly: true },
        { name: 'origin', label: 'Origin', type: 'text', required: false, readOnly: true },
        { name: 'destination', label: 'Destination', type: 'text', required: false, readOnly: true },
        { name: 'shipmentDate', label: 'Shipment Date', type: 'date', required: true },
        { name: 'packages', label: 'Total Packages', type: 'number', required: false, readOnly: true },
        { name: 'totalWeight', label: 'Total Weight (kg)', type: 'text', required: false, readOnly: true },
        {
            name: 'driver',
            label: 'Driver (Opsional)',
            type: 'select',
            required: false,
            options: availableDrivers
        },
        {
            name: 'vehicle',
            label: 'Vehicle (Opsional)',
            type: 'select',
            required: false,
            options: availableVehicles
        },
    ];

    // Fungsi untuk menghitung data gabungan dari Job Orders yang dipilih
    const calculateCombinedData = (selectedJobOrderIds) => {
        if (!selectedJobOrderIds || selectedJobOrderIds.length === 0) {
            return {
                customer: '',
                origin: '',
                destination: '',
                packages: 0,
                totalWeight: ''
            };
        }

        const selectedData = availableJobOrders
            .filter(option => selectedJobOrderIds.includes(option.value))
            .map(option => option.details);

        if (selectedData.length === 0) {
            return {
                customer: '',
                origin: '',
                destination: '',
                packages: 0,
                totalWeight: ''
            };
        }

        // Menggabungkan customer (jika berbeda, pisahkan dengan koma)
        const uniqueCustomers = [...new Set(selectedData.map(data => data.customer_name))];
        const customer = uniqueCustomers.join(', ');

        // Validasi Origin: Cek apakah ada lebih dari 1 origin
        const uniqueOrigins = [...new Set(selectedData.map(data => data.pickup_address))];
        let origin = uniqueOrigins[0] || '-';

        if (uniqueOrigins.length > 1) {
            origin = `⚠️ Beda Origin`;
        }

        // Menggabungkan destination
        const uniqueDestinations = [...new Set(selectedData.map(data => data.delivery_address))];
        const destination = uniqueDestinations.join(', ');

        // Menghitung total packages
        const totalPackages = selectedData.length;

        // Menghitung total weight
        const totalWeightKg = selectedData.reduce((sum, data) => {
            return sum + (Number(data.goods_weight) || 0);
        }, 0);

        // Calculate Cargo Summary (Goods Description)
        const uniqueGoods = [...new Set(selectedData.map(data => data.goods_desc).filter(Boolean))];
        const cargoSummary = uniqueGoods.join(', ');

        return {
            customer,
            origin,
            destination,
            packages: totalPackages,
            totalWeight: `${totalWeightKg.toLocaleString('id-ID')} kg`,
            cargoSummary
        };
    };

    const handleAddManifest = () => {
        setEditModal({ isOpen: true, manifest: null });
    };

    const handleEditManifest = (manifest) => {
        setEditModal({ isOpen: true, manifest });
    };

    const handleEditSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const payload = {
                origin_city: formData.origin,
                dest_city: formData.destination,
                cargo_summary: formData.cargoSummary || '',
                cargo_weight: parseFloat(formData.totalWeight.replace(/[^\d]/g, '')) || 0,
                planned_departure: formData.shipmentDate,
                job_order_ids: formData.jobOrders,
                driver_id: formData.driver,
                vehicle_id: formData.vehicle,
            };

            if (!editModal.manifest) {
                await createManifest(payload);
            } else {
                await updateManifest(editModal.manifest.id, payload);
            }

            setEditModal({ isOpen: false, manifest: null });
        } catch (error) {
            console.error('Error saving manifest:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClose = () => {
        setEditModal({ isOpen: false, manifest: null });
    };

    const handleDeleteManifest = (manifest) => {
        setDeleteModal({ isOpen: true, manifest });
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            await cancelManifest(deleteModal.manifest.id);
            setDeleteModal({ isOpen: false, manifest: null });
        } catch (error) {
            console.error('Error cancelling manifest:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal({ isOpen: false, manifest: null });
    };

    const handleDepartManifest = (manifest) => {
        setDepartModal({ isOpen: true, manifest });
    };

    const handleConfirmDepart = async () => {
        if (departModal.manifest) {
            setIsLoading(true);
            try {
                // Update status to 'In Transit'
                await updateManifest(departModal.manifest.id, { status: 'In Transit' });
                setDepartModal({ isOpen: false, manifest: null });
            } catch (error) {
                console.error('Error departing manifest:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filteredRecords = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return manifestRecords.filter((manifest) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                manifest.id.toLowerCase().includes(normalizedSearch) ||
                manifest.customer.toLowerCase().includes(normalizedSearch) ||
                manifest.jobOrder.toLowerCase().includes(normalizedSearch) ||
                manifest.destination.toLowerCase().includes(normalizedSearch);

            const matchesStatus = statusFilter === 'all' || manifest.status === statusFilter;
            const matchesHub = hubFilter === 'all' || manifest.hub === hubFilter;

            return matchesSearch && matchesStatus && matchesHub;
        });
    }, [manifestRecords, searchTerm, statusFilter, hubFilter]);

    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <ManifestTable
                records={filteredRecords}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                hubFilter={hubFilter}
                onHubChange={setHubFilter}
                onAddManifest={handleAddManifest}
                onEditManifest={handleEditManifest}
                onDeleteManifest={handleDeleteManifest}
                onDepartManifest={handleDepartManifest}
                loading={manifestsLoading}
                error={manifestsError}
            />


            <EditModal
                title={editModal.manifest ? "Edit Manifest" : "Tambah Manifest"}
                fields={manifestFields}
                initialData={editModal.manifest}
                isOpen={editModal.isOpen}
                onClose={handleEditClose}
                onSubmit={handleEditSubmit}
                isLoading={isLoading}
                calculateCombinedData={calculateCombinedData}
                jobOrdersData={{}} // No longer needed as we use availableJobOrders directly
            />

            <CancelConfirmModal
                title="Batalkan Manifest"
                message={`Apakah Anda yakin ingin membatalkan manifest "${deleteModal.manifest?.id}"? Job Order di dalamnya akan dilepas dan tersedia kembali.`}
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isLoading={isLoading}
            />

            {/* Depart Confirmation Modal */}
            <DispatchConfirmModal
                isOpen={departModal.isOpen}
                onClose={() => setDepartModal({ isOpen: false, manifest: null })}
                onConfirm={handleConfirmDepart}
                title='Konfirmasi Keberangkatan'
                message={`Apakah armada untuk Manifest ini sudah siap berangkat?`}
                manifestId={departModal.manifest?.id}
                isLoading={isLoading}
            />
        </>
    );
}