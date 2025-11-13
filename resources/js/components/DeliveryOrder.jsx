import React, { useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';
import DeliveryOrderModal from './common/DeliveryOrderModal';
import DeleteConfirmModal from './common/DeleteConfirmModal';
import EditModal from './common/EditModal';

const summaryCards = [
    {
        title: 'Total Delivery Order',
        value: '198',
        description: 'DO aktif minggu ini',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M4 7h11v9H4z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M15 11h3l2 2v3h-5' strokeLinecap='round' strokeLinejoin='round' />
                <circle cx='7' cy='18' r='1.5' />
                <circle cx='17' cy='18' r='1.5' />
            </svg>
        ),
    },
    {
        title: 'Sudah Terkirim',
        value: '132',
        description: '66% dari total pengiriman',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 12h18' strokeLinecap='round' />
                <path d='m7 8 4 4-4 4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Dalam Perjalanan',
        value: '46',
        description: 'Update real-time setiap 15 menit',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='M12 8v4l2.5 1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Exception',
        value: '6',
        description: 'Perlu tindakan CS & logistik',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M12 4 3 19h18z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 9v5' strokeLinecap='round' />
                <circle cx='12' cy='15' r='1' fill='currentColor' stroke='none' />
            </svg>
        ),
    },
];

const statusStyles = {
    scheduled: {
        label: 'Scheduled',
        bg: 'bg-slate-100',
        text: 'text-slate-500',
    },
    loading: {
        label: 'Loading',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    inTransit: {
        label: 'In Transit',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    delivered: {
        label: 'Delivered',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    exception: {
        label: 'Exception',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
    },
};

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'loading', label: 'Loading' },
    { value: 'inTransit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'exception', label: 'Exception' },
];

const priorityFilterOptions = [
    { value: 'all', label: 'Semua Prioritas' },
    { value: 'critical', label: 'Critical - Cold Chain' },
    { value: 'high', label: 'High Priority' },
    { value: 'normal', label: 'Normal' },
];

const deliveryRecords = [
    {
        id: 'DO-2024-311',
        manifestId: 'MF-2024-231',
        jobOrder: 'JO-2024-874',
        customer: 'PT Maju Jaya Logistics',
        driver: 'Ahmad Subandi',
        vehicle: 'B 9123 KJD (CDD Box)',
        route: 'Jakarta DC → Surabaya Hub',
        eta: '2024-01-17 08:30',
        departure: '2024-01-16 19:15',
        status: 'inTransit',
        packages: 48,
        lastUpdate: '2024-01-16 21:10 di Cirebon',
        temperature: '4°C',
        priority: 'critical',
    },
    {
        id: 'DO-2024-309',
        manifestId: 'MF-2024-229',
        jobOrder: 'JO-2024-861',
        customer: 'CV Sukses Mandiri',
        driver: 'Budi Santoso',
        vehicle: 'B 5678 CD (Wingbox)',
        route: 'Bandung Hub → Makassar Hub',
        eta: '2024-01-19 10:00',
        departure: '2024-01-16 18:40',
        status: 'loading',
        packages: 36,
        lastUpdate: '2024-01-16 19:05 - Loading dock 2',
        temperature: '-',
        priority: 'high',
    },
    {
        id: 'DO-2024-302',
        manifestId: 'MF-2024-220',
        jobOrder: 'JO-2024-843',
        customer: 'UD Sumber Berkah',
        driver: 'Dedi Hermawan',
        vehicle: 'L 4455 GH (Engkel Box)',
        route: 'Surabaya Hub → Denpasar Hub',
        eta: '2024-01-16 22:30',
        departure: '2024-01-16 16:45',
        status: 'delivered',
        packages: 29,
        lastUpdate: '2024-01-16 22:42 - POD uploaded',
        temperature: 'Ambient',
        priority: 'normal',
    },
    {
        id: 'DO-2024-298',
        manifestId: 'MF-2024-224',
        jobOrder: 'JO-2024-852',
        customer: 'PT Nusantara Sejahtera',
        driver: 'Hendra Wijaya',
        vehicle: 'B 7788 ZX (Reefer Truck)',
        route: 'Jakarta DC → Medan Hub',
        eta: '2024-01-18 14:00',
        departure: '2024-01-16 20:10',
        status: 'scheduled',
        packages: 54,
        lastUpdate: '2024-01-16 19:30 - Menunggu surat jalan',
        temperature: '3°C',
        priority: 'critical',
    },
];

const deliveryTimeline = [
    {
        label: 'Average Transit Time',
        value: '18 jam 24 menit',
        detail: 'Perbandingan minggu lalu: -6%',
    },
    {
        label: 'On-Time Delivery',
        value: '94.2%',
        detail: 'Target SLA: 95%',
    },
    {
        label: 'Proof of Delivery',
        value: '128/132',
        detail: 'POD lengkap diterima 97% dalam 6 jam',
    },
];

const issueHighlights = [
    {
        title: 'Pending POD',
        description: '4 delivery menunggu upload bukti serah terima',
        action: 'Hubungi driver',
        color: 'bg-amber-100 text-amber-600',
    },
    {
        title: 'Temperature Alert',
        description: '2 DO cold-chain butuh pengecekan real-time',
        action: 'Monitor IoT sensor',
        color: 'bg-sky-100 text-sky-600',
    },
    {
        title: 'Fuel Allowance',
        description: '3 driver belum submit klaim perjalanan',
        action: 'Reminder otomatis',
        color: 'bg-purple-100 text-purple-600',
    },
];

const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='6' />
        <path d='m20 20-3.5-3.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PhoneIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M6.5 3h2a1 1 0 0 1 1 .72c.23.92.65 2.19 1.3 3.5a1 1 0 0 1-.23 1.15L9.1 10.04c1.4 2.3 3.2 4.1 5.5 5.5l1.67-1.47a1 1 0 0 1 1.15-.23c1.3.65 2.58 1.07 3.5 1.3a1 1 0 0 1 .72 1v2a1 1 0 0 1-1.05 1 16 16 0 0 1-14.5-14.45A1 1 0 0 1 6.5 3z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const MapPinIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M12 3a6 6 0 0 1 6 6c0 4.5-6 12-6 12s-6-7.5-6-12a6 6 0 0 1 6-6z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='9' r='2' />
    </svg>
);

const TruckIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M3 7h11v8H3z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M14 11h3l2 2v3h-3' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='7.5' cy='19' r='1.5' />
        <circle cx='16.5' cy='19' r='1.5' />
    </svg>
);

const ChevronDownIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='m6 9 6 6 6-6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const EditIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const UserAssignIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='9' cy='7' r='4' />
        <path d='M22 21v-2a4 4 0 0 0-3-3.87' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M16 3.13a4 4 0 0 1 0 7.75' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const CancelIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='10' />
        <path d='M15 9l-6 6' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M9 9l6 6' strokeLinecap='round' strokeLinejoin='round' />
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
    const style = statusStyles[status] ?? statusStyles.scheduled;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function PriorityPill({ priority }) {
    const styles = {
        critical: 'bg-rose-100 text-rose-600',
        high: 'bg-amber-100 text-amber-600',
        normal: 'bg-slate-100 text-slate-500',
    };

    const labels = {
        critical: 'Critical',
        high: 'High',
        normal: 'Normal',
    };

    const style = styles[priority] ?? styles.normal;

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${style}`}>
            {labels[priority] ?? 'Normal'}
        </span>
    );
}

function DeliveryOrderRow({ delivery, onEdit, onAssignDriver, onCancel }) {
    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800'>{delivery.id}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p className='font-semibold text-slate-700'>{delivery.customer}</p>
                    <p className='text-xs text-slate-400'>Manifest: {delivery.manifestId}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='flex flex-col gap-1'>
                    <span className='font-medium text-slate-700'>{delivery.route}</span>
                    <span className='text-xs text-slate-400'>Keberangkatan: {delivery.departure}</span>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                        <TruckIcon className='h-4 w-4 text-slate-400' />
                        <span>{delivery.vehicle}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <PhoneIcon className='h-4 w-4 text-slate-400' />
                        <span>{delivery.driver}</span>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4'>
                <StatusBadge status={delivery.status} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p className='font-semibold text-slate-700'>{delivery.packages} koli</p>
                    <p className='text-xs text-slate-400'>ETA {delivery.eta}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <PriorityPill priority={delivery.priority} />
                    <p className='text-xs text-slate-400'>{delivery.temperature}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-right text-xs text-slate-400'>{delivery.lastUpdate}</td>
            <td className='px-6 py-4'>
                <div className='flex items-center justify-center gap-2'>
                    <button
                        type='button'
                        title='Edit'
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit(delivery);
                        }}
                        className='inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600'
                    >
                        <EditIcon className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        title='Assign Driver'
                        onClick={(e) => {
                            e.preventDefault();
                            onAssignDriver(delivery);
                        }}
                        className='inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-600'
                    >
                        <UserAssignIcon className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        title='Cancel'
                        onClick={(e) => {
                            e.preventDefault();
                            onCancel(delivery);
                        }}
                        className='inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-rose-600'
                    >
                        <CancelIcon className='h-4 w-4' />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function DeliveryOrderTable({
    records,
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
    onEdit,
    onAssignDriver,
    onCancel,
    onAddNew,
}) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm'>
            <div className='space-y-4'>
                <div className='flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between'>
                    <div>
                        <h2 className='text-lg font-semibold text-slate-900'>Delivery Order & Status Tracking</h2>
                        <p className='text-sm text-slate-400'>Monitoring real-time armada, jadwal, dan bukti kirim.</p>
                    </div>
                </div>
                
                {/* Search and Filters Section */}
                <div className='space-y-3'>
                    {/* Search Bar */}
                    <div className='group relative w-full'>
                        <span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400'>
                            <SearchIcon className='h-4 w-4' />
                        </span>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder='Cari DO, manifest, driver...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    
                    {/* Filters and Add Button Row */}
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex flex-col gap-2 sm:flex-row sm:gap-3'>
                            <FilterDropdown
                                value={statusFilter}
                                onChange={onStatusChange}
                                options={statusFilterOptions}
                                widthClass='w-full sm:w-auto sm:min-w-[120px]'
                            />
                            <FilterDropdown
                                value={priorityFilter}
                                onChange={onPriorityChange}
                                options={priorityFilterOptions}
                                widthClass='w-full sm:w-auto sm:min-w-[140px]'
                            />
                        </div>
                        
                        {/* Add Button */}
                        <button
                            type='button'
                            onClick={onAddNew}
                            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 whitespace-nowrap'
                        >
                            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4 flex-shrink-0'>
                                <path d='M12 5v14' strokeLinecap='round' strokeLinejoin='round' />
                                <path d='M5 12h14' strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                            <span className='hidden sm:inline'>Tambah Delivery Order</span>
                            <span className='sm:hidden'>Tambah DO</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-4 overflow-x-auto -mx-4 sm:mx-0'>
                <div className='min-w-full inline-block align-middle'>
                    <table className='w-full min-w-[920px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Delivery Order</th>
                            <th className='px-6 py-3'>Customer</th>
                            <th className='px-6 py-3'>Rute</th>
                            <th className='px-6 py-3'>Armada & Driver</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Koli & ETA</th>
                            <th className='px-6 py-3'>Prioritas</th>
                            <th className='px-6 py-3 text-right'>Update Terakhir</th>
                            <th className='px-6 py-3 text-center'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {records.length > 0 ? (
                            records.map((delivery) => (
                                <DeliveryOrderRow 
                                    key={delivery.id} 
                                    delivery={delivery} 
                                    onEdit={onEdit}
                                    onAssignDriver={onAssignDriver}
                                    onCancel={onCancel}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada delivery order yang sesuai dengan filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </section>
    );
}

function DeliveryPerformanceCard() {
    return (
        <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-slate-900'>Kinerja Pengiriman</h3>
            <p className='mt-1 text-xs text-slate-400'>Update berdasarkan data 7 hari terakhir.</p>
            <div className='mt-6 space-y-5 text-sm text-slate-600'>
                {deliveryTimeline.map((item) => (
                    <div key={item.label} className='rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'>
                        <p className='text-xs text-slate-400'>{item.label}</p>
                        <p className='mt-1 text-lg font-semibold text-slate-900'>{item.value}</p>
                        <p className='text-xs text-indigo-500'>{item.detail}</p>
                    </div>
                ))}
            </div>
        </article>
    );
}

function IssueHighlightCard() {
    return (
        <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-slate-900'>Action Items Hari Ini</h3>
            <p className='mt-1 text-xs text-slate-400'>Prioritaskan tindak lanjut untuk menjaga SLA.</p>
            <ul className='mt-6 space-y-3 text-sm text-slate-600'>
                {issueHighlights.map((issue) => (
                    <li key={issue.title} className='flex items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'>
                        <div>
                            <p className='font-semibold text-slate-800'>{issue.title}</p>
                            <p className='text-xs text-slate-400'>{issue.description}</p>
                        </div>
                        <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${issue.color}`}>
                            {issue.action}
                        </span>
                    </li>
                ))}
            </ul>
        </article>
    );
}

function RouteMonitoringCard() {
    const checkpoints = [
        {
            route: 'JKT → SBY',
            progress: 68,
            status: 'Tiba di checkpoint Cirebon - 21:05',
        },
        {
            route: 'BDG → MAK',
            progress: 24,
            status: 'Loading & seal validation',
        },
        {
            route: 'SBY → DPS',
            progress: 100,
            status: 'POD diterima - 22:42',
        },
    ];

    return (
        <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-slate-900'>Tracking Checkpoints</h3>
            <p className='mt-1 text-xs text-slate-400'>Overview rute utama & persentase progress.</p>
            <ul className='mt-6 space-y-4 text-sm text-slate-600'>
                {checkpoints.map((item) => (
                    <li key={item.route} className='space-y-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'>
                        <div className='flex items-center justify-between'>
                            <span className='font-semibold text-slate-800'>{item.route}</span>
                            <span className='text-xs font-semibold text-indigo-500'>{item.progress}%</span>
                        </div>
                        <div className='h-2 overflow-hidden rounded-full bg-slate-200'>
                            <div className='h-full rounded-full bg-indigo-500' style={{ width: `${item.progress}%` }} />
                        </div>
                        <p className='text-xs text-slate-400'>{item.status}</p>
                    </li>
                ))}
            </ul>
        </article>
    );
}

function DeliveryChecklistCard() {
    const checklist = [
        {
            title: 'Proof of Delivery',
            description: 'Pastikan tanda tangan penerima & foto barang lengkap sebelum closing DO.',
            completed: true,
        },
        {
            title: 'Fuel & Toll Log',
            description: 'Driver wajib unggah struk untuk pencocokan biaya perjalanan.',
            completed: false,
        },
        {
            title: 'Temperature Report',
            description: 'Catatan suhu setiap 2 jam untuk barang cold-chain.',
            completed: true,
        },
    ];

    return (
        <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-slate-900'>Delivery Completion Checklist</h3>
            <p className='mt-1 text-xs text-slate-400'>Checklist otomatis sebelum DO ditutup.</p>
            <ul className='mt-5 space-y-3 text-sm text-slate-600'>
                {checklist.map((item) => (
                    <li key={item.title} className='flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'>
                        <span
                            className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                                item.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                        >
                            {item.completed ? '✔' : '•'}
                        </span>
                        <div>
                            <p className='font-semibold text-slate-700'>{item.title}</p>
                            <p className='text-xs text-slate-400'>{item.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </article>
    );
}

export default function DeliveryOrderContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    
    // Modal states
    const [editModal, setEditModal] = useState({ isOpen: false, delivery: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, delivery: null });
    const [assignDriverModal, setAssignDriverModal] = useState({ isOpen: false, delivery: null });
    const [isLoading, setIsLoading] = useState(false);

    // Add new delivery order handler
    const handleAddNew = () => {
        console.log('handleAddNew called');
        setEditModal({ isOpen: true, delivery: null });
    };

    // Edit modal handlers
    const handleEdit = (delivery) => {
        console.log('handleEdit called with delivery:', delivery);
        setEditModal({ isOpen: true, delivery });
    };

    const handleEditSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (editModal.delivery) {
                // Update existing delivery order
                console.log('Updating delivery order:', editModal.delivery.id, 'with data:', formData);
            } else {
                // Create new delivery order
                console.log('Creating new delivery order with data:', formData);
            }
            
            // Close modal
            setEditModal({ isOpen: false, delivery: null });
        } catch (error) {
            console.error('Error saving delivery order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClose = () => {
        setEditModal({ isOpen: false, delivery: null });
    };

    // Assign driver modal handlers
    const handleAssignDriver = (delivery) => {
        console.log('handleAssignDriver called with delivery:', delivery);
        setAssignDriverModal({ isOpen: true, delivery });
    };

    const handleAssignDriverSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Assign driver to delivery order (in real app, this would be an API call)
            console.log('Assigning driver to delivery order:', assignDriverModal.delivery.id, 'with data:', formData);
            
            // Close modal
            setAssignDriverModal({ isOpen: false, delivery: null });
        } catch (error) {
            console.error('Error assigning driver:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignDriverClose = () => {
        setAssignDriverModal({ isOpen: false, delivery: null });
    };

    // Delete modal handlers
    const handleCancel = (delivery) => {
        console.log('handleCancel called with delivery:', delivery);
        setDeleteModal({ isOpen: true, delivery });
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Cancel delivery order (in real app, this would be an API call)
            console.log('Cancelling delivery order:', deleteModal.delivery.id);
            
            // Close modal
            setDeleteModal({ isOpen: false, delivery: null });
        } catch (error) {
            console.error('Error cancelling delivery order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal({ isOpen: false, delivery: null });
    };

    // Mock data for dropdowns (in real app, this would come from API)
    const mockJobOrders = [
        { value: 'JO-2024-874', label: 'JO-2024-874 - PT Maju Jaya Logistics' },
        { value: 'JO-2024-861', label: 'JO-2024-861 - CV Sukses Mandiri' },
        { value: 'JO-2024-843', label: 'JO-2024-843 - UD Sumber Berkah' },
        { value: 'JO-2024-852', label: 'JO-2024-852 - PT Nusantara Sejahtera' }
    ];

    const mockManifests = [
        { value: 'MF-2024-231', label: 'MF-2024-231 - Jakarta DC → Surabaya Hub' },
        { value: 'MF-2024-229', label: 'MF-2024-229 - Bandung Hub → Makassar Hub' },
        { value: 'MF-2024-220', label: 'MF-2024-220 - Surabaya Hub → Denpasar Hub' },
        { value: 'MF-2024-224', label: 'MF-2024-224 - Jakarta DC → Medan Hub' }
    ];

    const mockDrivers = [
        { value: 'DRV-001', label: 'Ahmad Subandi' },
        { value: 'DRV-002', label: 'Budi Santoso' },
        { value: 'DRV-003', label: 'Dedi Hermawan' },
        { value: 'DRV-004', label: 'Hendra Wijaya' },
        { value: 'DRV-005', label: 'Rizki Pratama' },
        { value: 'DRV-006', label: 'Andi Setiawan' }
    ];

    const mockVehicles = [
        { value: 'VHC-001', label: 'B 9123 KJD (CDD Box)' },
        { value: 'VHC-002', label: 'B 5678 CD (Wingbox)' },
        { value: 'VHC-003', label: 'L 4455 GH (Engkel Box)' },
        { value: 'VHC-004', label: 'B 7788 ZX (Reefer Truck)' },
        { value: 'VHC-005', label: 'B 1234 AB (Container Truck)' },
        { value: 'VHC-006', label: 'D 5678 EF (Pickup Box)' }
    ];

    // Assign driver form fields    // Get delivery order form fields for creating new DO
    const getDeliveryOrderCreateFields = (formData = {}) => [
        {
            name: 'source_type',
            label: 'Tipe Sumber',
            type: 'select',
            required: true,
            options: [
                { value: 'JO', label: 'Job Order' },
                { value: 'MF', label: 'Manifest' }
            ]
        },
        {
            name: 'source_id',
            label: formData.source_type === 'JO' ? 'Pilih Job Order' : formData.source_type === 'MF' ? 'Pilih Manifest' : 'Pilih Sumber',
            type: 'select',
            required: true,
            options: formData.source_type === 'JO' ? mockJobOrders : 
                    formData.source_type === 'MF' ? mockManifests : []
        },
        {
            name: 'driver_id',
            label: 'Assign Driver',
            type: 'select',
            required: false,
            options: [{ value: '', label: '-- Pilih Driver (Opsional) --' }, ...mockDrivers]
        },
        {
            name: 'vehicle_id',
            label: 'Assign Kendaraan',
            type: 'select',
            required: false,
            options: [{ value: '', label: '-- Pilih Kendaraan (Opsional) --' }, ...mockVehicles]
        },
        {
            name: 'do_date',
            label: 'Tanggal DO',
            type: 'date',
            required: true
        }
    ];

    // Get delivery order form fields for editing existing DO
    const getDeliveryOrderEditFields = (delivery) => [
        {
            name: 'source_display',
            label: 'Sumber',
            type: 'text',
            required: false,
            readOnly: true,
            defaultValue: delivery?.jobOrder ? `Job Order: ${delivery.jobOrder}` : `Manifest: ${delivery.manifestId}`,
            description: 'Sumber DO tidak dapat diubah setelah dibuat'
        },
        {
            name: 'customer_display',
            label: 'Customer',
            type: 'text',
            required: false,
            readOnly: true,
            defaultValue: delivery?.customer || '',
            description: 'Data customer diambil dari sumber DO'
        },
        {
            name: 'route_display',
            label: 'Rute',
            type: 'text',
            required: false,
            readOnly: true,
            defaultValue: delivery?.route || '',
            description: 'Rute diambil dari sumber DO'
        },
        {
            name: 'packages_display',
            label: 'Ringkasan Barang',
            type: 'text',
            required: false,
            readOnly: true,
            defaultValue: delivery?.packages ? `${delivery.packages} koli` : '',
            description: 'Informasi barang diambil dari sumber DO'
        },
        {
            name: 'departure',
            label: 'Tanggal Keberangkatan',
            type: 'datetime-local',
            required: true,
            defaultValue: delivery?.departure ? convertDateTimeForInput(delivery.departure) : '',
            description: 'Tanggal dan waktu keberangkatan dapat diubah'
        },
        {
            name: 'eta',
            label: 'Estimasi Tiba (ETA)',
            type: 'datetime-local',
            required: true,
            defaultValue: delivery?.eta ? convertDateTimeForInput(delivery.eta) : '',
            description: 'Estimasi waktu tiba dapat diubah'
        },
        {
            name: 'driver_id',
            label: 'Driver',
            type: 'select',
            required: false,
            options: [
                { value: '', label: '-- Pilih Driver --' },
                { value: 'DRV-001', label: 'Ahmad Subandi' },
                { value: 'DRV-002', label: 'Budi Santoso' },
                { value: 'DRV-003', label: 'Dedi Hermawan' },
                { value: 'DRV-004', label: 'Hendra Wijaya' },
                { value: 'DRV-005', label: 'Rizki Pratama' },
                { value: 'DRV-006', label: 'Andi Setiawan' }
            ],
            defaultValue: getDriverIdFromName(delivery?.driver),
            description: 'Driver dapat diubah atau diganti'
        },
        {
            name: 'vehicle_id',
            label: 'Kendaraan',
            type: 'select',
            required: false,
            options: [
                { value: '', label: '-- Pilih Kendaraan --' },
                { value: 'VHC-001', label: 'B 9123 KJD (CDD Box)' },
                { value: 'VHC-002', label: 'B 5678 CD (Wingbox)' },
                { value: 'VHC-003', label: 'L 4455 GH (Engkel Box)' },
                { value: 'VHC-004', label: 'B 7788 ZX (Reefer Truck)' },
                { value: 'VHC-005', label: 'B 1234 AB (Container Truck)' },
                { value: 'VHC-006', label: 'D 5678 EF (Pickup Box)' }
            ],
            defaultValue: getVehicleIdFromName(delivery?.vehicle),
            description: 'Kendaraan dapat diubah atau diganti'
        },
        {
            name: 'priority',
            label: 'Prioritas',
            type: 'select',
            required: true,
            options: [
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High Priority' },
                { value: 'critical', label: 'Critical - Cold Chain' }
            ],
            defaultValue: delivery?.priority || 'normal',
            description: 'Prioritas pengiriman dapat diubah'
        },
        {
            name: 'notes',
            label: 'Catatan',
            type: 'textarea',
            required: false,
            rows: 3,
            defaultValue: delivery?.notes || '',
            placeholder: 'Catatan tambahan untuk delivery order ini',
            description: 'Catatan khusus untuk driver atau tim operasional'
        }
    ];

    // Helper function to convert datetime for input field
    const convertDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return '';
        try {
            // Handle different date formats
            let date;
            if (dateTimeString.includes('T')) {
                // ISO format
                date = new Date(dateTimeString);
            } else {
                // Format like "2024-01-17 08:30"
                date = new Date(dateTimeString.replace(' ', 'T'));
            }
            
            if (isNaN(date.getTime())) {
                console.error('Invalid date:', dateTimeString);
                return '';
            }
            
            return date.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Error converting datetime:', error);
            return '';
        }
    };

    // Helper function to get driver ID from driver name
    const getDriverIdFromName = (driverName) => {
        if (!driverName) return '';
        const driver = mockDrivers.find(d => d.label === driverName);
        return driver ? driver.value : '';
    };

    // Helper function to get vehicle ID from vehicle description
    const getVehicleIdFromName = (vehicleDesc) => {
        if (!vehicleDesc) return '';
        const vehicle = mockVehicles.find(v => v.label === vehicleDesc);
        return vehicle ? vehicle.value : '';
    };

    // Assign driver form fields
    const assignDriverFields = [
        {
            name: 'driver_id',
            label: 'Driver',
            type: 'select',
            required: true,
            options: [
                { value: 'DRV-001', label: 'Ahmad Subandi' },
                { value: 'DRV-002', label: 'Budi Santoso' },
                { value: 'DRV-003', label: 'Dedi Hermawan' },
                { value: 'DRV-004', label: 'Hendra Wijaya' },
                { value: 'DRV-005', label: 'Rizki Pratama' },
                { value: 'DRV-006', label: 'Andi Setiawan' }
            ]
        },
        {
            name: 'vehicle_id',
            label: 'Kendaraan',
            type: 'select',
            required: true,
            options: [
                { value: 'VHC-001', label: 'B 9123 KJD (CDD Box)' },
                { value: 'VHC-002', label: 'B 5678 CD (Wingbox)' },
                { value: 'VHC-003', label: 'L 4455 GH (Engkel Box)' },
                { value: 'VHC-004', label: 'B 7788 ZX (Reefer Truck)' },
                { value: 'VHC-005', label: 'B 1234 AB (Container Truck)' },
                { value: 'VHC-006', label: 'D 5678 EF (Pickup Box)' }
            ]
        },
        {
            name: 'notes',
            label: 'Catatan',
            type: 'textarea',
            required: false,
            placeholder: 'Catatan tambahan untuk assignment',
            rows: 3
        }
    ];

    const filteredRecords = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return deliveryRecords.filter((delivery) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                delivery.id.toLowerCase().includes(normalizedSearch) ||
                delivery.manifestId.toLowerCase().includes(normalizedSearch) ||
                delivery.driver.toLowerCase().includes(normalizedSearch) ||
                delivery.customer.toLowerCase().includes(normalizedSearch) ||
                delivery.route.toLowerCase().includes(normalizedSearch);

            const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || delivery.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [searchTerm, statusFilter, priorityFilter]);

    // Debug modal states
    console.log('Modal states:', {
        editModal: editModal.isOpen,
        deleteModal: deleteModal.isOpen,
        assignDriverModal: assignDriverModal.isOpen
    });

    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <DeliveryOrderTable
                records={filteredRecords}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                onEdit={handleEdit}
                onAssignDriver={handleAssignDriver}
                onCancel={handleCancel}
                onAddNew={handleAddNew}
            />
            <section className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <DeliveryPerformanceCard />
                <IssueHighlightCard />
                <RouteMonitoringCard />
            </section>
            <section className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <DeliveryChecklistCard />
                <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                    <h3 className='text-base font-semibold text-slate-900'>Catatan Operasional</h3>
                    <p className='mt-1 text-xs text-slate-400'>Insight penting dari tim lapangan hari ini.</p>
                    <ul className='mt-5 space-y-3 text-sm text-slate-600'>
                        <li className='rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'>
                            <p className='font-semibold text-slate-800'>Cold-chain</p>
                            <p className='text-xs text-slate-400'>Monitoring suhu DO-2024-298 tetap stabil di 3°C menggunakan sensor IoT.</p>
                        </li>
                        <li className='rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'>
                            <p className='font-semibold text-slate-800'>Rute Panjang</p>
                            <p className='text-xs text-slate-400'>Driver diminta update lokasi melalui aplikasi setiap 2 jam untuk lintasan lintas pulau.</p>
                        </li>
                        <li className='rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3'>
                            <p className='font-semibold text-slate-800'>Kesiapan Dokumen</p>
                            <p className='text-xs text-slate-400'>Tim CS menyiapkan template POD digital untuk customer enterprise.</p>
                        </li>
                    </ul>
                </article>
            </section>

            {editModal.isOpen && !editModal.delivery && (
                <DeliveryOrderModal
                    title="Tambah Delivery Order"
                    initialData={null}
                    isOpen={editModal.isOpen}
                    onClose={handleEditClose}
                    onSubmit={handleEditSubmit}
                    isLoading={isLoading}
                />
            )}

            {editModal.isOpen && editModal.delivery && (
                <EditModal
                    title={`Edit Delivery Order - ${editModal.delivery.id}`}
                    fields={getDeliveryOrderEditFields(editModal.delivery)}
                    initialData={editModal.delivery}
                    isOpen={editModal.isOpen}
                    onClose={handleEditClose}
                    onSubmit={handleEditSubmit}
                    isLoading={isLoading}
                />
            )}

            {assignDriverModal.isOpen && (
                <EditModal
                    title={`Assign Driver - ${assignDriverModal.delivery?.id}`}
                    fields={assignDriverFields}
                    initialData={{}}
                    isOpen={assignDriverModal.isOpen}
                    onClose={handleAssignDriverClose}
                    onSubmit={handleAssignDriverSubmit}
                    isLoading={isLoading}
                />
            )}

            {deleteModal.isOpen && (
                <DeleteConfirmModal
                    title="Batalkan Delivery Order"
                    message={`Apakah Anda yakin ingin membatalkan delivery order "${deleteModal.delivery?.id}"? Tindakan ini tidak dapat dibatalkan!`}
                    isOpen={deleteModal.isOpen}
                    onClose={handleDeleteClose}
                    onConfirm={handleDeleteConfirm}
                    isLoading={isLoading}
                />
            )}
        </>
    );
}