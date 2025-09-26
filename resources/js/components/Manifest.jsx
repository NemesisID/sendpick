import React, { useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';

const summaryCards = [
    {
        title: 'Total Manifest',
        value: '342',
        description: 'Semua manifest aktif bulan ini',
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
        title: 'Packing Completed',
        value: '278',
        description: 'Selesai diverifikasi QC',
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
        title: 'Dalam Proses',
        value: '42',
        description: 'Menunggu loading kendaraan',
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
        title: 'Average Lead Time',
        value: '6h 20m',
        description: 'Dari receiving hingga dispatch',
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
    inProgress: {
        label: 'In Progress',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    released: {
        label: 'Released',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
};

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'released', label: 'Released' },
    { value: 'completed', label: 'Completed' },
];

const hubFilterOptions = [
    { value: 'all', label: 'Semua Hub' },
    { value: 'jakarta', label: 'Jakarta DC' },
    { value: 'surabaya', label: 'Surabaya Hub' },
    { value: 'bandung', label: 'Bandung Hub' },
];

const manifestRecords = [
    {
        id: 'MF-2024-231',
        jobOrder: 'JO-2024-874',
        customer: 'PT Maju Jaya Logistics',
        origin: 'Jakarta DC',
        destination: 'Surabaya Hub',
        shipmentDate: '2024-01-16',
        packages: 48,
        totalWeight: '1,250 kg',
        status: 'released',
        hub: 'jakarta',
        lastUpdate: '2024-01-15 19:45',
        createdBy: 'Novi Andini',
    },
    {
        id: 'MF-2024-229',
        jobOrder: 'JO-2024-861',
        customer: 'CV Sukses Mandiri',
        origin: 'Bandung Hub',
        destination: 'Makassar Hub',
        shipmentDate: '2024-01-16',
        packages: 36,
        totalWeight: '980 kg',
        status: 'inProgress',
        hub: 'bandung',
        lastUpdate: '2024-01-15 17:10',
        createdBy: 'Andi Pratama',
    },
    {
        id: 'MF-2024-224',
        jobOrder: 'JO-2024-852',
        customer: 'PT Nusantara Sejahtera',
        origin: 'Jakarta DC',
        destination: 'Medan Hub',
        shipmentDate: '2024-01-17',
        packages: 54,
        totalWeight: '1,540 kg',
        status: 'pending',
        hub: 'jakarta',
        lastUpdate: '2024-01-15 16:20',
        createdBy: 'Raka Firmansyah',
    },
    {
        id: 'MF-2024-220',
        jobOrder: 'JO-2024-843',
        customer: 'UD Sumber Berkah',
        origin: 'Surabaya Hub',
        destination: 'Denpasar Hub',
        shipmentDate: '2024-01-15',
        packages: 29,
        totalWeight: '720 kg',
        status: 'completed',
        hub: 'surabaya',
        lastUpdate: '2024-01-15 13:40',
        createdBy: 'Daisy Puspita',
    },
];

const pickListBreakdown = [
    { label: 'Elektronik & Sparepart', value: 112, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'FMCG & Retail', value: 96, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Dokumen & Arsip', value: 42, color: 'bg-amber-100 text-amber-600' },
    { label: 'Barang Fragile', value: 18, color: 'bg-rose-100 text-rose-600' },
];

const activityTimeline = [
    {
        time: '19:45',
        title: 'Manifest MF-2024-231 Released',
        description: 'QC Completed dan siap loading ke armada B 9123 KJD',
        actor: 'Novi Andini',
    },
    {
        time: '18:10',
        title: 'Packing Validation',
        description: '36 koli divalidasi untuk manifest MF-2024-229 (Bandung Hub)',
        actor: 'Andi Pratama',
    },
    {
        time: '16:20',
        title: 'Awaiting DO Assignment',
        description: 'Menunggu penjadwalan driver untuk MF-2024-224',
        actor: 'System',
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

const ChevronDownIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='m6 9 6 6 6-6' strokeLinecap='round' strokeLinejoin='round' />
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
    const style = statusStyles[status] ?? statusStyles.draft;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function ManifestRow({ manifest }) {
    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800'>{manifest.id}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p className='font-semibold text-slate-700'>{manifest.customer}</p>
                    <p className='text-xs text-slate-400'>Job Order: {manifest.jobOrder}</p>
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
                    <p>{manifest.packages} koli</p>
                    <p className='text-xs text-slate-400'>{manifest.totalWeight}</p>
                </div>
            </td>
            <td className='px-6 py-4'>
                <StatusBadge status={manifest.status} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{manifest.shipmentDate}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>{manifest.createdBy}</td>
            <td className='px-6 py-4 text-right text-xs text-slate-400'>{manifest.lastUpdate}</td>
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
}) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Daftar Manifest & Packing List</h2>
                    <p className='text-sm text-slate-400'>Pantau status packing, loading, dan release manifest.</p>
                </div>
                <div className='flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center'>
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
                    <button
                        type='button'
                        className='inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
                    >
                        <DownloadIcon className='h-4 w-4' />
                        Export CSV
                    </button>
                </div>
            </div>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[840px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Manifest</th>
                            <th className='px-6 py-3'>Customer</th>
                            <th className='px-6 py-3'>Tujuan</th>
                            <th className='px-6 py-3'>Koli & Berat</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Tgl Kirim</th>
                            <th className='px-6 py-3'>PIC</th>
                            <th className='px-6 py-3 text-right'>Update Terakhir</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {records.length > 0 ? (
                            records.map((manifest) => <ManifestRow key={manifest.id} manifest={manifest} />)
                        ) : (
                            <tr>
                                <td colSpan={8} className='px-6 py-12 text-center text-sm text-slate-400'>
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

function ManifestInsights() {
    return (
        <section className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <h3 className='text-base font-semibold text-slate-900'>Progress Packing Hari Ini</h3>
                <p className='mt-1 text-xs text-slate-400'>Update per jam 20:00 WIB</p>
                <div className='mt-6 space-y-5'>
                    {[
                        { label: 'Receiving & Quality Check', value: 82, color: 'bg-emerald-500' },
                        { label: 'Packing Completed', value: 64, color: 'bg-sky-500' },
                        { label: 'Menunggu Loading', value: 24, color: 'bg-amber-500' },
                    ].map((item) => (
                        <div key={item.label}>
                            <div className='flex items-center justify-between text-xs font-semibold text-slate-500'>
                                <span>{item.label}</span>
                                <span>{item.value}%</span>
                            </div>
                            <div className='mt-2 h-2 overflow-hidden rounded-full bg-slate-100'>
                                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </article>
            <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <h3 className='text-base font-semibold text-slate-900'>Kategori Packing List</h3>
                <p className='mt-1 text-xs text-slate-400'>Total 268 koli siap dikirim</p>
                <ul className='mt-6 space-y-3'>
                    {pickListBreakdown.map((item) => (
                        <li key={item.label} className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600'>
                            <span>{item.label}</span>
                            <span className={`inline-flex h-8 min-w-[48px] items-center justify-center rounded-2xl px-3 text-xs font-semibold ${item.color}`}>
                                {item.value}
                            </span>
                        </li>
                    ))}
                </ul>
            </article>
            <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <h3 className='text-base font-semibold text-slate-900'>Aktivitas Manifest Terbaru</h3>
                <ul className='mt-4 space-y-5 text-sm text-slate-600'>
                    {activityTimeline.map((activity) => (
                        <li key={activity.title} className='flex gap-3'>
                            <span className='mt-1 h-10 w-10 shrink-0 rounded-full bg-indigo-50 text-center text-xs font-semibold leading-10 text-indigo-600'>
                                {activity.time}
                            </span>
                            <div>
                                <p className='font-semibold text-slate-800'>{activity.title}</p>
                                <p className='text-xs text-slate-400'>{activity.description}</p>
                                <p className='mt-1 text-xs text-indigo-500'>oleh {activity.actor}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </article>
        </section>
    );
}

function PackingChecklistCard() {
    const checklistItems = [
        {
            title: 'Seal Number Validation',
            description: 'Pastikan nomor segel tercatat pada manifest & delivery order.',
            completed: true,
        },
        {
            title: 'Temperature Control',
            description: 'Catat suhu gudang untuk barang FMCG sebelum loading.',
            completed: true,
        },
        {
            title: 'Dokumen Pendukung',
            description: 'Invoice customer dan surat jalan sudah terlampir.',
            completed: false,
        },
    ];

    return (
        <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-slate-900'>Packing & Dispatch Checklist</h3>
            <p className='mt-1 text-xs text-slate-400'>Monitor kelengkapan sebelum manifest di-release.</p>
            <ul className='mt-5 space-y-3 text-sm text-slate-600'>
                {checklistItems.map((item) => (
                    <li
                        key={item.title}
                        className='flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3'
                    >
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

function ManifestSLAWidget() {
    const slaData = [
        { label: '≤ 6 Jam', value: '68%', description: 'Target SLA terpenuhi' },
        { label: '6-10 Jam', value: '24%', description: 'Butuh monitoring close follow-up' },
        { label: '> 10 Jam', value: '8%', description: 'Investigasi penyebab keterlambatan' },
    ];

    return (
        <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-slate-900'>Lead Time Manifest</h3>
            <p className='mt-1 text-xs text-slate-400'>Durasi rata-rata dari receiving ke dispatch.</p>
            <ul className='mt-6 space-y-4 text-sm text-slate-600'>
                {slaData.map((item) => (
                    <li key={item.label} className='flex items-start justify-between gap-3'>
                        <div>
                            <p className='font-semibold text-slate-700'>{item.label}</p>
                            <p className='text-xs text-slate-400'>{item.description}</p>
                        </div>
                        <span className='text-sm font-semibold text-indigo-600'>{item.value}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}

export default function ManifestContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [hubFilter, setHubFilter] = useState('all');

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
    }, [searchTerm, statusFilter, hubFilter]);

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
            />
            <ManifestInsights />
            <section className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <PackingChecklistCard />
                <ManifestSLAWidget />
            </section>
        </>
    );
}
