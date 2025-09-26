import React from 'react';

const statCards = [
    {
        title: 'Total Orders',
        value: '1,247',
        delta: '+12% dari bulan lalu',
        deltaColor: 'text-emerald-500',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 5h2l1 14h12l1-14h2' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M9 5a3 3 0 1 1 6 0' />
            </svg>
        ),
    },
    {
        title: 'Driver Aktif',
        value: '89',
        delta: '85% sedang beroperasi',
        deltaColor: 'text-emerald-500',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm6 7a6 6 0 0 0-12 0' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Kendaraan Aktif',
        value: '45',
        delta: '3 dalam maintenance',
        deltaColor: 'text-amber-500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 16v-3l2-5h14l2 5v3' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M5 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2' />
                <path d='M16 16v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2' />
            </svg>
        ),
    },
    {
        title: 'OTIF Rate',
        value: '94.2%',
        delta: 'Target: 95%',
        deltaColor: 'text-emerald-500',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M12 3v3' strokeLinecap='round' />
                <path d='M12 6a6 6 0 1 1-6 6' />
                <path d='m12 12 3 3 3-6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const transactions = [
    {
        company: 'PT Maju Jaya',
        code: 'ORD-001',
        time: '2 jam lalu',
        status: 'Transaksi Baru',
        statusColor: 'text-emerald-500 bg-emerald-50',
        amount: 'Rp 2,500,000',
    },
    {
        company: 'CV Sukses Mandiri',
        code: 'REQ-002',
        time: '4 jam lalu',
        status: 'Permintaan Pickup',
        statusColor: 'text-sky-500 bg-sky-50',
        amount: 'Rp 1,240,000',
    },
    {
        company: 'PT Nusantara Logistik',
        code: 'ORD-014',
        time: 'Kemarin',
        status: 'Sedang Diproses',
        statusColor: 'text-indigo-500 bg-indigo-50',
        amount: 'Rp 4,950,000',
    },
];

function HomeStatCard({ card }) {
    return (
        <article className='flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
            </div>
            <div>
                <p className='text-sm text-slate-400'>{card.title}</p>
                <p className='mt-1 text-2xl font-semibold text-slate-900'>{card.value}</p>
                <p className={`text-xs font-medium ${card.deltaColor}`}>{card.delta}</p>
            </div>
        </article>
    );
}

function MonthlyTrendCard() {
    return (
        <section className='flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm text-slate-500'>Trend Order Bulanan</p>
                    <p className='text-xs text-slate-400'>Jan - Jun 2025</p>
                </div>
                <button
                    type='button'
                    className='text-xs font-semibold text-indigo-600 transition hover:text-indigo-500'
                >
                    Lihat Detail
                </button>
            </div>
            <div className='mt-6 h-64'>
                <svg viewBox='0 0 500 220' className='h-full w-full'>
                    <defs>
                        <linearGradient id='trendGradient' x1='0' x2='0' y1='0' y2='1'>
                            <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.4' />
                            <stop offset='100%' stopColor='#3b82f6' stopOpacity='0.05' />
                        </linearGradient>
                    </defs>
                    <g stroke='#e2e8f0' strokeWidth='1'>
                        {[40, 80, 120, 160].map((y) => (
                            <line key={y} x1='40' x2='480' y1={y} y2={y} />
                        ))}
                        {[80, 160, 240, 320, 400, 480].map((x) => (
                            <line key={x} x1={x} x2={x} y1='20' y2='200' />
                        ))}
                    </g>
                    <path
                        d='M40 160 C120 120 160 140 200 130 C240 120 270 70 320 90 C360 110 380 140 480 80 V200 H40 Z'
                        fill='url(#trendGradient)'
                    />
                    <path
                        d='M40 160 C120 120 160 140 200 130 C240 120 270 70 320 90 C360 110 380 140 480 80'
                        stroke='#3b82f6'
                        strokeWidth='3'
                        strokeLinecap='round'
                        fill='none'
                    />
                    {[
                        { x: 80, y: 145, label: 'Jan' },
                        { x: 160, y: 135, label: 'Feb' },
                        { x: 240, y: 120, label: 'Mar' },
                        { x: 320, y: 95, label: 'Apr' },
                        { x: 400, y: 120, label: 'Mei' },
                        { x: 480, y: 80, label: 'Jun' },
                    ].map((point) => (
                        <g key={point.label}>
                            <circle cx={point.x} cy={point.y} r='6' fill='#3b82f6' stroke='#fff' strokeWidth='2' />
                            <text x={point.x} y='210' fontSize='12' textAnchor='middle' className='fill-slate-400'>
                                {point.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </section>
    );
}

function ShipmentStatusCard() {
    return (
        <section className='w-full max-w-xs rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <p className='text-sm text-slate-500'>Status Pengiriman</p>
            <div className='mt-6 flex flex-col items-center gap-4'>
                <svg viewBox='0 0 220 220' className='h-44 w-44'>
                    <circle cx='110' cy='110' r='90' fill='#10b981' />
                    <path d='M110 20 A90 90 0 0 1 200 110 L110 110 Z' fill='#3b82f6' />
                    <path d='M200 110 A90 90 0 0 1 150 190 L110 110 Z' fill='#f97316' />
                    <path d='M150 190 A90 90 0 0 1 110 200 L110 110 Z' fill='#ef4444' />
                </svg>
                <div className='space-y-1 text-xs font-medium text-slate-600'>
                    <p className='text-emerald-500'>Delivered 83%</p>
                    <p className='text-blue-500'>In Transit 11%</p>
                    <p className='text-amber-500'>Pending 4%</p>
                    <p className='text-red-500'>Cancelled 2%</p>
                </div>
            </div>
        </section>
    );
}

function TransactionsCard() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-slate-500'>Perkembangan Transaksi Terbaru</p>
                <button
                    type='button'
                    className='text-xs font-semibold text-indigo-600 transition hover:text-indigo-500'
                >
                    Lihat Semua
                </button>
            </div>
            <div className='mt-6 space-y-3'>
                {transactions.map((transaction) => (
                    <article
                        key={transaction.code}
                        className='flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-4 transition hover:border-slate-200'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100'>
                                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5 text-indigo-500'>
                                    <path d='M3 7h18l-2 10H5L3 7Z' strokeLinejoin='round' />
                                    <path d='M7 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2' />
                                </svg>
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-slate-800'>{transaction.company}</p>
                                <p className='text-xs text-slate-400'>
                                    {transaction.code} | {transaction.time}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${transaction.statusColor}`}>
                                {transaction.status}
                            </span>
                            <p className='text-sm font-semibold text-slate-800'>{transaction.amount}</p>
                            <button
                                type='button'
                                className='text-xs font-medium text-indigo-500 transition hover:text-indigo-400'
                            >
                                Detail
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default function HomeContent() {
    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {statCards.map((card) => (
                    <HomeStatCard key={card.title} card={card} />
                ))}
            </section>
            <section className='flex flex-col gap-6 xl:flex-row'>
                <MonthlyTrendCard />
                <ShipmentStatusCard />
            </section>
            <TransactionsCard />
        </>
    );
}
