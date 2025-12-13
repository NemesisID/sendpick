import React, { useMemo, useState } from 'react';
import FilterDropdown from '../../../components/common/FilterDropdown';
import DeliveryOrderModal from '../../../components/common/DeliveryOrderModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import EditModal from '../../../components/common/EditModal';
import DeliveryOrderDetailModal from './DeliveryOrderDetailModal';
import { useDeliveryOrders } from '../hooks/useDeliveryOrders';

const summaryCardsBase = [
    {
        key: 'total',
        title: 'Total Delivery Order',
        value: '0',
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
        key: 'delivered',
        title: 'Sudah Terkirim',
        value: '0',
        description: '0% dari total pengiriman',
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
        key: 'inTransit',
        title: 'Dalam Perjalanan',
        value: '0',
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
        key: 'exception',
        title: 'Exception',
        value: '0',
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

const DO_STATUS_MAP = {
    pending: 'scheduled',
    assigned: 'loading',
    'in transit': 'inTransit',
    delivered: 'delivered',
    completed: 'delivered',
    cancelled: 'exception',
};

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
    { value: 'Pending', label: 'Pending' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Completed', label: 'Completed' },
];

const priorityFilterOptions = [
    { value: 'all', label: 'Semua Prioritas' },
    { value: 'critical', label: 'Critical - Cold Chain' },
    { value: 'high', label: 'High Priority' },
    { value: 'normal', label: 'Normal' },
];

const alertFilterOptions = [
    { value: 'all', label: 'Semua Alert' },
    { value: 'pending_pod', label: 'Pending POD' },
    { value: 'late', label: 'Keterlambatan' },
];

const normalizeStatus = (status) => {
    if (!status) return 'scheduled';
    const key = status.toString().toLowerCase();
    return DO_STATUS_MAP[key] ?? 'scheduled';
};

const mapDeliveryOrderFromApi = (deliveryOrder) => {
    if (!deliveryOrder) return null;

    const sourceInfo = deliveryOrder.source_info ?? {};
    const customerName = deliveryOrder.customer?.customer_name ?? sourceInfo.customer_name ?? '-';

    // Fix Route: Handle both Manifest (origin_city) and JobOrder (pickup_city) fields
    const origin = sourceInfo.origin_city ?? sourceInfo.pickup_city ?? sourceInfo.origin ?? '-';
    const destination = sourceInfo.dest_city ?? sourceInfo.delivery_city ?? sourceInfo.destination ?? '-';
    const route = origin && destination && origin !== '-' && destination !== '-' ? `${origin} → ${destination}` : '-';

    // Fix Source Label
    const isJobOrder = deliveryOrder.source_type === 'JO';
    const sourceLabel = isJobOrder ? `Job Order: ${deliveryOrder.source_id}` : `Manifest: ${deliveryOrder.source_id}`;

    // Fix Date Format: Remove time
    const departureDate = deliveryOrder.departure ?? deliveryOrder.do_date;
    const formattedDeparture = departureDate ? new Date(departureDate).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-';

    // Fix Koli & Goods Info
    // extracting weight, qty, and description separately as requested
    const weight = sourceInfo.goods_weight ?? sourceInfo.weight ?? deliveryOrder.weight ?? '-';
    const qty = sourceInfo.quantity ?? sourceInfo.koli ?? deliveryOrder.quantity ?? sourceInfo.goods_quantity ?? '-';
    // Use goods_summary first, then sourceInfo.goods_desc
    const goodsDesc = deliveryOrder.goods_summary || sourceInfo.goods_desc || '-';

    // Fix ETA: Real-time from Tracking
    const status = normalizeStatus(deliveryOrder.status);
    let eta = '-';

    if (status === 'inTransit') {
        eta = deliveryOrder.eta || 'Estimating...';
    }

    return {
        id: deliveryOrder.do_id ?? deliveryOrder.id,
        manifestId: deliveryOrder.source_type === 'MF' ? deliveryOrder.source_id : '-',
        jobOrder: deliveryOrder.source_type === 'JO' ? deliveryOrder.source_id : '-',
        sourceLabel: sourceLabel,
        customer: customerName,
        driver: deliveryOrder.driver_name ?? deliveryOrder.assigned_driver ?? 'Belum ditugaskan',
        vehicle: deliveryOrder.vehicle_plate ?? deliveryOrder.assigned_vehicle ?? 'Belum ditugaskan',
        route,
        eta: eta,
        departure: formattedDeparture,
        status: status,
        backendStatus: deliveryOrder.status ?? 'Pending',
        weight: weight,
        qty: qty,
        goods_desc: goodsDesc,
        lastUpdate: deliveryOrder.updated_at ? new Date(deliveryOrder.updated_at).toLocaleString('id-ID') : '-',

        priority: (deliveryOrder.priority ?? 'normal').toLowerCase(),
        raw: deliveryOrder,
    };
};


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

const ViewDetailIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='12' r='3' strokeLinecap='round' strokeLinejoin='round' />
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

function DeliveryOrderRow({ delivery, onEdit, onViewDetail, onCancel }) {
    const isReadOnly = delivery.status === 'exception';

    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800'>{delivery.id}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p className='font-semibold text-slate-700'>{delivery.customer}</p>
                    <p className='text-xs text-slate-400'>{delivery.sourceLabel}</p>
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
                <div className='space-y-0.5'>
                    <p className='font-semibold text-slate-700'>
                        {delivery.weight} Kg • {delivery.qty} Koli
                    </p>
                    <p className='text-xs text-slate-500 truncate max-w-[180px]' title={delivery.goods_desc}>
                        {delivery.goods_desc}
                    </p>
                    <p className='text-xs text-slate-400'>ETA {delivery.eta}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='flex items-center'>
                    <PriorityPill priority={delivery.priority} />
                </div>
            </td>
            <td className='px-6 py-4 text-right text-xs text-slate-400'>{delivery.lastUpdate}</td>
            <td className='px-6 py-4'>
                <div className='flex items-center justify-center gap-2'>
                    <button
                        type='button'
                        title={isReadOnly ? 'Read-only' : 'Edit'}
                        disabled={isReadOnly}
                        onClick={(e) => {
                            if (isReadOnly) return;
                            e.preventDefault();
                            onEdit(delivery);
                        }}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${isReadOnly
                            ? 'cursor-not-allowed text-slate-300'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-indigo-600'
                            }`}
                    >
                        <EditIcon className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        title='Lihat Detail'
                        onClick={(e) => {
                            e.preventDefault();
                            onViewDetail(delivery);
                        }}
                        className='inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-600'
                    >
                        <ViewDetailIcon className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        title={isReadOnly ? 'Read-only' : 'Cancel'}
                        disabled={isReadOnly}
                        onClick={(e) => {
                            if (isReadOnly) return;
                            e.preventDefault();
                            onCancel(delivery);
                        }}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${isReadOnly
                            ? 'cursor-not-allowed text-slate-300'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-rose-600'
                            }`}
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
    alertFilter,
    onAlertChange,
    onEdit,
    onViewDetail,
    onCancel,
    onAddNew,
    loading,
    error,
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
                            <FilterDropdown
                                value={alertFilter}
                                onChange={onAlertChange}
                                options={alertFilterOptions}
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
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className='px-6 py-12 text-center text-sm text-slate-400'>
                                        Memuat data delivery order...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={9} className='px-6 py-12 text-center text-sm text-rose-500'>
                                        {error}
                                    </td>
                                </tr>
                            ) : records.length > 0 ? (
                                records.map((delivery) => (
                                    <DeliveryOrderRow
                                        key={delivery.id}
                                        delivery={delivery}
                                        onEdit={onEdit}
                                        onViewDetail={onViewDetail}
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



export default function DeliveryOrderContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [alertFilter, setAlertFilter] = useState('all');

    // Modal states
    const [editModal, setEditModal] = useState({ isOpen: false, delivery: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, delivery: null });
    const [detailModal, setDetailModal] = useState({ isOpen: false, delivery: null });
    const [assignDriverModal, setAssignDriverModal] = useState({ isOpen: false, delivery: null });
    const [isLoading, setIsLoading] = useState(false);

    const {
        deliveryOrders,
        loading,
        error,
        createDeliveryOrder,
        updateDeliveryOrder,
        deleteDeliveryOrder,
        cancelDeliveryOrder,
        assignDriver,
        mutationState,
        resetMutationStatus,
    } = useDeliveryOrders({ per_page: 50 });

    const computedRecords = useMemo(() => {
        if (!Array.isArray(deliveryOrders)) return [];
        return deliveryOrders.map(mapDeliveryOrderFromApi).filter(Boolean);
    }, [deliveryOrders]);

    const summaryCards = useMemo(() => {
        if (!computedRecords.length) return summaryCardsBase;

        const totals = computedRecords.reduce(
            (acc, item) => {
                acc.total += 1;
                if (item.backendStatus === 'Delivered' || item.backendStatus === 'Completed') acc.delivered += 1;
                if (item.backendStatus === 'In Transit') acc.inTransit += 1;
                if (item.backendStatus === 'Cancelled') acc.exception += 1;
                return acc;
            },
            { total: 0, delivered: 0, inTransit: 0, exception: 0 },
        );

        return summaryCardsBase.map((card) => {
            if (card.key === 'total') return { ...card, value: totals.total.toString() };
            if (card.key === 'delivered') {
                const percentage = totals.total ? Math.round((totals.delivered / totals.total) * 100) : 0;
                return { ...card, value: totals.delivered.toString(), description: `${percentage}% dari total pengiriman` };
            }
            if (card.key === 'inTransit') return { ...card, value: totals.inTransit.toString() };
            if (card.key === 'exception') return { ...card, value: totals.exception.toString() };
            return card;
        });
    }, [computedRecords]);

    const handleAddNew = () => {
        resetMutationStatus();
        setEditModal({ isOpen: true, delivery: null });
    };

    const handleEdit = (delivery) => {
        resetMutationStatus();
        setEditModal({ isOpen: true, delivery });
    };

    const handleEditSubmit = async (formData) => {
        setIsLoading(true);
        try {
            if (editModal.delivery) {
                await updateDeliveryOrder(editModal.delivery.id, formData);
            } else {
                await createDeliveryOrder(formData);
            }
            setEditModal({ isOpen: false, delivery: null });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClose = () => {
        setEditModal({ isOpen: false, delivery: null });
    };

    const handleViewDetail = (delivery) => {
        setDetailModal({ isOpen: true, delivery });
    };

    const handleViewDetailClose = () => {
        setDetailModal({ isOpen: false, delivery: null });
    };

    const handleAssignDriver = (delivery) => {
        resetMutationStatus();
        setAssignDriverModal({ isOpen: true, delivery });
    };

    const handleAssignDriverSubmit = async (formData) => {
        if (!assignDriverModal.delivery) return;
        setIsLoading(true);
        try {
            await assignDriver(assignDriverModal.delivery.id, formData);
            setAssignDriverModal({ isOpen: false, delivery: null });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignDriverClose = () => {
        setAssignDriverModal({ isOpen: false, delivery: null });
    };

    const handleCancel = (delivery) => {
        resetMutationStatus();
        setDeleteModal({ isOpen: true, delivery });
    };

    const handleCancelConfirm = async () => {
        if (!deleteModal.delivery) return;
        setIsLoading(true);
        try {
            // Use cancelDeliveryOrder instead of deleteDeliveryOrder
            await cancelDeliveryOrder(deleteModal.delivery.id);
            setDeleteModal({ isOpen: false, delivery: null });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal({ isOpen: false, delivery: null });
    };

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
            options: []
        },
        {
            name: 'driver_id',
            label: 'Assign Driver',
            type: 'select',
            required: false,
            options: [{ value: '', label: '-- Pilih Driver (Opsional) --' }]
        },
        {
            name: 'vehicle_id',
            label: 'Assign Kendaraan',
            type: 'select',
            required: false,
            options: [{ value: '', label: '-- Pilih Kendaraan (Opsional) --' }]
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
            defaultValue: delivery?.raw?.departure
                ? convertDateTimeForInput(delivery.raw.departure)
                : delivery?.raw?.do_date
                    ? convertDateTimeForInput(delivery.raw.do_date)
                    : '',
            description: 'Tanggal dan waktu keberangkatan dapat diubah'
        },
        {
            name: 'eta',
            label: 'Estimasi Tiba (ETA)',
            type: 'datetime-local',
            required: true,
            defaultValue: delivery?.raw?.eta ? convertDateTimeForInput(delivery.raw.eta) : '',
            description: 'Estimasi waktu tiba dapat diubah'
        },
        {
            name: 'driver_id',
            label: 'Driver',
            type: 'select',
            required: false,
            options: [
                { value: '', label: '-- Pilih Driver --' },
                { value: '', label: '-- Pilih Driver --' }
            ],
            defaultValue: delivery?.raw?.assigned_driver_id ?? '',
            description: 'Driver dapat diubah atau diganti'
        },
        {
            name: 'vehicle_id',
            label: 'Kendaraan',
            type: 'select',
            required: false,
            options: [
                { value: '', label: '-- Pilih Kendaraan --' },
                { value: '', label: '-- Pilih Kendaraan --' }
            ],
            defaultValue: delivery?.raw?.assigned_vehicle_id ?? '',
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
        // Create date object (handling numeric timestamps or strings)
        const date = new Date(dateTimeString);

        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateTimeString);
            return '';
        }

        // Format manually to YYYY-MM-DDTHH:mm using local time
        // This avoids timezone shifts caused by toISOString() which converts to UTC
        const pad = (num) => String(num).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
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
            options: [{ value: '', label: '-- Pilih Driver --' }]
        },
        {
            name: 'vehicle_id',
            label: 'Kendaraan',
            type: 'select',
            required: true,
            options: [{ value: '', label: '-- Pilih Kendaraan --' }]
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

        return computedRecords.filter((delivery) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                delivery.id.toLowerCase().includes(normalizedSearch) ||
                delivery.manifestId.toLowerCase().includes(normalizedSearch) ||
                delivery.driver.toLowerCase().includes(normalizedSearch) ||
                delivery.customer.toLowerCase().includes(normalizedSearch) ||
                delivery.route.toLowerCase().includes(normalizedSearch);

            const matchesStatus = statusFilter === 'all' || delivery.backendStatus === statusFilter;
            const matchesPriority = priorityFilter === 'all' || delivery.priority === priorityFilter;

            let matchesAlert = true;
            if (alertFilter === 'pending_pod') {
                matchesAlert = delivery.backendStatus === 'Delivered' || delivery.backendStatus === 'Completed';
            } else if (alertFilter === 'late') {
                matchesAlert = delivery.backendStatus === 'Cancelled' || delivery.priority === 'critical';
            }

            return matchesSearch && matchesStatus && matchesPriority && matchesAlert;
        });
    }, [computedRecords, searchTerm, statusFilter, priorityFilter, alertFilter]);

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
                alertFilter={alertFilter}
                onAlertChange={setAlertFilter}
                onEdit={handleEdit}
                onViewDetail={handleViewDetail}
                onAssignDriver={handleAssignDriver}
                onCancel={handleCancel}
                onAddNew={handleAddNew}
                loading={loading}
                error={error}
            />


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

            {/* Cancel Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteClose}
                onConfirm={handleCancelConfirm}
                title='Batalkan Delivery Order'
                message={`Apakah Anda yakin ingin membatalkan Delivery Order ${deleteModal.delivery?.id}? Status akan berubah menjadi Cancelled.`}
                isLoading={isLoading || mutationState.deleting}
                confirmLabel="Ya, Batalkan"
                loadingLabel="Membatalkan..."
            />

            {/* Delivery Order Detail Modal */}
            {detailModal.isOpen && (
                <DeliveryOrderDetailModal
                    isOpen={detailModal.isOpen}
                    onClose={handleViewDetailClose}
                    data={detailModal.delivery}
                />
            )}
        </>
    );
}