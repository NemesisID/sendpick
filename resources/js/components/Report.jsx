import React from 'react';

const kpiCards = [
    {
        title: 'Total Revenue',
        value: 'Rp 322M',
        delta: '+18.2% vs last period',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M4 19h16' strokeLinecap='round' />
                <path d='M7 15v-6l4 3 4-3v6' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 4v7' strokeLinecap='round' />
            </svg>
        ),
    },
    {
        title: 'Total Orders',
        value: '2,134',
        delta: '+12.5% vs last period',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 7h18l-2 10H5L3 7Z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M7 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2' />
            </svg>
        ),
    },
    {
        title: 'Avg Delivery Time',
        value: '2.4 days',
        delta: '-0.3 days improvement',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='M12 7v5l3 2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Customer Satisfaction',
        value: '96.8%',
        delta: '+2.1% vs last period',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M12 21a9 9 0 1 1 9-9' strokeLinecap='round' strokeLinejoin='round' />
                <path d='m16 11-3 3-1.5-1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const performanceMetrics = [
    { name: 'On-Time Delivery', value: 94.2, color: 'bg-emerald-500' },
    { name: 'Customer Satisfaction', value: 96.8, color: 'bg-sky-500' },
    { name: 'Fleet Utilization', value: 87.3, color: 'bg-amber-500' },
    { name: 'Driver Efficiency', value: 91.5, color: 'bg-purple-500' },
];

const topCustomers = [
    { rank: 1, name: 'PT Maju Jaya', orders: 45, revenue: 'Rp 15.6M', share: '100.0%' },
    { rank: 2, name: 'CV Sukses Mandiri', orders: 38, revenue: 'Rp 12.4M', share: '79.5%' },
    { rank: 3, name: 'UD Berkah Sejahtera', orders: 32, revenue: 'Rp 9.8M', share: '62.8%' },
    { rank: 4, name: 'PT Sentosa Logistik', orders: 26, revenue: 'Rp 7.4M', share: '51.2%' },
];

const exportOptions = [
    { label: 'Monthly Report (PDF)', icon: '??' },
    { label: 'Analytics Dashboard (Excel)', icon: '??' },
    { label: 'Customer Summary (CSV)', icon: '??' },
    { label: 'Performance Metrics (PDF)', icon: '??' },
];

function KPI({ card }) {
    return (
        <article className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div>
                <p className='text-sm text-slate-400'>{card.title}</p>
                <p className='mt-2 text-2xl font-semibold text-slate-900'>{card.value}</p>
                <p className='mt-1 text-xs font-semibold text-emerald-500'>{card.delta}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
            </div>
        </article>
    );
}
function MetricBar({ metric }) {
    return (
        <div className='space-y-2'>
            <div className='flex items-center justify-between text-xs font-semibold text-slate-500'>
                <span>{metric.name}</span>
                <span>{metric.value}%</span>
            </div>
            <div className='h-2 rounded-full bg-slate-100'>
                <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.value}%` }} />
            </div>
        </div>
    );
}

function CustomerRow({ customer }) {
    return (
        <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
            <div className='flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600'>
                    {customer.rank}
                </div>
                <div>
                    <p className='text-sm font-semibold text-slate-800'>{customer.name}</p>
                    <p className='text-xs text-slate-400'>{customer.orders} orders</p>
                </div>
            </div>
            <div className='text-right'>
                <p className='text-sm font-semibold text-slate-800'>{customer.revenue}</p>
                <p className='text-xs text-slate-400'>{customer.share}</p>
            </div>
        </div>
    );
}

// Placeholder chart component (replace with Chart.js/Recharts as needed)
const AreaChart = () => (
  <div className="w-full h-56 bg-blue-100 rounded-lg flex items-center justify-center">
    <span className="text-blue-400">[Area Chart Placeholder]</span>
    </div>
);

function ExportButton({ option }) {
    return (
        <button
            type='button'
            className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600'
        >
            <span className='flex items-center gap-3'>
                <span className='text-base'>{option.icon}</span>
                {option.label}
            </span>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                <path d='m9 18 6-6-6-6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        </button>
    );
}

function RevenueChart() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-sm font-semibold text-slate-700'>Monthly Revenue & Orders</h3>
                    <p className='text-xs text-slate-400'>Revenue and order trends over the last 6 months</p>
                </div>
                <button
                    type='button'
                    className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600'
                >
                    View Details
                </button>
            </div>
            <div className='mt-6 h-72'>
                <svg viewBox='0 0 500 260' className='h-full w-full'>
                    <defs>
                        <linearGradient id='monthlyRevenueGradient' x1='0' x2='0' y1='0' y2='1'>
                            <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.35' />
                            <stop offset='100%' stopColor='#3b82f6' stopOpacity='0.05' />
                        </linearGradient>
                    </defs>
                    <g stroke='#e2e8f0' strokeWidth='1'>
                        {[50, 90, 130, 170, 210].map((y) => (
                            <line key={y} x1='50' x2='480' y1={y} y2={y} />
                        ))}
                        {[80, 160, 240, 320, 400, 480].map((x) => (
                            <line key={x} x1={x} x2={x} y1='40' y2='240' />
                        ))}
                    </g>
                    <path
                        d='M50 200 C120 160 160 180 200 170 C240 160 270 110 320 130 C360 150 380 180 480 120 V240 H50 Z'
                        fill='url(#monthlyRevenueGradient)'
                    />
                    <path
                        d='M50 200 C120 160 160 180 200 170 C240 160 270 110 320 130 C360 150 380 180 480 120'
                        stroke='#3b82f6'
                        strokeWidth='4'
                        strokeLinecap='round'
                        fill='none'
                    />
                    {[
                        { x: 80, label: 'Jan' },
                        { x: 160, label: 'Feb' },
                        { x: 240, label: 'Mar' },
                        { x: 320, label: 'Apr' },
                        { x: 400, label: 'May' },
                        { x: 480, label: 'Jun' },
                    ].map((point) => (
                        <text key={point.label} x={point.x} y='255' fontSize='12' textAnchor='middle' className='fill-slate-400'>
                            {point.label}
                        </text>
                    ))}
                </svg>
            </div>
        </section>
    );
}

function PerformanceCard() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-sm font-semibold text-slate-700'>Performance Metrics</h3>
            <p className='text-xs text-slate-400'>Key operational KPIs based on the selected period</p>
            <div className='mt-6 space-y-4'>
                {performanceMetrics.map((metric) => (
                    <MetricBar key={metric.name} metric={metric} />)
                )}
            </div>
        </section>
    );
}

function TopCustomersPanel() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-sm font-semibold text-slate-700'>Top Customers by Revenue</h3>
            <div className='mt-4 space-y-3'>
                {topCustomers.map((customer) => (
                    <CustomerRow key={customer.rank} customer={customer} />
                ))}
            </div>
        </section>
    );
}

function ExportReportsPanel() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-sm font-semibold text-slate-700'>Export Reports</h3>
            <p className='text-xs text-slate-400'>Download recurring reports or generate custom output.</p>
            <div className='mt-4 space-y-3'>
                {exportOptions.map((option) => (
                    <ExportButton key={option.label} option={option} />
                ))}
            </div>
            <button
                type='button'
                className='mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-500 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50'
            >
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                    <path d='M12 5v14M5 12h14' strokeLinecap='round' />
                </svg>
                Custom Report
            </button>
        </section>
    );
}

export default function ReportContent() {
    return (
        <div className='flex flex-col gap-8'>
            <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-wrap items-center gap-3'>
                    <button
                        type='button'
                        className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600'
                    >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                            <path d='M4 6h16' strokeLinecap='round' />
                            <path d='M8 6v12' />
                            <path d='M12 10v8' />
                            <path d='M16 8v10' />
                        </svg>
                        Filter
                    </button>
                    <button
                        type='button'
                        className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600'
                    >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                            <path d='M8 7h8M5 12h14M8 17h8' strokeLinecap='round' />
                        </svg>
                        Date Range
                    </button>
                    <button
                        type='button'
                        className='inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500'
                    >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                            <path d='M12 5v14' strokeLinecap='round' />
                            <path d='M5 12h14' strokeLinecap='round' />
                        </svg>
                        Export PDF
                    </button>
                </div>
            </header>

            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {kpiCards.map((card) => (
                    <KPI key={card.title} card={card} />
                ))}
            </section>

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <RevenueChart />
                <PerformanceCard />
            </section>

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <TopCustomersPanel />
                <ExportReportsPanel />
            </section>
        </div>
    );
}