import React, { useMemo, useState, useEffect } from 'react';
import FilterDropdown from '../../../components/common/FilterDropdown';
import LiveTrackingMap from '../../tracking/components/LiveTrackingMap';
import { fetchActiveVehicles } from '../services/vehicleService';

// Generate real-time summary cards from active vehicles data
const generateSummaryCards = (vehicles = []) => {
    // Count vehicles on route (status = onRoute)
    const onRouteVehicles = vehicles.filter(v => v.status === 'onRoute').length;

    // Count idle vehicles (status = idle or assigned)
    const idleVehicles = vehicles.filter(v => v.status === 'idle' || v.status === 'assigned').length;

    // Count maintenance vehicles
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;

    // Calculate average utilization
    const totalVehicles = vehicles.length;
    const utilizationRate = totalVehicles > 0
        ? Math.round((onRouteVehicles / totalVehicles) * 100)
        : 0;

    return [
        {
            title: 'Kendaraan On-Route',
            value: onRouteVehicles.toString(),
            description: 'Sedang melakukan delivery',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                    <path d='M3 7h11v8H3z' strokeLinecap='round' strokeLinejoin='round' />
                    <path d='M14 11h3l3 3v3h-3' strokeLinecap='round' strokeLinejoin='round' />
                    <circle cx='7.5' cy='19' r='1.5' />
                    <circle cx='16.5' cy='19' r='1.5' />
                </svg>
            ),
        },
        {
            title: 'Siap Berangkat',
            value: idleVehicles.toString(),
            description: 'Idle < 30 menit',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-500',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                    <path d='M3 12l4 4L21 4' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            ),
        },
        {
            title: 'Maintenance Ringan',
            value: maintenanceVehicles.toString(),
            description: 'Terjadwal hari ini',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-500',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                    <path d='M10 2h4l2 3h5v4l-2 2 2 2v4h-5l-2 3h-4l-2-3H3v-4l2-2-2-2V5h5z' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            ),
        },
        {
            title: 'Utilisasi Rata-rata',
            value: `${utilizationRate}%`,
            description: '7 hari terakhir',
            iconBg: 'bg-sky-100',
            iconColor: 'text-sky-600',
            icon: (
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                    <path d='M4 19h16' strokeLinecap='round' />
                    <path d='M7 16v-5' strokeLinecap='round' />
                    <path d='M12 16V9' strokeLinecap='round' />
                    <path d='M17 16V6' strokeLinecap='round' />
                </svg>
            ),
        },
    ];
};

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'onRoute', label: 'On Route' },
    { value: 'loading', label: 'Loading/Pickup' },
    { value: 'idle', label: 'Idle' },
    { value: 'maintenance', label: 'Maintenance' },
];

const regionFilterOptions = [
    { value: 'all', label: 'Semua Area' },
    { value: 'jabodetabek', label: 'Jabodetabek' },
    { value: 'bandung', label: 'Bandung Raya' },
    { value: 'surabaya', label: 'Surabaya' },
];

const statusStyles = {
    onRoute: {
        label: 'On Route',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    loading: {
        label: 'Loading',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    idle: {
        label: 'Idle',
        bg: 'bg-slate-100',
        text: 'text-slate-500',
    },
    maintenance: {
        label: 'Maintenance',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
    },
    assigned: {
        label: 'Assigned',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
};

const utilizationSnapshots = [
    {
        id: 'util-001',
        label: 'Pemakaian Kendaraan',
        value: '82%',
        detail: 'Target 80%',
    },
    {
        id: 'util-002',
        label: 'Rata-rata Load',
        value: '4.1 Ton',
        detail: 'Pencapaian 7 hari',
    },
    {
        id: 'util-003',
        label: 'On-time Delivery',
        value: '94%',
        detail: 'QTD Performance',
    },
];

const SearchIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='7' />
        <path d='m16 16 4 4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

function SummaryCard({ card }) {
    return (
        <article className='flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
            </div>
            <div>
                <p className='text-sm text-slate-400'>{card.title}</p>
                <p className='mt-1 text-2xl font-semibold text-slate-900'>{card.value}</p>
                <p className='text-xs text-slate-500'>{card.description}</p>
            </div>
        </article>
    );
}

function StatusBadge({ status }) {
    const style = statusStyles[status] ?? statusStyles.onRoute;

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            <span className='h-2 w-2 rounded-full bg-current' />
            {style.label}
        </span>
    );
}

function ActiveVehicleRow({ item }) {
    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='px-6 py-4'>
                <div className='space-y-1'>
                    <p className='text-sm font-semibold text-slate-900'>{item.vehicle}</p>
                    <p className='text-xs text-slate-400'>Driver: {item.driver}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{item.route}</td>
            <td className='px-6 py-4 text-sm font-semibold text-slate-800'>{item.eta}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>{item.load}</td>
            <td className='px-6 py-4'>
                <StatusBadge status={item.status} />
            </td>
            <td className='px-6 py-4 text-xs text-slate-400'>{item.lastUpdate}</td>
        </tr>
    );
}

function ActiveVehicleTable({ items, loading }) {
    return (
        <div className='mt-6 overflow-x-auto'>
            <table className='w-full min-w-[960px] border-collapse'>
                <thead>
                    <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                        <th className='px-6 py-3'>Kendaraan</th>
                        <th className='px-6 py-3'>Rute</th>
                        <th className='px-6 py-3'>ETA</th>
                        <th className='px-6 py-3'>Load</th>
                        <th className='px-6 py-3'>Status</th>
                        <th className='px-6 py-3'>Update Terakhir</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className='px-6 py-12 text-center text-sm text-slate-400'>
                                Memuat data kendaraan...
                            </td>
                        </tr>
                    ) : items.length > 0 ? (
                        items.map((item) => <ActiveVehicleRow key={item.id} item={item} />)
                    ) : (
                        <tr>
                            <td colSpan={6} className='px-6 py-12 text-center text-sm text-slate-400'>
                                Tidak ada kendaraan dengan filter yang dipilih.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function UtilizationCard({ snapshot }) {
    return (
        <article className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='text-xs font-semibold uppercase tracking-wide text-indigo-500'>{snapshot.label}</p>
            <p className='mt-3 text-2xl font-semibold text-slate-900'>{snapshot.value}</p>
            <p className='mt-2 text-xs text-slate-400'>{snapshot.detail}</p>
        </article>
    );
}

export default function ActiveVehiclesContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const response = await fetchActiveVehicles();
                if (response.success) {
                    setVehicles(response.data);
                }
            } catch (error) {
                console.error('Error fetching active vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
        // Optional: Set up polling
        const interval = setInterval(loadVehicles, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const filteredVehicles = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return vehicles.filter((item) => {
            const matchesSearch =
                term.length === 0 ||
                item.vehicle.toLowerCase().includes(term) ||
                item.driver.toLowerCase().includes(term) ||
                item.route.toLowerCase().includes(term);

            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            const matchesRegion = regionFilter === 'all' || item.region === regionFilter;

            return matchesSearch && matchesStatus && matchesRegion;
        });
    }, [searchTerm, statusFilter, regionFilter, vehicles]);

    // Generate real-time summary cards from vehicles data
    const summaryCards = useMemo(() => generateSummaryCards(vehicles), [vehicles]);

    return (
        <div className='flex flex-col gap-8'>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>

            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h2 className='text-lg font-semibold text-slate-900'>Kendaraan Aktif</h2>
                        <p className='text-sm text-slate-400'>Monitor status armada secara real-time dan siap ambil aksi.</p>
                    </div>
                    <div className='flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center'>
                        <div className='group relative min-w-[260px] flex-1'>
                            <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                                <SearchIcon />
                            </span>
                            <input
                                type='text'
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder='Cari plat, driver, atau rute...'
                                className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                            />
                        </div>
                        <FilterDropdown
                            value={regionFilter}
                            onChange={setRegionFilter}
                            options={regionFilterOptions}
                            widthClass='w-full sm:w-48'
                        />
                        <FilterDropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilterOptions}
                            widthClass='w-full sm:w-48'
                        />
                    </div>
                </div>
                <ActiveVehicleTable items={filteredVehicles} loading={loading} />
            </section>

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-1'>
                <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-sm font-semibold text-slate-800'>Live Map Snapshot</h3>
                            <p className='text-xs text-slate-400'>Real-time vehicle positions.</p>
                        </div>
                        <span className='text-xs font-semibold text-slate-400'>Update per 30 detik</span>
                    </div>
                    <div className='mt-4 flex h-96 overflow-hidden rounded-2xl border border-slate-200'>
                        <LiveTrackingMap />
                    </div>
                </article>
            </section>
        </div>
    );
}