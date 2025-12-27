import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterDropdown from '../components/common/FilterDropdown';
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

// Helper function to format currency - exact format matching Invoice module
const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'Rp 0';
    const num = parseFloat(value);
    return `Rp ${num.toLocaleString('id-ID')}`;
};

// Helper function to format number
const formatNumber = (value) => {
    if (value === null || value === undefined) return '0';
    return parseInt(value).toLocaleString('id-ID');
};

// Static icon definitions for KPI cards
const kpiIcons = {
    revenue: (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
            <path d='M4 19h16' strokeLinecap='round' />
            <path d='M7 15v-6l4 3 4-3v6' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M12 4v7' strokeLinecap='round' />
        </svg>
    ),
    orders: (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
            <path d='M3 7h18l-2 10H5L3 7Z' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M7 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2' />
        </svg>
    ),
    delivery: (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
            <circle cx='12' cy='12' r='8' />
            <path d='M12 7v5l3 2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
    ),
    satisfaction: (
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
            <path d='M12 21a9 9 0 1 1 9-9' strokeLinecap='round' strokeLinejoin='round' />
            <path d='m16 11-3 3-1.5-1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
    ),
};

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

function KPI({ card, isLoading }) {
    return (
        <article className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div>
                <p className='text-sm text-slate-400'>{card.title}</p>
                {isLoading ? (
                    <div className='mt-2 h-8 w-24 animate-pulse rounded bg-slate-200'></div>
                ) : (
                    <p className='mt-2 text-2xl font-semibold text-slate-900'>{card.value}</p>
                )}
                {isLoading ? (
                    <div className='mt-1 h-4 w-32 animate-pulse rounded bg-slate-100'></div>
                ) : (
                    <p className={`mt-1 text-xs font-semibold ${card.deltaColor || 'text-emerald-500'}`}>{card.delta}</p>
                )}
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

function SimpleRevenueChart({ revenueData, totalRevenue, isLoading }) {
    const chartData = revenueData.length > 0 ? revenueData : [
        { month: '-', revenue: 0 },
    ];

    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-sm font-semibold text-slate-700'>Monthly Revenue</h3>
                    <p className='text-xs text-slate-400'>Revenue trends over the selected period</p>
                </div>
                <div className='text-right'>
                    {isLoading ? (
                        <div className='h-8 w-28 animate-pulse rounded bg-slate-200'></div>
                    ) : (
                        <div className='text-2xl font-bold text-blue-600'>{formatCurrency(totalRevenue)}</div>
                    )}
                    <div className='text-xs text-green-600'>From selected period</div>
                </div>
            </div>
            <div className='mt-6 h-70'>
                {isLoading ? (
                    <div className='flex h-full items-center justify-center'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    </div>
                ) : (
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={chartData} barSize={32} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid stroke='rgba(226,232,240,0.5)' vertical={false} />
                            <XAxis dataKey='month' tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => 'Rp ' + v + 'M'} />
                            <ReTooltip formatter={v => 'Rp ' + v + 'M'} contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 8, borderColor: '#3b82f6', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            <ReBar dataKey='revenue' fill='rgba(59,130,246,0.8)' radius={[8, 8, 0, 0]}>
                                <LabelList dataKey='revenue' position='top' formatter={v => 'Rp ' + v + 'M'} style={{ fill: '#3b82f6', fontWeight: 600, fontSize: 12 }} />
                            </ReBar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}

function PerformanceCard({ performanceData, isLoading }) {
    const data = performanceData.length > 0 ? performanceData : [
        { name: 'On-Time Delivery', value: 0, color: '#10b981' },
        { name: 'Completion Rate', value: 0, color: '#3b82f6' },
        { name: 'Fleet Utilization', value: 0, color: '#f59e0b' },
        { name: 'Driver Efficiency', value: 0, color: '#8b5cf6' },
    ];

    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'>
            <h3 className='text-sm font-semibold text-slate-700'>Performance Metrics</h3>
            <p className='text-xs text-slate-400'>Key operational KPIs based on the selected period</p>
            <div className='mt-6 h-96'>
                {isLoading ? (
                    <div className='flex h-full items-center justify-center'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    </div>
                ) : (
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={data} layout='vertical' margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={28}>
                            <CartesianGrid stroke='rgba(226,232,240,0.5)' horizontal={true} vertical={false} />
                            <XAxis type='number' domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} />
                            <YAxis type='category' dataKey='name' tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={140} />
                            <ReTooltip formatter={v => v + '%'} contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: 8, borderColor: '#3b82f6', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            <ReBar dataKey='value' radius={6} isAnimationActive fill='#3b82f6'>
                                {data.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                ))}
                                <LabelList dataKey='value' position='right' formatter={v => v + '%'} style={{ fill: '#3b82f6', fontWeight: 600, fontSize: 12 }} />
                            </ReBar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}

function TopCustomersPanel({ customers, isLoading }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-sm font-semibold text-slate-700'>Top Customers by Revenue</h3>
            <div className='mt-4 space-y-3'>
                {isLoading ? (
                    [1, 2, 3, 4].map((i) => (
                        <div key={i} className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                <div className='h-10 w-10 animate-pulse rounded-full bg-slate-200'></div>
                                <div>
                                    <div className='h-4 w-24 animate-pulse rounded bg-slate-200'></div>
                                    <div className='mt-1 h-3 w-16 animate-pulse rounded bg-slate-100'></div>
                                </div>
                            </div>
                            <div className='text-right'>
                                <div className='h-4 w-20 animate-pulse rounded bg-slate-200'></div>
                                <div className='mt-1 h-3 w-12 animate-pulse rounded bg-slate-100'></div>
                            </div>
                        </div>
                    ))
                ) : customers.length > 0 ? (
                    customers.map((customer) => (
                        <CustomerRow key={customer.rank} customer={customer} />
                    ))
                ) : (
                    <div className='text-center py-8 text-slate-400'>
                        <p>No customer data available for this period</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function ExportReportsPanel() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-full flex flex-col'>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className='text-sm font-semibold text-slate-700'>Export Reports</h3>
                    <p className='text-xs text-slate-400'>Download current report data</p>
                </div>
            </div>

            {/* Export Options */}
            <div className='flex-1 space-y-3 overflow-y-auto'>
                {exportOptions.map((option) => (
                    <SimpleExportButton key={option.format} option={option} />
                ))}
            </div>

            {/* Divider */}
            <div className="my-2 border-t border-slate-200"></div>

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
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data states
    const [kpiData, setKpiData] = useState([]);
    const [revenueChartData, setRevenueChartData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [performanceData, setPerformanceData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);

    const periodOptions = [
        { value: '7d', label: '7 Hari Terakhir' },
        { value: '30d', label: '30 Hari Terakhir' },
        { value: '90d', label: '90 Hari Terakhir' }
    ];

    // Calculate date range based on selected period
    const getDateRange = (period) => {
        const endDate = new Date();
        const startDate = new Date();

        switch (period) {
            case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(endDate.getDate() - 90);
                break;
            default:
                startDate.setDate(endDate.getDate() - 30);
        }

        return {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        };
    };

    // Fetch all report data
    const fetchReportData = async () => {
        setIsLoading(true);
        setError(null);

        const { start_date, end_date } = getDateRange(selectedPeriod);

        try {
            // Fetch sales data
            const salesResponse = await axios.get('/reports/sales', {
                params: { start_date, end_date, group_by: 'month' }
            });

            // Fetch operational data
            const operationalResponse = await axios.get('/reports/operational', {
                params: { start_date, end_date }
            });

            const salesData = salesResponse.data.data;
            const operationalData = operationalResponse.data.data;

            // Process KPI cards
            const kpiCards = [
                {
                    title: 'Total Revenue',
                    value: formatCurrency(salesData.summary.total_revenue),
                    delta: `${salesData.summary.total_customers || 0} customers`,
                    deltaColor: 'text-emerald-500',
                    iconBg: 'bg-sky-100',
                    iconColor: 'text-sky-600',
                    icon: kpiIcons.revenue,
                },
                {
                    title: 'Total Orders',
                    value: formatNumber(salesData.summary.total_orders),
                    delta: `${salesData.summary.completion_rate || 0}% completed`,
                    deltaColor: 'text-emerald-500',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-500',
                    icon: kpiIcons.orders,
                },
                {
                    title: 'Active Drivers',
                    value: formatNumber(operationalData.summary.active_drivers),
                    delta: `${operationalData.summary.active_vehicles || 0} vehicles active`,
                    deltaColor: 'text-amber-500',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-500',
                    icon: kpiIcons.delivery,
                },
                {
                    title: 'Delivery Success',
                    value: `${operationalData.summary.delivery_success_rate || 0}%`,
                    delta: `${operationalData.summary.manifest_completion_rate || 0}% manifest completed`,
                    deltaColor: 'text-purple-500',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-500',
                    icon: kpiIcons.satisfaction,
                },
            ];
            setKpiData(kpiCards);
            setTotalRevenue(salesData.summary.total_revenue || 0);

            // Process revenue chart data
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
            const chartData = (salesData.sales_trend || []).map(item => ({
                month: item.period ? monthNames[parseInt(item.period.split('-')[1]) - 1] || item.period : item.period,
                revenue: Math.round((parseFloat(item.total_revenue) || 0) / 1000000) // Convert to millions
            }));
            setRevenueChartData(chartData);

            // Process performance metrics
            const perfData = [
                {
                    name: 'On-Time Delivery',
                    value: parseFloat(operationalData.summary.delivery_success_rate || 0).toFixed(1),
                    color: '#10b981'
                },
                {
                    name: 'Completion Rate',
                    value: parseFloat(salesData.summary.completion_rate || 0).toFixed(1),
                    color: '#3b82f6'
                },
                {
                    name: 'Manifest Completion',
                    value: parseFloat(operationalData.summary.manifest_completion_rate || 0).toFixed(1),
                    color: '#f59e0b'
                },
                {
                    name: 'Fleet Utilization',
                    value: operationalData.summary.active_vehicles > 0 ?
                        Math.min(100, ((operationalData.summary.avg_deliveries_per_driver || 0) * 10)).toFixed(1) : '0.0',
                    color: '#8b5cf6'
                },
            ];
            setPerformanceData(perfData);

            // Process top customers
            const maxRevenue = salesData.customer_distribution?.[0]?.total_revenue || 1;
            const customersData = (salesData.customer_distribution || []).slice(0, 5).map((customer, index) => ({
                rank: index + 1,
                name: customer.customer_name || 'Unknown',
                orders: customer.order_count || 0,
                revenue: formatCurrency(customer.total_revenue),
                share: `${((customer.total_revenue / maxRevenue) * 100).toFixed(1)}%`
            }));
            setTopCustomers(customersData);

        } catch (err) {
            console.error('Error fetching report data:', err);
            setError('Gagal memuat data laporan. Silakan coba lagi.');

            // Set empty/default data on error
            setKpiData([
                { title: 'Total Revenue', value: 'Rp 0', delta: 'No data', deltaColor: 'text-slate-400', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', icon: kpiIcons.revenue },
                { title: 'Total Orders', value: '0', delta: 'No data', deltaColor: 'text-slate-400', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500', icon: kpiIcons.orders },
                { title: 'Active Drivers', value: '0', delta: 'No data', deltaColor: 'text-slate-400', iconBg: 'bg-amber-100', iconColor: 'text-amber-500', icon: kpiIcons.delivery },
                { title: 'Delivery Success', value: '0%', delta: 'No data', deltaColor: 'text-slate-400', iconBg: 'bg-purple-100', iconColor: 'text-purple-500', icon: kpiIcons.satisfaction },
            ]);
            setRevenueChartData([]);
            setPerformanceData([]);
            setTopCustomers([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount and when period changes
    useEffect(() => {
        fetchReportData();
    }, [selectedPeriod]);

    return (
        <div className='flex flex-col gap-5'>
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
                        onClick={fetchReportData}
                        className='inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600'
                    >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}>
                            <path d='M4 4v5h.582m15.356 2A8 8 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8 8 0 0 1-15.357-2m15.357 2H15' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        Refresh
                    </button>
                </div>
            </header>

            {error && (
                <div className='rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600'>
                    {error}
                </div>
            )}

            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {kpiData.length > 0 ? (
                    kpiData.map((card) => (
                        <KPI key={card.title} card={card} isLoading={isLoading} />
                    ))
                ) : (
                    [1, 2, 3, 4].map((i) => (
                        <div key={i} className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                            <div className='h-4 w-20 animate-pulse rounded bg-slate-200'></div>
                            <div className='mt-2 h-8 w-24 animate-pulse rounded bg-slate-200'></div>
                            <div className='mt-1 h-4 w-32 animate-pulse rounded bg-slate-100'></div>
                        </div>
                    ))
                )}
            </section>

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
                <div className='xl:col-span-2'>
                    <SimpleRevenueChart
                        revenueData={revenueChartData}
                        totalRevenue={totalRevenue}
                        isLoading={isLoading}
                    />
                </div>
                <ExportReportsPanel />
            </section>

            <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
                <PerformanceCard performanceData={performanceData} isLoading={isLoading} />
                <TopCustomersPanel customers={topCustomers} isLoading={isLoading} />
            </section>
        </div>
    );
}