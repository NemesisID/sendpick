import React, { useEffect, useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';

const summaryCards = [
    {
        title: 'Total Kendaraan',
        value: '45',
        description: 'Armada terdaftar',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 13h18l-2-6H5z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M5 17h14' strokeLinecap='round' />
                <circle cx='7.5' cy='17.5' r='1.5' />
                <circle cx='16.5' cy='17.5' r='1.5' />
            </svg>
        ),
    },
    {
        title: 'Beroperasi',
        value: '38',
        description: 'Sedang digunakan di lapangan',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 12l4 4L21 4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Maintenance',
        value: '5',
        description: 'Jadwal perawatan minggu ini',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M10 2h4l2 3h5v4l-2 2 2 2v4h-5l-2 3h-4l-2-3H3v-4l2-2-2-2V5h5z' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Tidak Aktif',
        value: '2',
        description: 'Perlu tindak lanjut',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M12 4 3 19h18z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 9v4' strokeLinecap='round' />
                <circle cx='12' cy='15' r='1' fill='currentColor' stroke='none' />
            </svg>
        ),
    },
];

const tabs = [
    { key: 'vehicles', label: 'Daftar Kendaraan' },
    { key: 'history', label: 'Rekapitulasi/Histori' },
    { key: 'active', label: 'Kendaraan Beroperasi' },
];

const vehicleStatusStyles = {
    active: {
        label: 'Aktif',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    onRoute: {
        label: 'Sedang Kirim',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    maintenance: {
        label: 'Maintenance',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    inactive: {
        label: 'Tidak Aktif',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
    },
};

const conditionStyles = {
    good: {
        label: 'Baik',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    warning: {
        label: 'Perlu Cek',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    maintenance: {
        label: 'Maintenance',
        bg: 'bg-slate-100',
        text: 'text-slate-500',
    },
};

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'onRoute', label: 'Sedang Kirim' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Tidak Aktif' },
];

const vehicleRecords = [
    {
        plate: 'B 1234 AB',
        model: 'Mitsubishi Fuso Fighter (2022)',
        type: 'Truck',
        capacity: '5 Ton',
        driver: 'Ahmad Subandi',
        location: 'Jakarta Selatan',
        status: 'active',
        condition: 'good',
        fuel: 85,
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-03-10',
    },
    {
        plate: 'B 5678 CD',
        model: 'Daihatsu Gran Max (2021)',
        type: 'Van',
        capacity: '1.5 Ton',
        driver: 'Budi Santoso',
        location: 'Jakarta Timur',
        status: 'onRoute',
        condition: 'good',
        fuel: 60,
        lastMaintenance: '2024-01-05',
        nextMaintenance: '2024-03-05',
    },
    {
        plate: 'B 9012 EF',
        model: 'Isuzu D-Max (2020)',
        type: 'Pickup',
        capacity: '1 Ton',
        driver: '-',
        location: 'Workshop',
        status: 'maintenance',
        condition: 'maintenance',
        fuel: 30,
        lastMaintenance: '2024-01-14',
        nextMaintenance: '2024-01-20',
    },
];

const EXIT_ANIMATION_DURATION = 280; // Keep in sync with CSS modal exit duration

const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='7' />
        <path d='m16 16 4 4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PlusIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M12 5v14M5 12h14' strokeLinecap='round' />
    </svg>
);

const EditIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='m14.5 5.5 4 4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const TrashIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M5 7h14' strokeLinecap='round' />
        <path d='M10 11v6M14 11v6' strokeLinecap='round' />
        <path d='M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

function PopupTambahKendaraan({ open, onClose }) {
    const [shouldRender, setShouldRender] = useState(open);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        let timeoutId;

        if (open) {
            setShouldRender(true);
            setIsClosing(false);
        } else if (shouldRender) {
            setIsClosing(true);
            timeoutId = setTimeout(() => {
                setShouldRender(false);
            }, EXIT_ANIMATION_DURATION);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [open, shouldRender]);

    if (!shouldRender) return null;

    const handleClose = () => {
        setIsClosing(true);
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 ${isClosing ? 'animate-fadeout' : 'animate-fadein'}`}
            onClick={handleClose}
        >
            <div
                className={`min-w-[420px] max-w-full rounded-2xl bg-white p-8 shadow-2xl ${isClosing ? 'animate-popout' : 'animate-popin'}`}
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-6">Tambah Kendaraan Baru</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs mb-1">Plat Nomor</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="B 1234 XX" />
                    </div>
                    <div>
                        <label className="block text-xs mb-1">Tipe Kendaraan</label>
                        <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            <option>Pilih tipe</option>
                            <option>Truk</option>
                            <option>Pickup</option>
                            <option>Van</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-xs mb-1">Merk</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Mitsubishi" />
                    </div>
                    <div>
                        <label className="block text-xs mb-1">Model</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Fuso Fighter" />
                    </div>
                    <div>
                        <label className="block text-xs mb-1">Tahun</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="2023" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-xs mb-1">Kapasitas</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="5 Ton" />
                    </div>
                    <div>
                        <label className="block text-xs mb-1">Kilometer Saat Ini</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="0" />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                        <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200" onClick={handleClose}>Batal</button>
                        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">Simpan</button>
                </div>
            </div>
        </div>
    );
}
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

function Tag({ children, bg, text }) {
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${bg} ${text}`}>
            {children}
        </span>
    );
}

function FuelBar({ value }) {
    return (
        <div className='w-32'>
            <div className='flex items-center justify-between text-xs font-semibold text-slate-500'>
                <span>Fuel Level</span>
                <span>{value}%</span>
            </div>
            <div className='mt-1 h-2 w-full rounded-full bg-slate-100'>
                <div className='h-full rounded-full bg-indigo-500' style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function VehicleRow({ vehicle }) {
    const statusStyle = vehicleStatusStyles[vehicle.status] ?? vehicleStatusStyles.active;
    const conditionStyle = conditionStyles[vehicle.condition] ?? conditionStyles.good;

    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4'>
                <p className='text-sm font-semibold text-slate-800'>{vehicle.plate}</p>
                <p className='text-xs text-slate-400'>{vehicle.model}</p>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>{vehicle.type}</p>
                    <p className='text-xs text-slate-400'>{vehicle.capacity}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{vehicle.driver}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>{vehicle.location}</td>
            <td className='px-6 py-4'>
                <Tag bg={statusStyle.bg} text={statusStyle.text}>
                    {statusStyle.label}
                </Tag>
            </td>
            <td className='px-6 py-4'>
                <Tag bg={conditionStyle.bg} text={conditionStyle.text}>
                    {conditionStyle.label}
                </Tag>
            </td>
            <td className='px-6 py-4'>
                <FuelBar value={vehicle.fuel} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>Last: {vehicle.lastMaintenance}</p>
                    <p>Next: {vehicle.nextMaintenance}</p>
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                        <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Edit kendaraan ${vehicle.plate}`}
                    >
                        <EditIcon />
                        </button>
                        <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:text-rose-600'
                        aria-label={`Hapus kendaraan ${vehicle.plate}`}
                    >
                        <TrashIcon />
                        </button>
                </div>
            </td>
        </tr>
    );
}

function VehicleTable({ vehicles }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <h2 className='text-sm font-semibold text-slate-700'>Daftar Kendaraan</h2>
                        <button
                    type='button'
                    className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600'
                >
                    Export Data
                </button>
            </div>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[940px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Kendaraan</th>
                            <th className='px-6 py-3'>Tipe & Kapasitas</th>
                            <th className='px-6 py-3'>Driver Saat Ini</th>
                            <th className='px-6 py-3'>Lokasi</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Kondisi</th>
                            <th className='px-6 py-3'>Fuel Level</th>
                            <th className='px-6 py-3'>Maintenance</th>
                            <th className='px-6 py-3'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {vehicles.length > 0 ? (
                            vehicles.map((vehicle) => <VehicleRow key={vehicle.plate} vehicle={vehicle} />)
                        ) : (
                            <tr>
                                <td colSpan={9} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada kendaraan pada filter saat ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default function VehicleListContent({ showPopup = false, setShowPopup = () => {} }) {
    const [activeTab, setActiveTab] = useState('vehicles');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredVehicles = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return vehicleRecords.filter((vehicle) => {
            const matchesSearch =
                term.length === 0 ||
                vehicle.plate.toLowerCase().includes(term) ||
                vehicle.model.toLowerCase().includes(term) ||
                vehicle.type.toLowerCase().includes(term) ||
                vehicle.driver.toLowerCase().includes(term);
            const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    return (
        <>
            <PopupTambahKendaraan open={showPopup} onClose={() => setShowPopup(false)} />
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-500'>
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type='button'
                                    onClick={() => setActiveTab(tab.key)}
                                    className={'flex-1 rounded-xl px-4 py-2 transition ' + (isActive ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-indigo-600')}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className='flex flex-col gap-3 sm:flex-row'>
                        <div className='group relative min-w-[260px]'>
                            <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                                <SearchIcon />
                            </span>
                            <input
                                type='text'
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder='Cari plat nomor, merk, atau tipe...'
                                className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                            />
                        </div>
                        <FilterDropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilterOptions}
                            widthClass='min-w-[160px]'
                        />
                        <button
                            type='button'
                            onClick={() => setShowPopup(true)}
                            className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto'
                        >
                            <PlusIcon className='h-4 w-4' />
                            Tambah Kendaraan
                        </button>
                    </div>
                </div>
            </section>
            <VehicleTable vehicles={filteredVehicles} />
        </>
    );
}




