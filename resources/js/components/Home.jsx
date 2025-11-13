import React from 'react';
import AssignmentWidget from './AssignmentWidget';
import { 
    HiClipboardDocumentList, 
    HiUser, 
    HiTruck, 
    HiClock, 
    HiArrowRight 
} from 'react-icons/hi2';
import {
    LineChart,
    Line as ReLine,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend as ReLegend
} from 'recharts';

const statCards = [
    {
        title: 'Total Orders',
        value: '1,247',
        delta: '+12% dari bulan lalu',
        deltaColor: 'text-emerald-500',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: <HiClipboardDocumentList className='h-5 w-5' />,
    },
    {
        title: 'Driver Aktif',
        value: '89',
        delta: '85% sedang beroperasi',
        deltaColor: 'text-emerald-500',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: <HiUser className='h-5 w-5' />,
    },
    {
        title: 'Kendaraan Aktif',
        value: '45',
        delta: '3 dalam maintenance',
        deltaColor: 'text-amber-500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: <HiTruck className='h-5 w-5' />,
    },
    {
        title: 'OTIF Rate',
        value: '94.2%',
        delta: 'Target: 95%',
        deltaColor: 'text-emerald-500',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: <HiClock className='h-5 w-5' />,
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
  const monthlyData = [
    { month: 'Jan', orders: 120 },
    { month: 'Feb', orders: 135 },
    { month: 'Mar', orders: 180 },
    { month: 'Apr', orders: 220 },
    { month: 'Mei', orders: 160 },
    { month: 'Jun', orders: 240 },
  ];
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
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid stroke='#e2e8f0' strokeDasharray='3 3' />
            <XAxis dataKey='month' tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => v + ' Orders'} />
            <ReTooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 8, borderColor: '#3b82f6', color: '#fff' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <ReLine type='monotone' dataKey='orders' stroke='#3b82f6' strokeWidth={3} dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} fill='rgba(59,130,246,0.1)' />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function ShipmentStatusCard() {
    const shipmentData = [
        { name: 'Delivered', value: 83, color: '#10b981', labelClass: 'text-emerald-500' },
        { name: 'In Transit', value: 11, color: '#3b82f6', labelClass: 'text-blue-500' },
        { name: 'Pending', value: 4, color: '#f59e0b', labelClass: 'text-amber-500' },
        { name: 'Cancelled', value: 2, color: '#ef4444', labelClass: 'text-red-500' },
    ];
    return (
        <section className='w-full max-w-xs rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <p className='text-sm text-slate-500'>Status Pengiriman</p>
            <div className='mt-6 flex flex-col items-center gap-4'>
                <div className='h-44 w-44'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                            <Pie
                                data={shipmentData}
                                dataKey='value'
                                nameKey='name'
                                cx='50%'
                                cy='50%'
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                label={false}
                                stroke='#fff'
                                strokeWidth={3}
                            >
                                {shipmentData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <ReTooltip
                                formatter={(value, name) => [`${value}%`, name]}
                                contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 8, borderColor: '#3b82f6', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className='space-y-1 text-xs font-medium text-slate-600'>
                    {shipmentData.map((entry) => (
                        <p key={entry.name} className={entry.labelClass}>{entry.name} {entry.value}%</p>
                    ))}
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
                                <HiClipboardDocumentList className='h-5 w-5 text-indigo-500' />
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
            <section className='flex flex-col gap-6 xl:flex-row'>
                <AssignmentWidget limit={6} showMetrics={true} />
                <TransactionsCard />
            </section>
        </>
    );
}