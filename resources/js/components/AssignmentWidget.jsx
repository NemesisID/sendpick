import React, { useState, useEffect } from 'react';

const assignmentSummaryData = {
    todayAssignments: [
        {
            id: 'ASG-2024-001',
            type: 'driver_assignment',
            assignedTo: 'Budi Santoso',
            jobOrder: 'JO-2024-874',
            customer: 'PT Maju Jaya',
            route: 'Jakarta → Surabaya',
            startTime: '08:00',
            status: 'active',
            priority: 'high',
        },
        {
            id: 'ASG-2024-003',
            type: 'loading_supervisor',
            assignedTo: 'Roni Setiawan',
            jobOrder: 'JO-2024-876',
            customer: 'PT Nusantara',
            route: 'Jakarta → Medan',
            startTime: '08:00',
            status: 'pending',
            priority: 'high',
        },
        {
            id: 'ASG-2024-004',
            type: 'quality_check',
            assignedTo: 'Maya Sari',
            jobOrder: 'JO-2024-877',
            customer: 'CV Sukses Mandiri',
            route: 'Bandung → Makassar',
            startTime: '09:30',
            status: 'completed',
            priority: 'medium',
        },
        {
            id: 'ASG-2024-005',
            type: 'driver_assignment',
            assignedTo: 'Agus Rahman',
            jobOrder: 'JO-2024-878',
            customer: 'PT Sejahtera Abadi',
            route: 'Jakarta → Bali',
            startTime: '10:00',
            status: 'pending',
            priority: 'medium',
        },
        {
            id: 'ASG-2024-006',
            type: 'loading_supervisor',
            assignedTo: 'Doni Pratama',
            jobOrder: 'JO-2024-879',
            customer: 'CV Mitra Logistik',
            route: 'Surabaya → Balikpapan',
            startTime: '11:30',
            status: 'active',
            priority: 'low',
        },
        {
            id: 'ASG-2024-007',
            type: 'delivery_coordinator',
            assignedTo: 'Sari Indah',
            jobOrder: 'JO-2024-880',
            customer: 'PT Global Express',
            route: 'Medan → Aceh',
            startTime: '12:00',
            status: 'standby',
            priority: 'high',
        },
    ],
    metrics: {
        totalToday: 12,
        active: 5,
        completed: 4,
        pending: 3,
        overdue: 0,
    },
};

const statusStyles = {
    pending: {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        dot: 'bg-amber-400',
    },
    active: {
        label: 'Active',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        dot: 'bg-blue-400',
    },
    completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        dot: 'bg-emerald-400',
    },
    overdue: {
        label: 'Overdue',
        bg: 'bg-red-50',
        text: 'text-red-600',
        dot: 'bg-red-400',
    },
};

const priorityStyles = {
    low: 'border-l-slate-300',
    medium: 'border-l-amber-400',
    high: 'border-l-red-400',
    urgent: 'border-l-red-600',
};

const assignmentTypeLabels = {
    driver_assignment: 'Driver',
    quality_check: 'QC',
    loading_supervisor: 'Loading',
    delivery_coordinator: 'Delivery',
};

const UserIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
        <circle cx='12' cy='7' r='4' />
    </svg>
);

const TruckIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M14 18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' />
        <path d='M15 18H9' />
        <path d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' />
        <circle cx='17' cy='18' r='2' />
        <circle cx='7' cy='18' r='2' />
    </svg>
);

const CheckCircleIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='8' />
        <path d='m9 12 2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ClockIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='9' />
        <path d='M12 7v5l3 2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ArrowRightIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M5 12h14M12 5l7 7-7 7' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

function StatusBadge({ status, size = 'sm' }) {
    const style = statusStyles[status] ?? statusStyles.pending;
    const sizeClass = size === 'xs' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs';
    
    return (
        <span className={`inline-flex items-center rounded-full font-medium ${style.bg} ${style.text} ${sizeClass}`}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${style.dot}`}></span>
            {style.label}
        </span>
    );
}

function AssignmentTypeIcon({ type, className = 'h-4 w-4' }) {
    switch (type) {
        case 'driver_assignment':
            return <TruckIcon className={className} />;
        case 'quality_check':
            return <CheckCircleIcon className={className} />;
        case 'loading_supervisor':
            return <UserIcon className={className} />;
        default:
            return <UserIcon className={className} />;
    }
}

function AssignmentItem({ assignment }) {
    return (
        <div className={`flex items-center justify-between rounded-2xl border-l-4 bg-white p-4 shadow-sm transition hover:shadow-md ${priorityStyles[assignment.priority]}`}>
            <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600'>
                    <AssignmentTypeIcon type={assignment.type} className='h-5 w-5' />
                </div>
                <div>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold text-slate-800'>{assignment.assignedTo}</p>
                        <span className='text-xs text-slate-400'>•</span>
                        <span className='text-xs font-medium text-slate-600'>
                            {assignmentTypeLabels[assignment.type]}
                        </span>
                    </div>
                    <p className='text-sm text-slate-600'>{assignment.customer}</p>
                    <p className='text-xs text-slate-500'>{assignment.route}</p>
                </div>
            </div>
            <div className='flex items-center gap-3'>
                <div className='text-right'>
                    <div className='flex items-center gap-1 text-xs text-slate-500'>
                        <ClockIcon className='h-3 w-3' />
                        <span>{assignment.startTime}</span>
                    </div>
                    <StatusBadge status={assignment.status} size='xs' />
                </div>
            </div>
        </div>
    );
}

function AssignmentMetrics({ metrics }) {
    return (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            <div className='text-center'>
                <p className='text-2xl font-bold text-slate-900'>{metrics.totalToday}</p>
                <p className='text-xs text-slate-500'>Total Today</p>
            </div>
            <div className='text-center'>
                <p className='text-2xl font-bold text-blue-600'>{metrics.active}</p>
                <p className='text-xs text-slate-500'>Active</p>
            </div>
            <div className='text-center'>
                <p className='text-2xl font-bold text-emerald-600'>{metrics.completed}</p>
                <p className='text-xs text-slate-500'>Completed</p>
            </div>
            <div className='text-center'>
                <p className='text-2xl font-bold text-amber-600'>{metrics.pending}</p>
                <p className='text-xs text-slate-500'>Pending</p>
            </div>
        </div>
    );
}

export default function AssignmentWidget({ limit = 5, showMetrics = true }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [displayLimit, setDisplayLimit] = useState(limit); // ✅ State untuk limit tampilan

    useEffect(() => {
        const timer = setTimeout(() => {
            setData(assignmentSummaryData);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // ✅ Handler untuk expand/collapse widget
    const handleViewAll = () => {
        console.log('View All clicked!', { data, displayLimit, limit }); // Debug log
        if (data && data.todayAssignments) {
            setDisplayLimit(data.todayAssignments.length); // Tampilkan semua
            console.log('Setting display limit to:', data.todayAssignments.length);
        }
    };

    const handleShowLess = () => {
        console.log('Show Less clicked!'); // Debug log
        setDisplayLimit(limit); // Kembali ke limit awal
    };

    const handleShowMore = () => {
        console.log('Show More clicked!', { data, displayLimit }); // Debug log
        if (data && data.todayAssignments) {
            setDisplayLimit(data.todayAssignments.length); // Tampilkan semua
            console.log('Setting display limit to:', data.todayAssignments.length);
        }
    };

    const isExpanded = data && displayLimit > limit;

    if (loading || !data) {
        return (
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='animate-pulse space-y-6'>
                    <div className='flex items-center justify-between'>
                        <div className='space-y-2'>
                            <div className='h-5 w-40 rounded bg-slate-200'></div>
                            <div className='h-4 w-32 rounded bg-slate-200'></div>
                        </div>
                        <div className='h-8 w-20 rounded bg-slate-200'></div>
                    </div>
                    <div className='grid grid-cols-4 gap-4'>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className='space-y-2'>
                                <div className='h-4 w-12 rounded bg-slate-200'></div>
                                <div className='h-6 w-8 rounded bg-slate-200'></div>
                            </div>
                        ))}
                    </div>
                    <div className='space-y-3'>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className='flex items-center gap-3 rounded-2xl border border-slate-100 p-4'>
                                <div className='h-10 w-10 rounded-lg bg-slate-200'></div>
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 w-24 rounded bg-slate-200'></div>
                                    <div className='h-3 w-32 rounded bg-slate-200'></div>
                                </div>
                                <div className='h-6 w-16 rounded bg-slate-200'></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const displayAssignments = data?.todayAssignments?.slice(0, displayLimit) || [];

    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Today's Assignments</h2>
                    <p className='text-sm text-slate-500'>Active task assignments for today</p>
                </div>
                <button
                    type='button'
                    onClick={isExpanded ? handleShowLess : handleViewAll} // ✅ Toggle expand/collapse
                    className='inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
                >
                    {isExpanded ? 'Show Less' : 'View All'}
                    <ArrowRightIcon className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {showMetrics && (
                <div className='mt-6'>
                    <AssignmentMetrics metrics={data.metrics} />
                </div>
            )}

            <div className='mt-6 space-y-3'>
                {displayAssignments.length > 0 ? (
                    displayAssignments.map((assignment) => (
                        <AssignmentItem key={assignment.id} assignment={assignment} />
                    ))
                ) : (
                    <div className='flex items-center justify-center py-8 text-center'>
                        <div>
                            <div className='mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center'>
                                <UserIcon className='h-6 w-6 text-slate-400' />
                            </div>
                            <p className='mt-3 text-sm font-medium text-slate-800'>No assignments today</p>
                            <p className='text-xs text-slate-500'>All assignments for today have been completed.</p>
                        </div>
                    </div>
                )}
            </div>

            {data?.todayAssignments?.length > displayLimit && !isExpanded && (
                <div className='mt-4 text-center'>
                    <button
                        type='button'
                        onClick={handleShowMore} // ✅ Expand untuk show more
                        className='text-sm font-medium text-indigo-600 hover:text-indigo-700'
                    >
                        Show {(data?.todayAssignments?.length || 0) - displayLimit} more assignments
                    </button>
                </div>
            )}

            {isExpanded && (
                <div className='mt-4 text-center'>
                    <button
                        type='button'
                        onClick={handleShowLess}
                        className='text-sm font-medium text-indigo-600 hover:text-indigo-700'
                    >
                        ← Show Less
                    </button>
                </div>
            )}
        </section>
    );
}