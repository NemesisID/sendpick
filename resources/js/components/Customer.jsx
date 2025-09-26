import React, { useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';

const summaryCards = [
    {
        title: 'Total Pelanggan',
        value: '245',
        description: 'Termasuk corporate & individu',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1' strokeLinecap='round' strokeLinejoin='round' />
                <circle cx='10' cy='7' r='3' />
                <path d='M20 19v-1a4 4 0 0 0-2.62-3.73' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M16 4a3 3 0 1 1 0 6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Pelanggan Aktif',
        value: '198',
        description: '81% dari total pelanggan',
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
        title: 'Corporate',
        value: '89',
        description: 'Termasuk SME & enterprise',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 21V7l9-4 9 4v14' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M9 10h6M9 14h6M9 18h6' strokeLinecap='round' />
            </svg>
        ),
    },
    {
        title: 'Rata-rata Rating',
        value: '4.7',
        description: 'Dari 320 ulasan pelanggan',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='currentColor' stroke='none' className='h-5 w-5'>
                <path d='m12 4 2.2 4.5 5 .7-3.6 3.5.9 5.1L12 15.8 7.5 17.8l.9-5.1-3.6-3.5 5-.7z' />
            </svg>
        ),
    },
];

const customerTypeStyles = {
    corporate: {
        label: 'Corporate',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    sme: {
        label: 'SME',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    individual: {
        label: 'Individual',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
};

const customerStatusStyles = {
    active: {
        label: 'Aktif',
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        dot: 'bg-emerald-500',
    },
    inactive: {
        label: 'Tidak Aktif',
        text: 'text-slate-500',
        bg: 'bg-slate-100',
        dot: 'bg-slate-400',
    },
};

const customerTypeOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'sme', label: 'SME' },
    { value: 'individual', label: 'Individual' },
];

const customerRecords = [
    {
        name: 'PT Maju Jaya',
        code: 'CUST-001',
        type: 'corporate',
        contact: 'Budi Santoso',
        phone: '+62 21-1234-5678',
        email: 'budi@majujaya.com',
        address: 'Jl. Sudirman No. 123, Jakarta Selatan',
        status: 'active',
        totalOrders: 156,
        totalValue: 'Rp 45.000.000',
        rating: 4.8,
    },
    {
        name: 'CV Sukses Mandiri',
        code: 'CUST-002',
        type: 'sme',
        contact: 'Siti Nurhaliza',
        phone: '+62 21-8765-4321',
        email: 'siti@suksesmandiri.com',
        address: 'Jl. Gatot Subroto No. 456, Jakarta Timur',
        status: 'active',
        totalOrders: 89,
        totalValue: 'Rp 28.500.000',
        rating: 4.6,
    },
    {
        name: 'UD Berkah',
        code: 'CUST-003',
        type: 'individual',
        contact: 'Ahmad Fauzi',
        phone: '+62 21-8555-6666',
        email: 'ahmad@udberkah.com',
        address: 'Jl. Pemuda No. 789, Jakarta Barat',
        status: 'inactive',
        totalOrders: 34,
        totalValue: 'Rp 12.800.000',
        rating: 4.4,
    },
    {
        name: 'PT Sentosa Logistik',
        code: 'CUST-004',
        type: 'corporate',
        contact: 'Rina Sasmita',
        phone: '+62 21-3344-7788',
        email: 'rina@sentosalogistik.com',
        address: 'Jl. Asia Afrika No. 88, Jakarta Pusat',
        status: 'active',
        totalOrders: 203,
        totalValue: 'Rp 57.200.000',
        rating: 4.9,
    },
];

const SummaryIcon = ({ className = 'h-5 w-5', children }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        {children}
    </svg>
);

const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <SummaryIcon className={className}>
        <circle cx='11' cy='11' r='6' />
        <path d='m20 20-3.5-3.5' strokeLinecap='round' strokeLinejoin='round' />
    </SummaryIcon>
);

const PhoneIcon = ({ className = 'h-4 w-4' }) => (
    <SummaryIcon className={className}>
        <path d='M6.5 3h2a1 1 0 0 1 1 .72c.23.92.65 2.19 1.3 3.5a1 1 0 0 1-.23 1.15L9.1 10.04c1.4 2.3 3.2 4.1 5.5 5.5l1.67-1.47a1 1 0 0 1 1.15-.23c1.3.65 2.58 1.07 3.5 1.3a1 1 0 0 1 .72 1v2a1 1 0 0 1-1.05 1 16 16 0 0 1-14.5-14.45A1 1 0 0 1 6.5 3z' strokeLinecap='round' strokeLinejoin='round' />
    </SummaryIcon>
);

const MailIcon = ({ className = 'h-4 w-4' }) => (
    <SummaryIcon className={className}>
        <rect x='3' y='5' width='18' height='14' rx='2' />
        <path d='m4 7 8 6 8-6' strokeLinecap='round' strokeLinejoin='round' />
    </SummaryIcon>
);

const MapPinIcon = ({ className = 'h-4 w-4' }) => (
    <SummaryIcon className={className}>
        <path d='M12 3a6 6 0 0 1 6 6c0 4.5-6 12-6 12s-6-7.5-6-12a6 6 0 0 1 6-6z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='9' r='2' />
    </SummaryIcon>
);

const StarIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='currentColor' stroke='none' className={className}>
        <path d='m12 4 2.2 4.5 5 .7-3.6 3.5.9 5.1L12 15.8 7.5 17.8l.9-5.1-3.6-3.5 5-.7z' />
    </svg>
);

const EditIcon = ({ className = 'h-4 w-4' }) => (
    <SummaryIcon className={className}>
        <path d='M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='m14.5 5.5 4 4' strokeLinecap='round' strokeLinejoin='round' />
    </SummaryIcon>
);

const TrashIcon = ({ className = 'h-4 w-4' }) => (
    <SummaryIcon className={className}>
        <path d='M5 7h14' strokeLinecap='round' />
        <path d='M10 11v6M14 11v6' strokeLinecap='round' />
        <path d='M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' strokeLinecap='round' strokeLinejoin='round' />
    </SummaryIcon>
);

function CustomerSummaryCard({ card }) {
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

function CustomerTypeBadge({ type }) {
    const style = customerTypeStyles[type] ?? customerTypeStyles.corporate;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function CustomerStatusBadge({ status }) {
    const style = customerStatusStyles[status] ?? customerStatusStyles.active;
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${style.bg} ${style.text}`}>
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {style.label}
        </span>
    );
}

function CustomerRow({ customer }) {
    const initial = customer.name.charAt(0).toUpperCase();
    const ratingDisplay = customer.rating.toFixed(1);

    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4'>
                <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600'>
                        {initial}
                    </div>
                    <div>
                        <p className='text-sm font-semibold text-slate-800'>{customer.name}</p>
                        <p className='text-xs text-slate-400'>{customer.code}</p>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4'>
                <CustomerTypeBadge type={customer.type} />
            </td>
            <td className='px-6 py-4'>
                <div className='space-y-1 text-sm text-slate-600'>
                    <p className='font-semibold text-slate-700'>{customer.contact}</p>
                    <div className='flex items-center gap-2'>
                        <PhoneIcon className='text-slate-400' />
                        <span>{customer.phone}</span>
                    </div>
                    <div className='flex items-center gap-2 text-slate-400'>
                        <MailIcon />
                        <span className='truncate'>{customer.email}</span>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='flex items-center gap-2'>
                    <MapPinIcon className='text-slate-400' />
                    <span>{customer.address}</span>
                </div>
            </td>
            <td className='px-6 py-4'>
                <CustomerStatusBadge status={customer.status} />
            </td>
            <td className='px-6 py-4 text-sm font-semibold text-slate-700'>{customer.totalOrders}</td>
            <td className='px-6 py-4 text-sm font-semibold text-slate-700'>{customer.totalValue}</td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-1 text-sm font-semibold text-slate-700'>
                    <StarIcon className='text-amber-400' />
                    <span>{ratingDisplay}</span>
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Edit ${customer.name}`}
                    >
                        <EditIcon />
                    </button>
                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:text-rose-600'
                        aria-label={`Hapus ${customer.name}`}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function CustomerTable({ customers, searchTerm, onSearchChange, typeFilter, onTypeChange }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Daftar Pelanggan</h2>
                    <p className='text-sm text-slate-400'>Kelola kontak pelanggan dan histori transaksi</p>
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
                            placeholder='Cari pelanggan, kontak, atau nomor telepon...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <FilterDropdown
                        value={typeFilter}
                        onChange={onTypeChange}
                        options={customerTypeOptions}
                        widthClass='w-full sm:w-48'
                    />
                </div>
            </div>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[900px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Pelanggan</th>
                            <th className='px-6 py-3'>Tipe</th>
                            <th className='px-6 py-3'>Kontak</th>
                            <th className='px-6 py-3'>Alamat</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Total Order</th>
                            <th className='px-6 py-3'>Total Nilai</th>
                            <th className='px-6 py-3'>Rating</th>
                            <th className='px-6 py-3'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {customers.length > 0 ? (
                            customers.map((customer) => <CustomerRow key={customer.code} customer={customer} />)
                        ) : (
                            <tr>
                                <td colSpan={9} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada pelanggan yang sesuai dengan filter saat ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default function CustomerContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredCustomers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return customerRecords.filter((customer) => {
            const matchesSearch =
                term.length === 0 ||
                customer.name.toLowerCase().includes(term) ||
                customer.code.toLowerCase().includes(term) ||
                customer.contact.toLowerCase().includes(term) ||
                customer.email.toLowerCase().includes(term) ||
                customer.phone.toLowerCase().includes(term) ||
                customer.address.toLowerCase().includes(term);
            const matchesType = typeFilter === 'all' || customer.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter]);

    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <CustomerSummaryCard key={card.title} card={card} />
                ))}
            </section>
            <CustomerTable
                customers={filteredCustomers}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
            />
        </>
    );
}
