
import React, { useEffect, useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '../context/ThemeContext';
import HomeContent from './Home';
import CustomerContent from './Customer';
import AdminContent from './Admin';
import JobOrderContent from './JobOrder';
import InvoiceContent from './Invoice';
import VehicleListContent from './VehicleList';
import VehicleHistoryContent from './VehicleHistory';
import ActiveVehiclesContent from './ActiveVehicles';
import SupportContent from './Support';
import ReportContent from './Report';
import TrackingContent from './Tracking';
import GuideContent from './Guide';
import ManifestContent from './Manifest';
import DeliveryOrderContent from './DeliveryOrder';
import ProfileContent from './Profile';
import NotificationsContent, { unreadNotificationsCount as dashboardUnreadNotifications } from './Notifications';

const createIcon = (children) => (className = 'w-5 h-5') => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        {children}
    </svg>
);

const navigationIcons = {
    home: createIcon(
        <>
            <path d='m4 10 8-6 8 6' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M5 10v9a1 1 0 0 0 1 1h4.5v-5h3v5H19a1 1 0 0 0 1-1v-9' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    users: createIcon(
        <>
            <path d='M16 18v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1' strokeLinecap='round' strokeLinejoin='round' />
            <circle cx='10' cy='7' r='3' />
            <path d='M20 18v-1a4 4 0 0 0-2.62-3.73' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M16 4a3 3 0 1 1 0 6' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    profile: createIcon(
        <>
            <circle cx='12' cy='8' r='4' />
            <path d='M5 19a7 7 0 0 1 14 0' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    contacts: createIcon(
        <>
            <path d='M6 4h9a2 2 0 0 1 2 2v13l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2z' strokeLinecap='round' strokeLinejoin='round' />
            <circle cx='10.5' cy='10' r='2' />
            <path d='M8 15.5a3.5 3.5 0 0 1 5 0' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M20 7v10' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    driver: createIcon(
        <>
            <circle cx='12' cy='12' r='7' />
            <path d='M12 6v4' strokeLinecap='round' />
            <path d='m5.6 13.5 3.8-1.5L8.4 18' strokeLinecap='round' strokeLinejoin='round' />
            <path d='m18.4 13.5-3.8-1.5 1 6' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    shield: createIcon(
        <>
            <path d='M12 3 5 6v5c0 4.5 3.07 8.5 7 9.5 3.93-1 7-5 7-9.5V6z' strokeLinecap='round' strokeLinejoin='round' />
            <path d='m9 12 2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    clipboard: createIcon(
        <>
            <rect x='5' y='4' width='14' height='16' rx='2' />
            <path d='M9 4V3h6v1' strokeLinecap='round' />
            <path d='M9 10h6M9 14h6' strokeLinecap='round' />
        </>
    ),
    document: createIcon(
        <>
            <path d='M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M14 3v5h5' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M9 13h6M9 17h3' strokeLinecap='round' />
        </>
    ),
    layers: createIcon(
        <>
            <path d='m12 4 9 5-9 5-9-5 9-5Z' strokeLinecap='round' strokeLinejoin='round' />
            <path d='m3 13 9 5 9-5' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    truck: createIcon(
        <>
            <path d='M3 7h11v8H3z' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M14 11h3l3 3v3h-3' strokeLinecap='round' strokeLinejoin='round' />
            <circle cx='7.5' cy='19' r='1.5' />
            <circle cx='16.5' cy='19' r='1.5' />
        </>
    ),
    receipt: createIcon(
        <>
            <path d='M7 3h10a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1z' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M9 8h6M9 12h6' strokeLinecap='round' />
        </>
    ),
    gauge: createIcon(
        <>
            <path d='M5 17a7 7 0 0 1 14 0' strokeLinecap='round' />
            <path d='m12 10 3-3' strokeLinecap='round' strokeLinejoin='round' />
            <circle cx='12' cy='10' r='1' fill='currentColor' stroke='none' />
        </>
    ),
    tracking: createIcon(
        <>
            <circle cx='12' cy='12' r='7' />
            <path d='M12 5v3' strokeLinecap='round' />
            <path d='M19 12h-3' strokeLinecap='round' />
            <path d='m12 12 4 4' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    notifications: createIcon(
        <>
            <path d='M10 21h4' strokeLinecap='round' />
            <path d='M4 8a8 8 0 0 1 16 0v5l1 1v1H3v-1l1-1z' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    chart: createIcon(
        <>
            <path d='M4 19h16' strokeLinecap='round' />
            <path d='M7 16v-5' strokeLinecap='round' />
            <path d='M12 16V9' strokeLinecap='round' />
            <path d='M17 16V7' strokeLinecap='round' />
        </>
    ),
    settings: createIcon(
        <>
            <circle cx='12' cy='12' r='3' />
            <path d='M19.5 12a7.5 7.5 0 0 0-.12-1.3l1.62-1.25-2-3.46-1.94.8a7.55 7.55 0 0 0-2.25-1.31L14.5 3h-5l-.31 2.48a7.55 7.55 0 0 0-2.25 1.31l-1.94-.8-2 3.46 1.62 1.25c-.08.43-.12.86-.12 1.3s.04.87.12 1.3l-1.62 1.25 2 3.46 1.94-.8a7.55 7.55 0 0 0 2.25 1.31L9.5 21h5l.31-2.48a7.55 7.55 0 0 0 2.25-1.31l1.94.8 2-3.46-1.62-1.25c.08-.43.12-.86.12-1.3z' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    book: createIcon(
        <>
            <path d='M5 4h8a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H5z' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M5 4v13a3 3 0 0 1 3 3h8' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    support: createIcon(
        <>
            <circle cx='12' cy='12' r='8' />
            <circle cx='12' cy='12' r='4' />
            <path d='M4.93 4.93 7.76 7.76' strokeLinecap='round' />
            <path d='M16.24 7.76 19.07 4.93' strokeLinecap='round' />
            <path d='M4.93 19.07 7.76 16.24' strokeLinecap='round' />
            <path d='M16.24 16.24 19.07 19.07' strokeLinecap='round' />
        </>
    ),
    history: createIcon(
        <>
            <path d='M12 5a7 7 0 1 1-4.95 2.05' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M5 5v4h4' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M12 9v4l3 2' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
    activity: createIcon(
        <>
            <path d='M4 13h4l2-6 4 10 2-6h4' strokeLinecap='round' strokeLinejoin='round' />
        </>
    ),
};

const PlusIcon = createIcon(
    <>
        <path d='M12 5v14M5 12h14' strokeLinecap='round' />
    </>
);
const MenuIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M4 6h16M4 12h16M4 18h16' strokeLinecap='round' />
    </svg>
);

const BellIcon = ({ className = 'h-6 w-6' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M10 21h4' strokeLinecap='round' />
        <path d='M4 8a8 8 0 0 1 16 0v5l1 1v1H3v-1l1-1z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ChevronDownIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='m8 9 4 4 4-4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const SunIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='4' />
        <path
            d='M12 3v2M12 19v2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M3 12h2M19 12h2M5.64 18.36l1.42-1.42M16.94 7.06l1.42-1.42'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const MoonIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const MonitorIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <rect x='3' y='4' width='18' height='12' rx='2' />
        <path d='M8 20h8' strokeLinecap='round' />
        <path d='M12 16v4' strokeLinecap='round' />
    </svg>
);
const SearchIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='7' />
        <path d='m16 16 4 4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const FilterIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M4 6h16' strokeLinecap='round' />
        <path d='M7 12h10' strokeLinecap='round' />
        <path d='M10 18h4' strokeLinecap='round' />
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

const PhoneIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M6.5 3h2a1 1 0 0 1 1 .72c.23.92.65 2.19 1.3 3.5a1 1 0 0 1-.23 1.15L9.1 10.04c1.4 2.3 3.2 4.1 5.5 5.5l1.67-1.47a1 1 0 0 1 1.15-.23c1.3.65 2.58 1.07 3.5 1.3a1 1 0 0 1 .72 1v2a1 1 0 0 1-1.05 1 16 16 0 0 1-14.5-14.45A1 1 0 0 1 6.5 3z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const MailIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <rect x='3' y='5' width='18' height='14' rx='2' />
        <path d='m4 7 8 6 8-6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const VehicleIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M3 13h18l-2-6H5z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M5 17h14' strokeLinecap='round' />
        <circle cx='7.5' cy='17.5' r='1.5' />
        <circle cx='16.5' cy='17.5' r='1.5' />
    </svg>
);

const MapPinIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M12 3a6 6 0 0 1 6 6c0 4.5-6 12-6 12s-6-7.5-6-12a6 6 0 0 1 6-6z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='9' r='2' />
    </svg>
);

const StarIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='currentColor' stroke='none' className={className}>
        <path d='m12 4 2.2 4.5 5 .7-3.6 3.5.9 5.1L12 15.8 7.5 17.8l.9-5.1-3.6-3.5 5-.7z' />
    </svg>
);
const navigationSections = [
    {
        heading: 'Main',
        items: [
            { label: 'Home', icon: navigationIcons.home, view: 'home' },
            { label: 'Notifikasi', icon: navigationIcons.notifications, view: 'notifications' },
        ],
    },
    {
        heading: 'Contacts',
        items: [
            {
                label: 'Contacts',
                icon: navigationIcons.contacts,
                id: 'contacts',
                children: [
                    { label: 'Customers', icon: navigationIcons.users, view: 'customers' },
                    { label: 'Drivers', icon: navigationIcons.driver, view: 'driversManagement' },
                    { label: 'Admins', icon: navigationIcons.shield, view: 'admins' },
                ],
            },
        ],
    },
    {
        heading: 'Transactions & Operations',
        items: [
            {
                label: 'Orders',
                icon: navigationIcons.clipboard,
                id: 'orders',
                children: [
                    { label: 'Job Order', icon: navigationIcons.document, view: 'jobOrder' },
                    { label: 'Manifest/Packing List', icon: navigationIcons.layers, view: 'manifest' },
                    { label: 'Delivery Order', icon: navigationIcons.truck, view: 'deliveryOrder' },
                ],
            },
        ],
    },
    {
        heading: 'Fleet & Finance',
        items: [
            { label: 'Invoices', icon: navigationIcons.receipt, view: 'invoices' },
            {
                label: 'Fleet Management',
                icon: navigationIcons.truck,
                id: 'fleetManagement',
                children: [
                    { label: 'Vehicle List', icon: navigationIcons.gauge, view: 'vehicleList' },
                    { label: 'History & Recap', icon: navigationIcons.history, view: 'vehicleHistory' },
                    { label: 'Active Vehicles', icon: navigationIcons.activity, view: 'activeVehicles' },
                ],
            },
        ],
    },
    {
        heading: 'Insights',
        items: [
            { label: 'Reports & Analytics', icon: navigationIcons.chart, view: 'report' },
            { label: 'Real Time Tracking', icon: navigationIcons.tracking, view: 'tracking' },
            { label: 'User Guide', icon: navigationIcons.book, view: 'guide' },
            { label: 'Support', icon: navigationIcons.support, view: 'support' },
        ],
    },
    {
        heading: 'Account',
        items: [{ label: 'Profile', icon: navigationIcons.profile, view: 'profile' }],
    },
];
const driverSummaryCards = [
    {
        title: 'Total Driver',
        value: '89',
        description: '12 driver baru bulan ini',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        icon: <VehicleIcon className='h-5 w-5' />,
    },
    {
        title: 'Driver Aktif',
        value: '76',
        description: '85% sedang bertugas',
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
        title: 'Sedang Kirim',
        value: '24',
        description: 'Rata-rata 5 order / driver',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 7h18l-2 10H5L3 7Z' strokeLinejoin='round' />
                <path d='M7 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2' />
            </svg>
        ),
    },
    {
        title: 'Rating Rata-rata',
        value: '4.8',
        description: 'Dari 520 review pelanggan',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: <StarIcon className='h-5 w-5' />,
    },
];

const driverStatusStyles = {
    active: {
        label: 'Aktif',
        badgeBg: 'bg-emerald-50',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
    },
    standby: {
        label: 'Standby',
        badgeBg: 'bg-sky-50',
        text: 'text-sky-600',
        dot: 'bg-sky-500',
    },
    off: {
        label: 'Off Duty',
        badgeBg: 'bg-slate-100',
        text: 'text-slate-500',
        dot: 'bg-slate-400',
    },
};

const driverShiftOptions = [
    { value: 'all', label: 'Semua Shift' },
    { value: 'morning', label: 'Pagi' },
    { value: 'afternoon', label: 'Siang' },
    { value: 'night', label: 'Malam' },
];

const driverRecords = [
    {
        name: 'Rudi Santoso',
        code: 'DRV-001',
        phone: '+62 812-3456-7890',
        email: 'rudi.santoso@sendpick.com',
        vehicle: 'Fuso FM 517',
        plate: 'B 9123 SP',
        status: 'active',
        shift: 'morning',
        lastLocation: 'Gudang Pusat - Cakung',
        rating: 4.9,
        completed: 186,
    },
    {
        name: 'Siti Aisyah',
        code: 'DRV-014',
        phone: '+62 819-4455-6677',
        email: 'siti.aisyah@sendpick.com',
        vehicle: 'Isuzu Elf NLR',
        plate: 'B 7124 SPD',
        status: 'standby',
        shift: 'afternoon',
        lastLocation: 'Hub Bekasi',
        rating: 4.7,
        completed: 142,
    },
    {
        name: 'Adi Pratama',
        code: 'DRV-027',
        phone: '+62 857-3344-1122',
        email: 'adi.pratama@sendpick.com',
        vehicle: 'Hino Dutro 130',
        plate: 'B 8321 SPD',
        status: 'active',
        shift: 'night',
        lastLocation: 'Tol Jakarta - Cikampek KM 19',
        rating: 4.6,
        completed: 168,
    },
    {
        name: 'Made Wijaya',
        code: 'DRV-033',
        phone: '+62 813-9876-5544',
        email: 'made.wijaya@sendpick.com',
        vehicle: 'Mitsubishi L300',
        plate: 'DK 9123 OJ',
        status: 'off',
        shift: 'morning',
        lastLocation: 'Bengkel Resmi - Denpasar',
        rating: 4.5,
        completed: 121,
    },
    {
        name: 'Dewi Anggraini',
        code: 'DRV-042',
        phone: '+62 812-7788-9900',
        email: 'dewi.anggraini@sendpick.com',
        vehicle: 'Isuzu Traga',
        plate: 'B 9981 SPM',
        status: 'active',
        shift: 'afternoon',
        lastLocation: 'Gudang Timur - BSD',
        rating: 4.8,
        completed: 153,
    },
];

const driverActivities = [
    {
        id: 'log-001',
        title: 'Order SP-239 selesai',
        description: 'Pengiriman ke PT Nusantara Logistik berhasil diselesaikan',
        timestamp: '09:45',
        type: 'success',
    },
    {
        id: 'log-002',
        title: 'Maintenance terjadwal',
        description: 'Pemeriksaan rutin kendaraan Hino Dutro 130 - DRV-027',
        timestamp: '08:20',
        type: 'maintenance',
    },
    {
        id: 'log-003',
        title: 'Shift malam dimulai',
        description: 'Driver shift malam melakukan check-in di aplikasi',
        timestamp: '20:05',
        type: 'info',
    },
];
const driverLeaderboard = [
    { id: 'rank-1', name: 'Rudi Santoso', completed: 186, rating: 4.9, area: 'Jabodetabek' },
    { id: 'rank-2', name: 'Dewi Anggraini', completed: 153, rating: 4.8, area: 'Tangerang & BSD' },
    { id: 'rank-3', name: 'Adi Pratama', completed: 168, rating: 4.6, area: 'Bekasi & Karawang' },
];
const driversViewConfig = {
    title: 'Drivers Management',
    subtitle: 'Pantau performa driver, status kendaraan, dan aktivitas operasional',
    actionButton: { label: 'Tambah Driver', icon: PlusIcon },
    getContent: () => <DriverManagementContent />,
};

const viewConfigs = {
    home: {
        title: 'Dashboard',
        subtitle: 'Selamat datang di SendPick Order Management System',
        actionButton: { label: 'Add Order', icon: PlusIcon },
        getContent: () => <HomeContent />,
    },
    notifications: {
        title: 'Pusat Notifikasi',
        subtitle: 'Pantau update operasional, SLA, dan aktivitas tim terbaru',
        actionButton: null,
        getContent: () => <NotificationsContent />,
    },
    customers: {
        title: 'Manajemen Pelanggan',
        subtitle: 'Kelola data pelanggan, histori transaksi, dan status keaktifan',
        actionButton: { label: 'Tambah Pelanggan', icon: PlusIcon },
        getContent: () => <CustomerContent />,
    },
    drivers: driversViewConfig,
    driver: driversViewConfig, // alias untuk view singular
    driversManagement: driversViewConfig,
    admins: {
        title: 'Tim Admin',
        subtitle: 'Pengaturan peran dan aktivitas administrator sistem',
        actionButton: { label: 'Tambah Admin', icon: PlusIcon },
        getContent: () => <AdminContent />,
    },
    jobOrder: {
        title: 'Job Order',
        subtitle: 'Daftar penugasan operasional dan status penyelesaian',
        actionButton: { label: 'Buat Job Order', icon: PlusIcon },
        getContent: () => <JobOrderContent />,
    },
    manifest: {
        title: 'Manifest & Packing List',
        subtitle: 'Dokumentasi muatan dan detail pengiriman terkini',
        actionButton: { label: 'Cetak Manifest', icon: navigationIcons.document },
        getContent: () => <ManifestContent />,
    },
    deliveryOrder: {
        title: 'Delivery Order',
        subtitle: 'Monitoring proses pengiriman dan bukti serah terima',
        actionButton: { label: 'Tambah Delivery Order', icon: navigationIcons.truck },
        getContent: () => <DeliveryOrderContent />,
    },
    invoices: {
        title: 'Invoices',
        subtitle: 'Kelola tagihan, pembayaran, dan status penagihan',
        actionButton: { label: 'Buat Invoice', icon: navigationIcons.receipt },
        getContent: () => <InvoiceContent />,
    },
    vehicleList: {
        title: 'Daftar Kendaraan',
        subtitle: 'Inventori armada, status ketersediaan, dan jadwal perawatan',
        actionButton: { label: 'Tambah Kendaraan', icon: navigationIcons.truck },
        getContent: () => <VehicleListContent />,
    },
    vehicleHistory: {
        title: 'History & Recap Armada',
        subtitle: 'Tinjau histori operasional armada dan insight performa.',
        actionButton: { label: 'Download Laporan', icon: navigationIcons.document },
        getContent: () => <VehicleHistoryContent />,
    },
    activeVehicles: {
        title: 'Kendaraan Aktif',
        subtitle: 'Pantau status kendaraan yang sedang beroperasi secara real-time.',
        actionButton: { label: 'Refresh Status', icon: navigationIcons.activity },
        getContent: () => <ActiveVehiclesContent />,
    },
    report: {
        title: 'Laporan & Analitik',
        subtitle: 'Analisis performa operasional dan KPI utama',
        actionButton: null,
        getContent: () => <ReportContent />,
    },
    tracking: {
        title: 'Pelacakan Pengiriman',
        subtitle: 'Pantau posisi paket dan status pengiriman secara real-time',
        actionButton: null,
        getContent: () => <TrackingContent />,
    },
    guide: {
        title: 'Panduan Pengguna',
        subtitle: 'Best practice dan dokumentasi penggunaan SendPick OMS',
        actionButton: null,
        getContent: () => <GuideContent />,
    },
    support: {
        title: 'Pusat Bantuan',
        subtitle: 'Tiket dukungan, FAQ, dan resource operasional',
        actionButton: { label: 'Buat Tiket', icon: navigationIcons.support },
        getContent: () => <SupportContent />,
    },
    profile: {
        title: 'Profil Pengguna',
        subtitle: 'Kelola informasi akun dan preferensi keamanan',
        actionButton: null,
        getContent: () => <ProfileContent />,
    },
};
function DriverSummaryCard({ card }) {
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

function DriverStatusBadge({ status }) {
    const style = driverStatusStyles[status] ?? driverStatusStyles.active;

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${style.badgeBg} ${style.text}`}>
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {style.label}
        </span>
    );
}

function DriverRow({ driver }) {
    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-4'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600'>
                        {driver.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>
                    <div>
                        <p className='text-sm font-semibold text-slate-900'>{driver.name}</p>
                        <p className='text-xs text-slate-400'>{driver.code}</p>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='space-y-1 text-xs text-slate-500'>
                    <span className='flex items-center gap-2'>
                        <PhoneIcon />
                        {driver.phone}
                    </span>
                    <span className='flex items-center gap-2'>
                        <MailIcon />
                        {driver.email}
                    </span>
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='space-y-1'>
                    <p className='text-sm font-semibold text-slate-800'>{driver.vehicle}</p>
                    <p className='text-xs text-slate-400'>{driver.plate}</p>
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='flex flex-col gap-1 text-xs text-slate-500'>
                    <span className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600'>
                        <MapPinIcon />
                        {driver.lastLocation}
                    </span>
                    <span className='text-xs font-medium text-slate-400'>Shift: {driver.shift}</span>
                </div>
            </td>
            <td className='px-6 py-4'>
                <DriverStatusBadge status={driver.status} />
            </td>
            <td className='px-6 py-4'>
                <div className='text-sm font-semibold text-slate-800'>{driver.completed}</div>
                <p className='text-xs text-slate-400'>Order selesai</p>
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-1 text-sm font-semibold text-slate-800'>
                    <StarIcon className='h-3.5 w-3.5 text-amber-400' />
                    {driver.rating.toFixed(1)}
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Edit ${driver.name}`}
                    >
                        <EditIcon />
                    </button>
                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:text-rose-600'
                        aria-label={`Hapus ${driver.name}`}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function DriverTable({ drivers, searchTerm, onSearchChange, shiftFilter, onShiftChange }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Daftar Driver</h2>
                    <p className='text-sm text-slate-400'>Kontrol aktivitas dan kinerja driver harian</p>
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
                            placeholder='Cari driver, plat nomor, atau rute...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <FilterDropdown
                        value={shiftFilter}
                        onChange={onShiftChange}
                        options={driverShiftOptions}
                        widthClass='w-full sm:w-48'
                        leadingIcon={<FilterIcon />}
                    />
                </div>
            </div>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[980px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Driver</th>
                            <th className='px-6 py-3'>Kontak</th>
                            <th className='px-6 py-3'>Kendaraan</th>
                            <th className='px-6 py-3'>Lokasi Terakhir</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Order</th>
                            <th className='px-6 py-3'>Rating</th>
                            <th className='px-6 py-3'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {drivers.length > 0 ? (
                            drivers.map((driver) => <DriverRow key={driver.code} driver={driver} />)
                        ) : (
                            <tr>
                                <td colSpan={8} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada driver yang sesuai dengan filter saat ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function DriverActivityTimeline() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-base font-semibold text-slate-900'>Aktivitas Terbaru</h3>
                    <p className='text-sm text-slate-400'>Ringkasan aktivitas operasional dalam 24 jam terakhir</p>
                </div>
                <button
                    type='button'
                    className='text-xs font-semibold text-indigo-600 transition hover:text-indigo-500'
                >
                    Lihat Semua
                </button>
            </div>
            <ol className='mt-6 space-y-4 text-sm text-slate-600'>
                {driverActivities.map((activity) => (
                    <li key={activity.id} className='flex gap-3'>
                        <span className='mt-1 h-2 w-2 rounded-full bg-indigo-500' />
                        <div className='flex-1 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm'>
                            <div className='flex items-center justify-between'>
                                <p className='font-medium text-slate-800'>{activity.title}</p>
                                <span className='text-xs text-slate-400'>{activity.timestamp}</span>
                            </div>
                            <p className='mt-1 text-xs text-slate-500'>{activity.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function DriverLeaderboard() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-slate-900'>Top Performer</h3>
            <p className='text-sm text-slate-400'>Driver dengan penyelesaian order tertinggi minggu ini</p>
            <div className='mt-6 space-y-3'>
                {driverLeaderboard.map((entry, index) => (
                    <article
                        key={entry.id}
                        className='flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-slate-200'
                    >
                        <div className='flex items-center gap-3'>
                            <span className='flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600'>
                                #{index + 1}
                            </span>
                            <div>
                                <p className='text-sm font-semibold text-slate-800'>{entry.name}</p>
                                <p className='text-xs text-slate-400'>{entry.area}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 text-sm font-semibold text-slate-700'>
                            <span>{entry.completed} order</span>
                            <span className='inline-flex items-center gap-1 text-amber-500'>
                                <StarIcon className='h-3.5 w-3.5' />
                                {entry.rating.toFixed(1)}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function DriverManagementContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [shiftFilter, setShiftFilter] = useState('all');

    const filteredDrivers = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return driverRecords.filter((driver) => {
            const matchesShift = shiftFilter === 'all' || driver.shift === shiftFilter;
            const matchesSearch =
                term.length === 0 ||
                driver.name.toLowerCase().includes(term) ||
                driver.code.toLowerCase().includes(term) ||
                driver.phone.toLowerCase().includes(term) ||
                driver.email.toLowerCase().includes(term) ||
                driver.vehicle.toLowerCase().includes(term) ||
                driver.plate.toLowerCase().includes(term) ||
                driver.lastLocation.toLowerCase().includes(term);
            return matchesShift && matchesSearch;
        });
    }, [searchTerm, shiftFilter]);

    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {driverSummaryCards.map((card) => (
                    <DriverSummaryCard key={card.title} card={card} />
                ))}
            </section>
            <section className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
                <DriverTable
                    drivers={filteredDrivers}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    shiftFilter={shiftFilter}
                    onShiftChange={setShiftFilter}
                />
                <div className='space-y-6'>
                    <DriverActivityTimeline />
                    <DriverLeaderboard />
                </div>
            </section>
        </>
    );
}
const ThemeIndicator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selection, setSelection] = useState('light');

    const options = useMemo(
        () => [
            { value: 'light', label: 'Light', icon: SunIcon },
            { value: 'dark', label: 'Dark', icon: MoonIcon },
            { value: 'system', label: 'System', icon: MonitorIcon },
        ],
        [],
    );

    const selectedOption = options.find((option) => option.value === selection) ?? options[0];
    const SelectedIcon = selectedOption.icon;

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
        }
    };

    const handleSelect = (value) => {
        setSelection(value);
        setIsOpen(false);
    };

    const menuClassName = [
        'absolute right-0 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-lg transition-all duration-150 ease-out origin-top-right',
        isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
    ].join(' ');

    return (
        <div
            className='relative'
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
        >
            <button
                type='button'
                className='flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                aria-haspopup='menu'
                aria-expanded={isOpen}
                aria-label='Pilih mode tampilan'
                onClick={() => setIsOpen((previous) => !previous)}
            >
                <SelectedIcon className='h-5 w-5' />
            </button>
            <div className={menuClassName}>
                {options.map((option) => {
                    const OptionIcon = option.icon;
                    const isActive = selection === option.value;
                    const optionClassName = [
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                        isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600',
                    ].join(' ');

                    return (
                        <button
                            key={option.value}
                            type='button'
                            onClick={() => handleSelect(option.value)}
                            className={optionClassName}
                        >
                            <OptionIcon className='h-4 w-4' />
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

function Sidebar({ activeView, onNavigate, isOpen, onToggle }) {
    const [expandedIds, setExpandedIds] = useState(() => {
        const ids = [];
        navigationSections.forEach((section) => {
            section.items.forEach((item) => {
                if (item.children && (item.id || item.label)) {
                    ids.push(item.id ?? item.label);
                }
            });
        });
        return new Set(ids);
    });

    const collapsed = !isOpen;

    const toggleExpand = (id) => {
        setExpandedIds((previous) => {
            const next = new Set(previous);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleNavigate = (view) => {
        onNavigate(view);
        if (collapsed) {
            onToggle(true);
        }
    };

    const handleParentClick = (item) => {
        const id = item.id ?? item.label;
        if (collapsed) {
            onToggle(true);
            if (item.children && item.children.length > 0) {
                onNavigate(item.children[0].view);
            }
            return;
        }
        toggleExpand(id);
    };

    const motionStyle = (maxWidth = '999px', delay = 0) => ({
        transition: `max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 50}ms, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        maxWidth: collapsed ? '0px' : maxWidth,
        opacity: collapsed ? 0 : 1,
        transform: collapsed ? 'translateX(-12px) scale(0.95)' : 'translateX(0) scale(1)',
        transformOrigin: 'left center',
        willChange: 'max-width, opacity, transform',
    });

    const asideClassName = [
        'group/sidebar flex h-full flex-col border-r border-slate-200 bg-white sidebar-container',
        // Mobile: fixed positioned sidebar, Desktop: relative
        'lg:relative fixed inset-y-0 left-0 z-30 lg:z-auto',
        // Width with smooth animation - ChatGPT style
        isOpen ? 'w-72' : 'w-72 lg:w-20',
        // Shadows for depth
        isOpen ? 'shadow-2xl lg:shadow-sm' : 'shadow-sm',
        // Enhanced slide animation like ChatGPT
        isOpen 
            ? 'translate-x-0 lg:translate-x-0 sidebar-mobile-slide' 
            : '-translate-x-full lg:translate-x-0 sidebar-mobile-slide',
        // Desktop width transition
        'sidebar-desktop-width'
    ].join(' ');

    const navPaddingClass = collapsed ? 'px-2 pb-6' : 'px-4 pb-8';

    return (
        <aside id='dashboard-sidebar' className={asideClassName}>
            <div
                className={[
                    'flex items-center sidebar-content-slide',
                    collapsed ? 'justify-center px-3 py-6' : 'gap-3 px-6 py-8',
                ].join(' ')}
            >
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-base font-semibold text-white sidebar-hover-smooth ${
                    collapsed ? 'scale-100' : 'scale-100'
                }`}>
                    SP
                </div>
                <div className='overflow-hidden' style={motionStyle('200px', 100)}>
                    <div className={`sidebar-content-slide ${
                        collapsed ? 'translate-x-2 opacity-0' : 'translate-x-0 opacity-100'
                    }`}>
                        <p className='text-sm font-semibold text-slate-900'>Order Management System</p>
                        <p className='text-xs text-slate-400'>SendPick Logistics</p>
                    </div>
                </div>
            </div>
            <nav className={['sidebar-scroll flex-1 overflow-y-auto sidebar-content-slide', navPaddingClass, collapsed ? 'translate-x-0 scale-98' : 'translate-x-0 scale-100'].join(' ')}>
                {navigationSections.map((section, sectionIndex) => (
                    <div key={section.heading} className={collapsed ? 'mb-4 flex flex-col items-center gap-2' : 'mb-6'}>
                        <div
                            className={`${collapsed ? 'flex justify-center overflow-hidden' : 'px-3'} delay-${Math.min(sectionIndex * 75 + 75, 300)}`}
                            style={motionStyle('160px', sectionIndex * 50)}
                        >
                            <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                                {section.heading}
                            </p>
                        </div>
                        <div className={collapsed ? 'flex flex-col items-center gap-2' : 'mt-3 space-y-1'}>
                            {section.items.map((item, itemIndex) => {
                                const childActive = item.children ? item.children.some((child) => child.view === activeView) : false;
                                const Icon = item.icon;

                                if (item.children) {
                                    const id = item.id ?? item.label;
                                    const isExpanded = expandedIds.has(id);
                                    const isActive = activeView === item.view || childActive;
                                    const childContainerClasses = !collapsed && isExpanded
                                        ? 'mt-1 space-y-1 overflow-hidden dropdown-container dropdown-smooth-transition max-h-60 opacity-100 translate-y-0 scale-100'
                                        : 'overflow-hidden dropdown-container dropdown-smooth-transition max-h-0 opacity-0 -translate-y-2 scale-95';
                                    const parentLabelStyle = motionStyle('168px', sectionIndex * 50 + itemIndex * 30);
                                    if (!collapsed) {
                                        parentLabelStyle.marginLeft = '4px';
                                    }

                                    return (
                                        <div key={id} className='w-full'>
                                            <button
                                                type='button'
                                                onClick={() => handleParentClick(item)}
                                                className={[
                                                    'sidebar-item flex w-full items-center rounded-2xl px-3 py-2.5 text-sm font-medium sidebar-hover-smooth',
                                                    collapsed ? 'justify-center gap-0' : 'justify-between gap-3',
                                                    isExpanded || isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100',
                                                ].join(' ')}
                                            >
                                                <span
                                                    className={[
                                                        'flex items-center transition-all duration-400 ease-out',
                                                        collapsed ? 'gap-0' : 'gap-3',
                                                    ].join(' ')}
                                                >
                                                    <span className='text-slate-400'>{Icon ? Icon('h-5 w-5') : null}</span>
                                                    <span
                                                        className='overflow-hidden whitespace-nowrap'
                                                        style={parentLabelStyle}
                                                    >
                                                        {item.label}
                                                    </span>
                                                </span>
                                                <ChevronDownIcon
                                                    className={[
                                                        'h-4 w-4 chevron-smooth',
                                                        collapsed ? 'opacity-0 scale-75' : isExpanded ? 'chevron-expanded' : 'rotate-0',
                                                    ].join(' ')}
                                                />
                                            </button>
                                            <div className={childContainerClasses}>
                                                <div className='space-y-1 pt-1'>
                                                    {item.children.map((child, childIndex) => {
                                                        const ChildIcon = child.icon;
                                                        const isActiveChild = activeView === child.view;
                                                        const childLabelStyle = motionStyle('160px', sectionIndex * 50 + itemIndex * 30 + childIndex * 20);
                                                        if (!collapsed) {
                                                            childLabelStyle.marginLeft = '4px';
                                                        }
                                                        const bulletStyle = collapsed
                                                            ? {
                                                                  width: 0,
                                                                  opacity: 0,
                                                                  transform: 'scale(0.3) translateX(-4px)',
                                                                  marginRight: 0,
                                                                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                              }
                                                            : {
                                                                  width: '0.5rem',
                                                                  opacity: 1,
                                                                  transform: 'scale(1) translateX(0)',
                                                                  marginRight: '12px',
                                                                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                              };

                                                        return (
                                                            <button
                                                                key={child.view}
                                                                type='button'
                                                                onClick={() => handleNavigate(child.view)}
                                                                className={[
                                                                    'sidebar-item flex w-full items-center rounded-2xl px-3 py-2 text-sm font-medium dropdown-item-hover',
                                                                    collapsed ? 'justify-center gap-0' : 'gap-3',
                                                                    isActiveChild ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100',
                                                                    isExpanded ? `animate-dropdown-item-fade stagger-${Math.min(childIndex + 1, 6)}` : '',
                                                                ].join(' ')}
                                                            >
                                                                <span
                                                                    className={[
                                                                        'flex h-2 flex-shrink-0 rounded-full transition-all duration-400 ease-out',
                                                                        isActiveChild ? 'bg-white' : 'bg-slate-300',
                                                                    ].join(' ')}
                                                                    style={bulletStyle}
                                                                />
                                                                <span className='text-slate-400'>{ChildIcon ? ChildIcon('h-4 w-4') : null}</span>
                                                                <span
                                                                    className='overflow-hidden whitespace-nowrap'
                                                                    style={childLabelStyle}
                                                                >
                                                                    {child.label}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                const isActive = activeView === item.view || childActive;
                                const simpleLabelStyle = motionStyle('168px', sectionIndex * 50 + itemIndex * 30);
                                if (!collapsed) {
                                    simpleLabelStyle.marginLeft = '4px';
                                }
                                const simpleBulletStyle = collapsed
                                    ? {
                                          width: 0,
                                          opacity: 0,
                                          transform: 'scale(0.3) translateX(-4px)',
                                          marginRight: 0,
                                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                      }
                                    : {
                                          width: '0.5rem',
                                          opacity: 1,
                                          transform: 'scale(1) translateX(0)',
                                          marginRight: '12px',
                                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                      };

                                return (
                                    <button
                                        key={item.view ?? item.label}
                                        type='button'
                                        onClick={() => handleNavigate(item.view)}
                                        className={[
                                            'sidebar-item flex w-full items-center rounded-2xl px-3 py-2.5 text-sm font-medium sidebar-hover-smooth',
                                            collapsed ? 'justify-center gap-0' : 'gap-3',
                                            isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100',
                                        ].join(' ')}
                                    >
                                        <span
                                            className={[
                                                'flex h-2 flex-shrink-0 rounded-full transition-all duration-400 ease-out',
                                                isActive ? 'bg-white' : 'bg-slate-300',
                                            ].join(' ')}
                                            style={simpleBulletStyle}
                                        />
                                        <span className='text-slate-400'>{Icon ? Icon('h-5 w-5') : null}</span>
                                        <span
                                            className='overflow-hidden whitespace-nowrap'
                                            style={simpleLabelStyle}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
            <div className={['sidebar-content-slide', collapsed ? 'px-2 pb-4' : 'px-6 pb-8'].join(' ')}>
                <div className='overflow-hidden' style={motionStyle('999px', 150)}>
                    <div className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sidebar-hover-smooth'>
                        <p className='text-sm font-semibold text-slate-900'>Quick Tips</p>
                        <p className='mt-1 text-xs text-slate-500'>Gunakan filter untuk memantau driver atau order tertentu.</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
function DashboardLayout() {
    const [activeView, setActiveView] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showVehiclePopup, setShowVehiclePopup] = useState(false);

    const activeConfig = viewConfigs[activeView] ?? viewConfigs.home;

    useEffect(() => {
        if (activeView !== 'vehicleList') {
            setShowVehiclePopup(false);
        }
    }, [activeView]);

    const mainContent = useMemo(() => {
        if (activeView === 'vehicleList') {
            return (
                <VehicleListContent showPopup={showVehiclePopup} setShowPopup={setShowVehiclePopup} />
            );
        }

        return activeConfig.getContent();
    }, [activeConfig, activeView, showVehiclePopup, setShowVehiclePopup]);

    const actionButton = activeConfig.actionButton;
    const ActionIcon = actionButton?.icon;
    const isNotificationsView = activeView === 'notifications';

    const handleActionClick = () => {
        if (activeView === 'vehicleList') {
            setShowVehiclePopup(true);
            return;
        }

        if (typeof actionButton?.onClick === 'function') {
            actionButton.onClick();
        }
    };
    return (
        <div className='flex h-screen w-full overflow-hidden bg-white text-slate-700'>
            {/* ChatGPT-like Mobile overlay with progressive backdrop */}
            <div 
                className={`fixed inset-0 z-20 lg:hidden backdrop-progressive ${
                    isSidebarOpen 
                        ? 'opacity-100 visible bg-slate-900/25' 
                        : 'opacity-0 invisible bg-slate-900/0'
                }`}
                style={{
                    backdropFilter: isSidebarOpen ? 'blur(6px)' : 'blur(0px)'
                }}
                onClick={() => setIsSidebarOpen(false)}
            />
            <Sidebar activeView={activeView} onNavigate={setActiveView} isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-y-auto sidebar-content-slide">
                <header className='sticky top-0 z-10 flex h-20 p-5 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm'>
                    <div className='flex items-center gap-4 text-sm text-slate-500'>
                        <button
                            type='button'
                            className='rounded-xl border border-slate-200 p-2 text-slate-500 sidebar-hover-smooth hover:border-indigo-200 hover:text-indigo-600 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                            onClick={() => setIsSidebarOpen((previous) => !previous)}
                            aria-label='Toggle sidebar'
                            aria-controls='dashboard-sidebar'
                            aria-expanded={isSidebarOpen}
                        >
                            <MenuIcon />
                        </button>
                        <span className='font-medium text-slate-600'>Sendpick</span>
                    </div>
                    <div className='flex items-center gap-5'>
                        <ThemeIndicator />
                        <button
                            type='button'
                            onClick={() => setActiveView('notifications')}
                            aria-label='Notifikasi'
                            aria-pressed={isNotificationsView}
                            className={[
                                'relative rounded-xl border p-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                                isNotificationsView
                                    ? 'border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm'
                                    : 'border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-600',
                            ].join(' ')}
                        >
                            <BellIcon />
                            {dashboardUnreadNotifications > 0 ? (
                                <span className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white'>
                                    {dashboardUnreadNotifications}
                                </span>
                            ) : null}
                        </button>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600'>
                                AD
                            </div>
                            <div className='text-sm leading-tight'>
                                <p className='font-semibold text-slate-800'>Admin User</p>
                                <button
                                    type='button'
                                    onClick={() => setActiveView('profile')}
                                    className='text-xs text-slate-400 transition hover:text-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                                >
                                    admin@sendpick.com
                                </button>
                            </div>
                            <button
                                type='button'
                                className='text-slate-400 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                                aria-label='Buka menu akun'
                            >
                                <ChevronDownIcon />
                            </button>
                        </div>
                    </div>
                </header>
                <main className='flex-1 bg-white'>
                    <div className='mx-auto flex max-w-6xl flex-col gap-8 px-10 py-8'>
                        <div className='flex items-start justify-between'>
                            <div>
                                <h1 className='text-2xl font-semibold text-slate-900'>{activeConfig.title}</h1>
                                <p className='mt-2 text-sm text-slate-500'>{activeConfig.subtitle}</p>
                            </div>
                            {actionButton ? (
                                <button
                                    type='button'
                                    onClick={handleActionClick}
                                    className='inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                                >
                                    {ActionIcon ? ActionIcon('h-4 w-4') : null}
                                    {actionButton.label}
                                </button>
                            ) : null}
                        </div>
                        {mainContent}
                    </div>
                </main>
            </div>
        </div>
    );
}
function Dashboard() {
    return (
        <ThemeProvider>
            <DashboardLayout />
        </ThemeProvider>
    );
}

const container = document.getElementById('dashboard');

if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<Dashboard />);
}


