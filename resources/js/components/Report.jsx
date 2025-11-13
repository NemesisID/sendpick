import React, { useState } from 'react';
import FilterDropdown from './common/FilterDropdown';
import {
    BarChart,
    Bar as ReBar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    Legend as ReLegend,
    LabelList,
    Cell
} from 'recharts';

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
    { 
        label: 'Download Report (PDF)', 
        icon: '📄', 
        format: 'pdf',
        options: [
            { value: 'summary', label: 'Summary' },
            { value: 'detailed', label: 'Detailed' }
        ]
    },
    { 
        label: 'Export Data (CSV)', 
        icon: '📋', 
        format: 'csv',
        options: [
            { value: 'all', label: 'All Data' },
            { value: 'filtered', label: 'Current View' }
        ]
    },
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

function SimpleExportButton({ option }) {
    const handleExport = (exportType) => {
        console.log(`Exporting ${option.format} - ${exportType}...`);
        // TODO: Implement actual export functionality
        
        // Simulate export process
        if (exportType === 'summary') {
            console.log('Exporting PDF summary report...');
        } else if (exportType === 'detailed') {
            console.log('Exporting detailed PDF report...');
        } else if (exportType === 'all') {
            console.log('Exporting all data to CSV...');
        } else if (exportType === 'filtered') {
            console.log('Exporting current filtered data to CSV...');
        }
    };

    return (
        <div className="space-y-3">
            {/* Export Type Label */}
            <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <span className="text-base">{option.icon}</span>
                {option.label}
            </div>
            
            {/* Two Export Buttons */}
            <div className="flex gap-2">
                {option.options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleExport(opt.value)}
                        className="flex-1 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            
            {/* Helper Text */}
            <div className="text-xs text-slate-400">
                {option.format === 'pdf' ? (
                    <>
                        <span className="font-medium">Summary:</span> Key metrics only • 
                        <span className="font-medium"> Detailed:</span> Complete report
                    </>
                ) : (
                    <>
                        <span className="font-medium">All Data:</span> Complete dataset • 
                        <span className="font-medium"> Current View:</span> Filtered data
                    </>
                )}
            </div>
        </div>
    );
}

function SimpleRevenueChart() {
  const revenueData = [
    { month: 'Jan', revenue: 45 },
    { month: 'Feb', revenue: 52 },
    { month: 'Mar', revenue: 48 },
    { month: 'Apr', revenue: 61 },
    { month: 'Mei', revenue: 55 },
    { month: 'Jun', revenue: 67 },
  ];
  return (
    <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-sm font-semibold text-slate-700'>Monthly Revenue</h3>
          <p className='text-xs text-slate-400'>Revenue trends over the last 6 months</p>
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold text-blue-600'>Rp 322M</div>
          <div className='text-xs text-green-600'>+18.2% vs last period</div>
        </div>
      </div>
      <div className='mt-6 h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={revenueData} barSize={32} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid stroke='rgba(226,232,240,0.5)' vertical={false} />
            <XAxis dataKey='month' tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => 'Rp ' + v + 'M'} />
            <ReTooltip formatter={v => 'Rp ' + v + 'M'} contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 8, borderColor: '#3b82f6', color: '#fff' }} itemStyle={{ color: '#fff' }} />
            <ReBar dataKey='revenue' fill='rgba(59,130,246,0.8)' radius={[8, 8, 0, 0]}>
              <LabelList dataKey='revenue' position='top' formatter={v => 'Rp ' + v + 'M'} style={{ fill: '#3b82f6', fontWeight: 600, fontSize: 12 }} />
            </ReBar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function PerformanceCard() {
  const performanceData = performanceMetrics.map(metric => ({ name: metric.name, value: metric.value, color: metric.color }));
  return (
    <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
      <h3 className='text-sm font-semibold text-slate-700'>Performance Metrics</h3>
      <p className='text-xs text-slate-400'>Key operational KPIs based on the selected period</p>
      <div className='mt-6 h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={performanceData} layout='vertical' margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={28}>
            <CartesianGrid stroke='rgba(226,232,240,0.5)' horizontal={true} vertical={false} />
            <XAxis type='number' domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} />
            <YAxis type='category' dataKey='name' tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={140} />
            <ReTooltip formatter={v => v + '%'} contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 8, borderColor: '#3b82f6', color: '#fff' }} itemStyle={{ color: '#fff' }} />
            <ReBar dataKey='value' radius={6} isAnimationActive fill='#3b82f6'>
              {performanceData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color.replace('bg-', '').replace('-500', '')} />
              ))}
              <LabelList dataKey='value' position='right' formatter={v => v + '%'} style={{ fill: '#3b82f6', fontWeight: 600, fontSize: 12 }} />
            </ReBar>
          </BarChart>
        </ResponsiveContainer>
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
    const [exportPeriod, setExportPeriod] = useState('7d');
    
    const exportPeriodOptions = [
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' }
    ];

    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className='text-sm font-semibold text-slate-700'>Export Reports</h3>
                    <p className='text-xs text-slate-400'>Download current report data</p>
                </div>
            </div>

            {/* Period Selector */}
            <div className="mb-6">
                <label className="block text-xs font-medium text-slate-600 mb-2">
                    Export Period
                </label>
                <FilterDropdown
                    value={exportPeriod}
                    onChange={setExportPeriod}
                    options={exportPeriodOptions}
                    widthClass="w-full"
                    placeholder="Pilih periode export"
                />
            </div>

            {/* Export Options */}
            <div className='space-y-6'>
                {exportOptions.map((option) => (
                    <SimpleExportButton key={option.format} option={option} />
                ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-slate-200"></div>

            {/* Quick Export All Button */}
            <button
                type="button"
                className="w-full px-4 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                    console.log('Quick export all data...');
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M12 5v14" strokeLinecap="round" />
                    <path d="M5 12h14" strokeLinecap="round" />
                </svg>
                Export All Data
            </button>
        </section>
    );
}

export default function ReportContent() {
    const [selectedPeriod, setSelectedPeriod] = useState('7d');
    
    const periodOptions = [
        { value: '7d', label: '7 Hari Terakhir' },
        { value: '30d', label: '30 Hari Terakhir' },
        { value: '90d', label: '90 Hari Terakhir' }
    ];

    return (
        <div className='flex flex-col gap-8'>
            <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between -mt-2'>
                <div>
                    <h1 className='text-2xl font-semibold text-slate-900'>Reports & Exports</h1>
                    <p className='text-sm text-slate-500'>Analytics overview dan export data laporan operasional</p>
                </div>
                
                <div className='flex items-center gap-3'>
                    <FilterDropdown
                        value={selectedPeriod}
                        onChange={setSelectedPeriod}
                        options={periodOptions}
                        widthClass="w-48"
                        placeholder="Pilih periode"
                    />
                    <button
                        type='button'
                        className='inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600'
                    >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                            <path d='M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 2v-6.586a1 1 0 0 0-.293-.707L3.293 7.207A1 1 0 0 1 3 6.5V4z' />
                        </svg>
                        Filter
                    </button>
                </div>
            </header>

            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {kpiCards.map((card) => (
                    <KPI key={card.title} card={card} />
                ))}
            </section>

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
                <div className="xl:col-span-2">
                    <SimpleRevenueChart />
                </div>
                <div>
                    <ExportReportsPanel />
                </div>
            </section>

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <PerformanceCard />
                <TopCustomersPanel />
            </section>
        </div>
    );
}