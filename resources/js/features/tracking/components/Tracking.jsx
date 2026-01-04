import React, { useMemo, useState } from 'react';
import FilterDropdown from '../../../components/common/FilterDropdown';
import LiveTrackingMap from './LiveTrackingMap';
import { useTracking } from '../hooks/useTracking';

// Status filter options
const statusFilters = [
    { value: 'all', label: 'Semua Status' },
    { value: 'onDelivery', label: 'On Delivery' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'delayed', label: 'Delayed' },
];

// Status badge styles
const statusStyles = {
    onDelivery: {
        label: 'On Delivery',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    pickup: {
        label: 'Pickup',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    delayed: {
        label: 'Delayed',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
    },
    completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
};

// Icons
const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='6' />
        <path d='m20 20-3.5-3.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const RefreshIcon = ({ className = 'h-4 w-4', spinning = false }) => (
    <svg 
        viewBox='0 0 24 24' 
        fill='none' 
        stroke='currentColor' 
        strokeWidth='1.5' 
        className={`${className} ${spinning ? 'animate-spin' : ''}`}
    >
        <path d='M4 4v5h5M20 20v-5h-5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M20.49 9A9 9 0 0 0 5.64 5.64L4 4m15.36 16.36A9 9 0 0 1 4.51 15L4 20' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

// KPI Card Component
function KPICard({ title, value, icon, iconBg, iconColor, isLoading }) {
    return (
        <article className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm'>
            <div>
                <p className='text-sm font-medium text-slate-400'>{title}</p>
                <p className='mt-3 text-3xl font-semibold text-slate-900'>
                    {isLoading ? (
                        <span className='inline-block w-12 h-8 bg-slate-200 rounded animate-pulse'></span>
                    ) : (
                        value
                    )}
                </p>
            </div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}>
                {icon}
            </div>
        </article>
    );
}

// Status Badge Component
function StatusBadge({ status }) {
    const style = statusStyles[status] ?? statusStyles.onDelivery;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

// Delivery Card Component
function DeliveryCard({ delivery, isSelected, onSelect }) {
    return (
        <article 
            className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition-all ${
                isSelected 
                    ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20' 
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md'
            }`}
            onClick={() => onSelect(delivery)}
        >
            <div className='flex items-start justify-between'>
                <div>
                    <p className='text-xs font-semibold text-slate-400'>{delivery.job_order_id || '-'}</p>
                    <h4 className='text-sm font-semibold text-slate-800'>{delivery.driver_name}</h4>
                    <div className='mt-2 space-y-1 text-xs text-slate-500'>
                        <p className='flex items-center gap-1'>
                            <span>🚗</span> {delivery.plate_no}
                        </p>
                        <p className='flex items-center gap-1'>
                            <span className={`w-2 h-2 rounded-full ${delivery.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {delivery.is_online ? 'Online' : 'Offline'}
                        </p>
                        <p className='text-slate-400'>Update: {delivery.time_ago || '-'}</p>
                    </div>
                </div>
                <StatusBadge status={delivery.status} />
            </div>
        </article>
    );
}

// Loading Skeleton for Delivery Cards
function DeliveryCardSkeleton() {
    return (
        <article className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse'>
            <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                    <div className='h-3 w-20 bg-slate-200 rounded'></div>
                    <div className='h-4 w-32 bg-slate-200 rounded'></div>
                    <div className='h-3 w-24 bg-slate-200 rounded mt-3'></div>
                    <div className='h-3 w-16 bg-slate-200 rounded'></div>
                </div>
                <div className='h-6 w-20 bg-slate-200 rounded-full'></div>
            </div>
        </article>
    );
}

// Empty State Component
function EmptyState({ message, submessage }) {
    return (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
            <svg className='w-16 h-16 text-slate-300 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' />
            </svg>
            <p className='text-sm font-medium text-slate-500'>{message}</p>
            {submessage && <p className='text-xs text-slate-400 mt-1'>{submessage}</p>}
        </div>
    );
}

// Error State Component
function ErrorState({ message, onRetry }) {
    return (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
            <svg className='w-16 h-16 text-rose-300 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
            <p className='text-sm font-medium text-slate-600'>{message}</p>
            <button 
                onClick={onRetry}
                className='mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium'
            >
                Coba lagi
            </button>
        </div>
    );
}

// Live Events Component (placeholder - will be connected to WebSocket later)
function LiveEventsTicker({ events = [] }) {
    const defaultEvents = [
        { id: 1, time: '-', message: 'Menunggu event real-time...', type: 'info' }
    ];
    
    const displayEvents = events.length > 0 ? events : defaultEvents;

    return (
        <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <h4 className='mb-3 text-sm font-semibold text-slate-800'>Live Updates</h4>
            <div className='space-y-3'>
                {displayEvents.map((event) => (
                    <div key={event.id} className='flex gap-3 text-xs'>
                        <span className='font-mono font-medium text-slate-500'>{event.time}</span>
                        <span className={`font-medium ${
                            event.type === 'warning' ? 'text-amber-600' :
                            event.type === 'success' ? 'text-emerald-600' : 'text-slate-700'
                        }`}>
                            {event.message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Main Tracking Component
export default function TrackingContent() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    // Fetch tracking data with auto-refresh
    const { 
        driverLocations, 
        activeDeliveries, 
        allActiveDeliveries,
        metadata, 
        isLoading, 
        error, 
        lastRefresh,
        refresh 
    } = useTracking({ 
        autoRefresh: true, 
        refreshInterval: 30000,
        statusFilter 
    });

    // Filter deliveries by search term
    const filteredDeliveries = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        let filtered = statusFilter === 'all' ? allActiveDeliveries : activeDeliveries;
        
        if (term.length === 0) return filtered;
        
        return filtered.filter((delivery) => 
            delivery.job_order_id?.toLowerCase().includes(term) ||
            delivery.driver_name?.toLowerCase().includes(term) ||
            delivery.plate_no?.toLowerCase().includes(term)
        );
    }, [searchTerm, statusFilter, activeDeliveries, allActiveDeliveries]);

    // KPI data from metadata
    const kpiCards = [
        {
            title: 'Active Deliveries',
            value: metadata.active_deliveries || 0,
            iconBg: 'bg-sky-100',
            iconColor: 'text-sky-600',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-6 w-6'>
                    <path d='M3 7h11v9H3z' strokeLinecap='round' strokeLinejoin='round' />
                    <path d='M14 11h3l2 2v3h-5' strokeLinecap='round' strokeLinejoin='round' />
                    <circle cx='7' cy='18' r='1.5' />
                    <circle cx='17' cy='18' r='1.5' />
                </svg>
            ),
        },
        {
            title: 'Completed Today',
            value: metadata.completed_today || 0,
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-500',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-6 w-6'>
                    <circle cx='12' cy='12' r='8' />
                    <path d='m9 12 2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            ),
        },
        {
            title: 'Delayed',
            value: metadata.delayed || 0,
            iconBg: 'bg-rose-100',
            iconColor: 'text-rose-500',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-6 w-6'>
                    <path d='M12 4 3 19h18z' strokeLinecap='round' strokeLinejoin='round' />
                    <path d='M12 9v4' strokeLinecap='round' />
                    <circle cx='12' cy='15' r='1' fill='currentColor' stroke='none' />
                </svg>
            ),
        },
        {
            title: 'Online Drivers',
            value: metadata.online_drivers || 0,
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-500',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-6 w-6'>
                    <path d='M12 7a5 5 0 0 1 5 5c0 3-5 7-5 7s-5-4-5-7a5 5 0 0 1 5-5z' strokeLinecap='round' strokeLinejoin='round' />
                    <circle cx='12' cy='12' r='1.5' />
                </svg>
            ),
        },
    ];

    // Format last refresh time
    const lastRefreshText = lastRefresh 
        ? `Update: ${lastRefresh.toLocaleTimeString('id-ID')}`
        : 'Memuat...';

    return (
        <div className='flex flex-col gap-8'>
            {/* Header */}
            <header className='flex items-center justify-between -mt-2'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold text-slate-900'>Real-Time Tracking</h1>
                    <p className='text-sm text-slate-500'>Monitor driver & vehicle locations in real-time</p>
                </div>
                <div className='flex items-center gap-3'>
                    <span className='text-xs text-slate-400'>{lastRefreshText}</span>
                    <button
                        type='button'
                        onClick={refresh}
                        disabled={isLoading}
                        className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-50'
                    >
                        <RefreshIcon spinning={isLoading} />
                        Refresh
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {kpiCards.map((card) => (
                    <KPICard 
                        key={card.title} 
                        {...card} 
                        isLoading={isLoading && !lastRefresh}
                    />
                ))}
            </section>

            {/* Main Content */}
            <section className='grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,320px)_1fr] xl:grid-cols-[minmax(0,360px)_1fr]'>
                {/* Sidebar - Delivery List */}
                <div className='w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                    <div className='flex flex-col gap-4'>
                        {/* Search */}
                        <div className='group relative'>
                            <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                                <SearchIcon />
                            </span>
                            <input
                                type='text'
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder='Cari driver, order, atau plat...'
                                className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                            />
                        </div>
                        {/* Filter */}
                        <FilterDropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilters}
                            widthClass='min-w-[160px]'
                        />
                    </div>
                    
                    {/* Delivery Cards */}
                    <div className='mt-6 space-y-4 max-h-[500px] overflow-y-auto'>
                        {error ? (
                            <ErrorState message={error} onRetry={refresh} />
                        ) : isLoading && !lastRefresh ? (
                            <>
                                <DeliveryCardSkeleton />
                                <DeliveryCardSkeleton />
                                <DeliveryCardSkeleton />
                            </>
                        ) : filteredDeliveries.length === 0 ? (
                            <EmptyState 
                                message="Tidak ada pengiriman aktif"
                                submessage="Data akan muncul saat driver memulai pengiriman"
                            />
                        ) : (
                            filteredDeliveries.map((delivery) => (
                                <DeliveryCard 
                                    key={delivery.driver_id} 
                                    delivery={delivery}
                                    isSelected={selectedDelivery?.driver_id === delivery.driver_id}
                                    onSelect={setSelectedDelivery}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Main Area - Map & Events */}
                <section className='flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                    <header className='flex items-center justify-between mb-4'>
                        <h3 className='text-sm font-semibold text-slate-700'>Live Map</h3>
                        <span className='text-xs text-slate-400'>
                            {metadata.online_drivers || 0} driver online • Auto-refresh 30s
                        </span>
                    </header>
                    
                    {/* Map */}
                    <div className='h-[350px] lg:h-[400px] overflow-hidden rounded-2xl border border-slate-200'>
                        <LiveTrackingMap 
                            driverLocations={driverLocations}
                            selectedDelivery={selectedDelivery}
                            showRoute={true}
                        />
                    </div>

                    {/* Live Events */}
                    <div className='mt-6'>
                        <LiveEventsTicker events={[]} />
                    </div>
                </section>
            </section>
        </div>
    );
}