import React, { useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';

const summaryCards = [
    {
        title: 'Total Order',
        value: '1,247',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        description: 'Semua jenis order',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M4 4h16' strokeLinecap='round' />
                <path d='M5 8h14v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M9 12h6M9 16h4' strokeLinecap='round' />
            </svg>
        ),
    },
    {
        title: 'Pending',
        value: '89',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        description: 'Menunggu konfirmasi',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='M12 8v4l2.5 1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'In Progress',
        value: '156',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-500',
        description: 'Dalam proses pengiriman',
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
        title: 'Completed',
        value: '1,002',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        description: 'Order selesai bulan ini',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='m9 12 2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const orderTabs = [
    { key: 'all', label: 'Semua Order', count: 3 },
    { key: 'jobOrder', label: 'Job Order', count: 1 },
    { key: 'manifest', label: 'Manifest', count: 1 },
    { key: 'delivery', label: 'Delivery Order', count: 1 },
];

const orderTypeStyles = {
    jobOrder: {
        label: 'Job Order',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    manifest: {
        label: 'Manifest',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    delivery: {
        label: 'Delivery Order',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
};

const statusStyles = {
    inProgress: {
        label: 'In Progress',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    pending: {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
};

const typeFilterOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'jobOrder', label: 'Job Order' },
    { value: 'manifest', label: 'Manifest' },
    { value: 'delivery', label: 'Delivery Order' },
];

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];

const orderRecords = [
    {
        id: 'JO-2024-001',
        type: 'jobOrder',
        customer: 'PT Maju Jaya',
        origin: 'Jakarta Selatan',
        destination: 'Bandung',
        commodity: 'Elektronik - 50 pcs',
        weight: '250 kg',
        driver: 'Ahmad Subandi',
        vehicle: 'B 1234 AB',
        status: 'inProgress',
        startDate: '2024-01-15',
        endDate: '2024-01-16',
        value: 'Rp 2.500.000',
    },
    {
        id: 'MF-2024-002',
        type: 'manifest',
        customer: 'CV Sukses Mandiri',
        origin: 'Jakarta Timur',
        destination: 'Surabaya',
        commodity: 'Tekstil - 100 pcs',
        weight: '500 kg',
        driver: '-',
        vehicle: '-',
        status: 'pending',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        value: 'Rp 3.200.000',
    },
    {
        id: 'DO-2024-003',
        type: 'delivery',
        customer: 'UD Berkah',
        origin: 'Jakarta Barat',
        destination: 'Medan',
        commodity: 'Makanan - 200 pcs',
        weight: '300 kg',
        driver: 'Budi Santoso',
        vehicle: 'B 5678 CD',
        status: 'completed',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        value: 'Rp 4.100.000',
    },
];

const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='6' />
        <path d='m20 20-3.5-3.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const EyeIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='12' r='3' />
    </svg>
);

const EditIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='m14.5 5.5 4 4' strokeLinecap='round' strokeLinejoin='round' />
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

function OrderTypeBadge({ type }) {
    const style = orderTypeStyles[type] ?? orderTypeStyles.jobOrder;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function StatusBadge({ status }) {
    const style = statusStyles[status] ?? statusStyles.inProgress;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function OrderRow({ order }) {
    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4'>
                <div className='text-sm font-semibold text-slate-800'>{order.id}</div>
                <p className='text-xs text-slate-400'>{orderTypeStyles[order.type]?.label ?? order.type}</p>
            </td>
            <td className='px-6 py-4'>
                <OrderTypeBadge type={order.type} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{order.customer}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='flex flex-col gap-1'>
                    <span>
                        <span className='inline-flex items-center gap-1 text-xs font-medium text-slate-500'>
                            <span className='h-2 w-2 rounded-full bg-emerald-500' />
                            {order.origin}
                        </span>
                    </span>
                    <span>
                        <span className='inline-flex items-center gap-1 text-xs font-medium text-slate-500'>
                            <span className='h-2 w-2 rounded-full bg-sky-500' />
                            {order.destination}
                        </span>
                    </span>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>{order.commodity}</p>
                    <p className='text-xs text-slate-400'>{order.weight}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>{order.driver}</p>
                    <p className='text-xs text-slate-400'>{order.vehicle}</p>
                </div>
            </td>
            <td className='px-6 py-4'>
                <StatusBadge status={order.status} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>{order.startDate}</p>
                    <p>{order.endDate}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm font-semibold text-slate-700'>{order.value}</td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Detail order ${order.id}`}
                    >
                        <EyeIcon />
                    </button>
                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Edit order ${order.id}`}
                    >
                        <EditIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function OrdersTable({ orders }) {
    return (
        <div className='mt-6 overflow-x-auto'>
            <table className='w-full min-w-[960px] border-collapse'>
                <thead>
                    <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                        <th className='px-6 py-3'>Order ID</th>
                        <th className='px-6 py-3'>Tipe</th>
                        <th className='px-6 py-3'>Customer</th>
                        <th className='px-6 py-3'>Route</th>
                        <th className='px-6 py-3'>Barang</th>
                        <th className='px-6 py-3'>Driver/Kendaraan</th>
                        <th className='px-6 py-3'>Status</th>
                        <th className='px-6 py-3'>Tanggal</th>
                        <th className='px-6 py-3'>Nilai</th>
                        <th className='px-6 py-3'>Aksi</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                    {orders.length > 0 ? (
                        orders.map((order) => <OrderRow key={order.id} order={order} />)
                    ) : (
                        <tr>
                            <td colSpan={10} className='px-6 py-12 text-center text-sm text-slate-400'>
                                Tidak ada order untuk filter saat ini.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function JobOrderContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');

    const filteredOrders = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return orderRecords.filter((order) => {
            const matchesSearch =
                term.length === 0 ||
                order.id.toLowerCase().includes(term) ||
                order.customer.toLowerCase().includes(term) ||
                order.origin.toLowerCase().includes(term) ||
                order.destination.toLowerCase().includes(term);
            const matchesType =
                (activeTab !== 'all' ? order.type === activeTab : true) &&
                (typeFilter === 'all' || order.type === typeFilter);
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [searchTerm, typeFilter, statusFilter, activeTab]);

    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='group relative flex-1'>
                        <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                            <SearchIcon />
                        </span>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder='Cari order, customer, atau lokasi...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <div className='flex flex-col gap-3 sm:flex-row'>
                        <FilterDropdown
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={typeFilterOptions}
                            widthClass='min-w-[160px]'
                        />
                        <FilterDropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilterOptions}
                            widthClass='min-w-[160px]'
                        />
                    </div>
                </div>
                <div className='mt-6 overflow-x-auto'>
                    <div className='inline-flex min-w-full rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-500'>
                        {orderTabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type='button'
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 rounded-xl px-4 py-2 transition ${
                                        isActive
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'hover:text-indigo-600'
                                    }`}
                                >
                                    {tab.label}
                                    <span className='ml-1 text-xs text-slate-400'>({tab.count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <OrdersTable orders={filteredOrders} />
            </section>
        </>
    );
}
