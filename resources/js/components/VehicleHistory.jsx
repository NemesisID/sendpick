import React, { useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';

const summaryCards = [
    {
        title: 'Pengiriman Selesai',
        value: '128',
        description: '30 hari terakhir',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 12l4 4L21 4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Downtime Armada',
        value: '18 jam',
        description: 'Gabungan semua unit',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='M12 8v4l3 2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Biaya Operasional',
        value: 'Rp 87,4 jt',
        description: 'Periode yang dipilih',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M12 1v22' strokeLinecap='round' />
                <path d='M17 5H9.5A3.5 3.5 0 0 0 6 8.5 3.5 3.5 0 0 0 9.5 12H14a3 3 0 0 1 0 6H6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Maintenance Tuntas',
        value: '12',
        description: 'Termasuk servis ringan',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='m3 3 3 3 3-3' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M6 2v9a4 4 0 0 0 4 4h1' strokeLinecap='round' strokeLinejoin='round' />
                <path d='m21 14-3-3-3 3' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M18 21v-9a4 4 0 0 0-4-4h-1' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const timeFilterOptions = [
    { value: '30d', label: '30 Hari Terakhir' },
    { value: '90d', label: '90 Hari Terakhir' },
    { value: '12m', label: '12 Bulan Terakhir' },
    { value: 'all', label: 'Semua Waktu' },
];

const activityFilterOptions = [
    { value: 'all', label: 'Semua Aktivitas' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'incident', label: 'Insiden' },
];

const statusStyles = {
    delivery: {
        label: 'Delivery',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    maintenance: {
        label: 'Maintenance',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    incident: {
        label: 'Insiden',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
    },
};

const historyRecords = [
    {
        id: 'hist-001',
        date: '12 Jan 2024',
        vehicle: 'B 1234 AB',
        driver: 'Ahmad Subandi',
        activity: 'Delivery selesai - PT Maju Jaya',
        status: 'delivery',
        cost: 'Rp 1,2 jt',
        location: 'Jakarta - Bandung',
        daysAgo: 8,
    },
    {
        id: 'hist-002',
        date: '10 Jan 2024',
        vehicle: 'B 9981 SPM',
        driver: 'Dewi Anggraini',
        activity: 'Servis berkala 10.000 km',
        status: 'maintenance',
        cost: 'Rp 4,8 jt',
        location: 'Workshop BSD',
        daysAgo: 10,
    },
    {
        id: 'hist-003',
        date: '4 Jan 2024',
        vehicle: 'B 5678 CD',
        driver: 'Budi Santoso',
        activity: 'Insiden ban pecah - penanganan darurat',
        status: 'incident',
        cost: 'Rp 650 rb',
        location: 'Tol Cipularang KM 72',
        daysAgo: 16,
    },
    {
        id: 'hist-004',
        date: '18 Des 2023',
        vehicle: 'D 8876 KX',
        driver: 'Siti Kurnia',
        activity: 'Delivery selesai - PT Sejahtera',
        status: 'delivery',
        cost: 'Rp 950 rb',
        location: 'Surabaya',
        daysAgo: 33,
    },
    {
        id: 'hist-005',
        date: '9 Des 2023',
        vehicle: 'B 4321 ZZ',
        driver: 'Rudi Hartono',
        activity: 'Penggantian oli & filter',
        status: 'maintenance',
        cost: 'Rp 1,7 jt',
        location: 'Bengkel Mitra - Bekasi',
        daysAgo: 42,
    },
];

const recapHighlights = [
    {
        id: 'recap-001',
        title: 'Utilisasi Armada',
        value: '89%',
        change: '+4% mom',
        description: 'Rata-rata beban kerja kendaraan selama periode terpilih.',
    },
    {
        id: 'recap-002',
        title: 'Rata-rata Downtime',
        value: '1.5 jam/unit',
        change: '-22% mom',
        description: 'Perbandingan dengan periode sebelumnya.',
    },
    {
        id: 'recap-003',
        title: 'Lead Time Pengiriman',
        value: '7 jam',
        change: '+12% mom',
        description: 'Waktu rata-rata dari pickup ke delivery.',
    },
];

const maintenancePipeline = [
    {
        id: 'mt-001',
        vehicle: 'B 7712 TK',
        schedule: '20 Jan 2024',
        task: 'Servis berkala + balancing roda',
        garage: 'Bengkel Mitra - Depok',
    },
    {
        id: 'mt-002',
        vehicle: 'F 9081 LP',
        schedule: '24 Jan 2024',
        task: 'Penggantian kampas rem',
        garage: 'Workshop Internal',
    },
    {
        id: 'mt-003',
        vehicle: 'B 2165 XR',
        schedule: '27 Jan 2024',
        task: 'Kalibrasi GPS & sensor bahan bakar',
        garage: 'Vendor Teknologi',
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
    const style = statusStyles[status] ?? statusStyles.delivery;

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            <span className='h-2 w-2 rounded-full bg-current' />
            {style.label}
        </span>
    );
}

function HistoryRow({ record }) {
    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='px-6 py-4'>
                <p className='text-sm font-semibold text-slate-900'>{record.date}</p>
                <p className='text-xs text-slate-400'>{record.location}</p>
            </td>
            <td className='px-6 py-4'>
                <div className='space-y-1'>
                    <p className='text-sm font-semibold text-slate-800'>{record.vehicle}</p>
                    <p className='text-xs text-slate-400'>Driver: {record.driver}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{record.activity}</td>
            <td className='px-6 py-4'>
                <StatusBadge status={record.status} />
            </td>
            <td className='px-6 py-4 text-sm font-semibold text-slate-800'>{record.cost}</td>
        </tr>
    );
}

function HistoryTable({ records, searchTerm, onSearchChange, statusFilter, onStatusChange, timeFilter, onTimeChange }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Histori Armada</h2>
                    <p className='text-sm text-slate-400'>Ringkasan aktivitas operasional dan perawatan kendaraan.</p>
                </div>
                <div className='flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center'>
                    <div className='group relative min-w-[260px] flex-1'>
                        <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                            <SearchIcon />
                        </span>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder='Cari plat, driver, atau aktivitas...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <FilterDropdown
                        value={timeFilter}
                        onChange={onTimeChange}
                        options={timeFilterOptions}
                        widthClass='w-full sm:w-48'
                    />
                    <FilterDropdown
                        value={statusFilter}
                        onChange={onStatusChange}
                        options={activityFilterOptions}
                        widthClass='w-full sm:w-48'
                    />
                </div>
            </div>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[880px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Tanggal & Lokasi</th>
                            <th className='px-6 py-3'>Kendaraan</th>
                            <th className='px-6 py-3'>Aktivitas</th>
                            <th className='px-6 py-3'>Kategori</th>
                            <th className='px-6 py-3'>Biaya</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {records.length > 0 ? (
                            records.map((record) => <HistoryRow key={record.id} record={record} />)
                        ) : (
                            <tr>
                                <td colSpan={5} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada histori pada filter saat ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function RecapCard({ highlight }) {
    return (
        <article className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200'>
            <p className='text-xs font-semibold uppercase tracking-wide text-indigo-500'>{highlight.title}</p>
            <p className='mt-3 text-2xl font-semibold text-slate-900'>{highlight.value}</p>
            <span className='mt-1 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600'>
                {highlight.change}
            </span>
            <p className='mt-3 text-sm text-slate-500'>{highlight.description}</p>
        </article>
    );
}

function MaintenanceItem({ item }) {
    return (
        <div className='flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
            <div>
                <p className='text-sm font-semibold text-slate-900'>{item.vehicle}</p>
                <p className='text-xs text-slate-400'>{item.task}</p>
            </div>
            <div className='mt-3 flex flex-col gap-1 text-xs text-slate-500 sm:mt-0 sm:text-right'>
                <span className='font-semibold text-slate-700'>{item.schedule}</span>
                <span>{item.garage}</span>
            </div>
        </div>
    );
}

export default function VehicleHistoryContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('30d');

    const filteredRecords = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return historyRecords.filter((record) => {
            const matchesSearch =
                term.length === 0 ||
                record.vehicle.toLowerCase().includes(term) ||
                record.driver.toLowerCase().includes(term) ||
                record.activity.toLowerCase().includes(term);

            const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

            const matchesTime =
                timeFilter === 'all' ||
                (timeFilter === '30d' && record.daysAgo <= 30) ||
                (timeFilter === '90d' && record.daysAgo <= 90) ||
                (timeFilter === '12m' && record.daysAgo <= 365);

            return matchesSearch && matchesStatus && matchesTime;
        });
    }, [searchTerm, statusFilter, timeFilter]);

    return (
        <div className='flex flex-col gap-8'>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>

            <HistoryTable
                records={filteredRecords}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                timeFilter={timeFilter}
                onTimeChange={setTimeFilter}
            />

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-sm font-semibold text-slate-800'>Recap Insight</h3>
                            <p className='text-xs text-slate-400'>Perbandingan performa operasional periode terpilih.</p>
                        </div>
                        <span className='text-xs font-semibold text-slate-400'>Auto update mingguan</span>
                    </div>
                    <div className='mt-5 grid grid-cols-1 gap-4'>
                        {recapHighlights.map((highlight) => (
                            <RecapCard key={highlight.id} highlight={highlight} />
                        ))}
                    </div>
                </section>
                <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h3 className='text-sm font-semibold text-slate-800'>Maintenance Mendatang</h3>
                            <p className='text-xs text-slate-400'>Pastikan unit siap jalan sesuai jadwal.</p>
                        </div>
                        <button
                            type='button'
                            className='text-xs font-semibold text-indigo-600 transition hover:text-indigo-500'
                        >
                            Lihat semua
                        </button>
                    </div>
                    <div className='mt-4 space-y-3 max-h-64 overflow-y-auto'>
                        {maintenancePipeline.slice(0, 3).map((item) => (
                            <MaintenanceItem key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            </section>
        </div>
    );
}
