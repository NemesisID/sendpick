import React, { useState, useEffect, useMemo } from 'react';
import EditModal from '../../../components/common/EditModal';
import { getAvailableDrivers } from '../../drivers/services/driverService';
import { fetchAvailableVehicles } from '../../vehicles/services/vehicleService';
import { assignDriver } from '../services/jobOrderService';

const assignmentData = [
    {
        id: 1,
        assignmentType: 'driver_assignment',
        assignedTo: 'Budi Santoso',
        assignedById: 'USR-001',
        assignedBy: 'Sari Wulandari',
        assignedByRole: 'Dispatcher',
        assignedAt: '2024-01-15 14:20:00',
        status: 'active',
        vehicle: 'B 1234 ABC',
        route: 'Jakarta DC → Surabaya Hub',
        estimatedDuration: '8 hours',
        notes: 'Assigned based on route optimization and driver availability',
        priority: 'high',
    },
    {
        id: 2,
        assignmentType: 'backup_driver',
        assignedTo: 'Andi Pratama',
        assignedById: 'USR-001',
        assignedBy: 'Sari Wulandari',
        assignedByRole: 'Dispatcher',
        assignedAt: '2024-01-15 14:25:00',
        status: 'standby',
        vehicle: 'B 5678 DEF',
        route: 'Jakarta DC → Surabaya Hub',
        estimatedDuration: '8 hours',
        notes: 'Backup driver in case primary driver is unavailable',
        priority: 'medium',
    },
    {
        id: 3,
        assignmentType: 'quality_check',
        assignedTo: 'Maya Sari',
        assignedById: 'USR-002',
        assignedBy: 'Ahmad Rizki',
        assignedByRole: 'Warehouse Manager',
        assignedAt: '2024-01-15 13:15:00',
        status: 'completed',
        vehicle: null,
        route: null,
        estimatedDuration: '30 minutes',
        notes: 'Quality check completed - all packages verified',
        priority: 'high',
        completedAt: '2024-01-15 13:45:00',
    },
    {
        id: 4,
        assignmentType: 'loading_supervisor',
        assignedTo: 'Roni Setiawan',
        assignedById: 'USR-002',
        assignedBy: 'Ahmad Rizki',
        assignedByRole: 'Warehouse Manager',
        assignedAt: '2024-01-16 07:30:00',
        status: 'pending',
        vehicle: 'B 1234 ABC',
        route: null,
        estimatedDuration: '45 minutes',
        notes: 'Supervise loading process for morning departure',
        priority: 'high',
    },
];

const assignmentTypeLabels = {
    driver_assignment: 'Driver Assignment',
    backup_driver: 'Backup Driver',
    quality_check: 'Quality Check',
    loading_supervisor: 'Loading Supervisor',
    delivery_coordinator: 'Delivery Coordinator',
};

const statusStyles = {
    pending: {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-200',
    },
    active: {
        label: 'Active',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
    },
    standby: {
        label: 'Standby',
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
    },
    completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
    },
    cancelled: {
        label: 'Cancelled',
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
    },
};

const priorityStyles = {
    low: {
        label: 'Low',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
    },
    medium: {
        label: 'Medium',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    high: {
        label: 'High',
        bg: 'bg-red-50',
        text: 'text-red-600',
    },
};

const UserIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
        <circle cx='12' cy='7' r='4' />
    </svg>
);

const ClockIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='9' />
        <path d='M12 7v5l3 2' strokeLinecap='round' strokeLinejoin='round' />
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

const PlusIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M12 5v14M5 12h14' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

function StatusBadge({ status }) {
    const style = statusStyles[status] ?? statusStyles.pending;
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${style.bg} ${style.text} ${style.border} border`}>
            {style.label}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const style = priorityStyles[priority] ?? priorityStyles.medium;
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function AssignmentItem({ assignment }) {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return {
            time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            date: date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
            }),
        };
    };

    const { time, date } = formatTime(assignment.assignedAt);

    const getAssignmentIcon = (type) => {
        switch (type) {
            case 'driver_assignment':
            case 'backup_driver':
                return <TruckIcon className='h-5 w-5' />;
            case 'quality_check':
                return <CheckCircleIcon className='h-5 w-5' />;
            default:
                return <UserIcon className='h-5 w-5' />;
        }
    };

    return (
        <div className='rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-sm'>
            <div className='flex items-start justify-between'>
                <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600'>
                        {getAssignmentIcon(assignment.assignmentType)}
                    </div>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                            <h3 className='font-semibold text-slate-800'>
                                {assignmentTypeLabels[assignment.assignmentType] || assignment.assignmentType}
                            </h3>
                            <StatusBadge status={assignment.status} />
                            <PriorityBadge priority={assignment.priority} />
                        </div>
                        <p className='mt-1 text-sm font-medium text-slate-700'>{assignment.assignedTo}</p>
                        <p className='text-xs text-slate-500'>
                            Assigned by {assignment.assignedBy} • {assignment.assignedByRole}
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-1 text-xs text-slate-500'>
                    <ClockIcon className='h-3 w-3' />
                    <span>{time} • {date}</span>
                </div>
            </div>

            {(assignment.vehicle || assignment.route || assignment.estimatedDuration) && (
                <div className='mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-3'>
                    {assignment.vehicle && (
                        <div>
                            <span className='font-medium text-slate-500'>Vehicle:</span> {assignment.vehicle}
                        </div>
                    )}
                    {assignment.route && (
                        <div>
                            <span className='font-medium text-slate-500'>Route:</span> {assignment.route}
                        </div>
                    )}
                    {assignment.estimatedDuration && (
                        <div>
                            <span className='font-medium text-slate-500'>Duration:</span> {assignment.estimatedDuration}
                        </div>
                    )}
                </div>
            )}

            {assignment.notes && (
                <div className='mt-3'>
                    <p className='text-xs text-slate-600'>{assignment.notes}</p>
                </div>
            )}

            {assignment.completedAt && (
                <div className='mt-3 text-xs text-emerald-600'>
                    <span className='font-medium'>Completed:</span> {formatTime(assignment.completedAt).time} • {formatTime(assignment.completedAt).date}
                </div>
            )}
        </div>
    );
}

function AssignmentFilter({ activeFilter, onFilterChange }) {
    const filters = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
    ];

    return (
        <div className='flex gap-2'>
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${activeFilter === filter.value
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}

export default function JobOrderAssignment({ jobOrderId, status }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isReadOnly = status === 'cancelled';

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setAssignments(assignmentData);
            setLoading(false);
        }, 400);
    }, [jobOrderId]);

    const filteredAssignments = assignments.filter(assignment => {
        if (filter === 'all') return true;
        return assignment.status === filter;
    });

    const fetchOptions = async () => {
        try {
            const [driversData, vehiclesData] = await Promise.all([
                getAvailableDrivers(),
                fetchAvailableVehicles()
            ]);
            setDrivers(driversData);
            setVehicles(vehiclesData);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleAddAssignment = () => {
        if (isReadOnly) return;
        fetchOptions();
        setIsModalOpen(true);
    };

    const handleSubmitAssignment = async (formData) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                status: 'Active' // Default status
            };
            await assignDriver(jobOrderId, payload);
            // Refresh assignments or add to list (mock for now as we don't have real fetch yet)
            console.log('Assignment created successfully');
            setIsModalOpen(false);
            // Optionally refresh list here if we had a real fetch
        } catch (error) {
            console.error('Error creating assignment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const assignmentFields = useMemo(() => [
        {
            name: 'driver_id',
            label: 'Driver',
            type: 'select',
            required: true,
            options: drivers.map(d => ({
                value: d.driver_id,
                label: d.driver_name
            }))
        },
        {
            name: 'vehicle_id',
            label: 'Kendaraan',
            type: 'select',
            required: true,
            options: vehicles.map(v => ({
                value: v.vehicle_id,
                label: `${v.license_plate} ${v.vehicle_type ? `(${v.vehicle_type})` : ''}`
            }))
        },
        {
            name: 'notes',
            label: 'Catatan',
            type: 'textarea',
            required: false,
            placeholder: 'Catatan tambahan untuk assignment',
            rows: 3
        }
    ], [drivers, vehicles]);

    if (loading) {
        return (
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <h2 className='text-lg font-semibold text-slate-900'>Assignment History</h2>
                <div className='mt-6 flex items-center justify-center py-8'>
                    <div className='h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600'></div>
                </div>
            </section>
        );
    }

    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Assignment History</h2>
                    <p className='text-sm text-slate-500'>Team assignments untuk job order {jobOrderId}</p>
                </div>
                <div className='flex items-center gap-3'>
                    <AssignmentFilter activeFilter={filter} onFilterChange={setFilter} />
                    <button
                        type='button'
                        onClick={handleAddAssignment}
                        disabled={isReadOnly}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${isReadOnly ? 'bg-slate-400 cursor-not-allowed opacity-75' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        title={isReadOnly ? "Tidak dapat menambah assignment pada order yang dibatalkan" : "Add Assignment"}
                    >
                        <PlusIcon className='h-3 w-3' />
                        Add Assignment
                    </button>
                </div>
            </div>

            <div className='mt-6'>
                {filteredAssignments.length > 0 ? (
                    <div className='space-y-3'>
                        {filteredAssignments.map((assignment) => (
                            <AssignmentItem key={assignment.id} assignment={assignment} />
                        ))}
                    </div>
                ) : (
                    <div className='flex items-center justify-center py-8 text-center'>
                        <div>
                            <div className='mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center'>
                                <UserIcon className='h-6 w-6 text-slate-400' />
                            </div>
                            <p className='mt-3 text-sm font-medium text-slate-800'>No assignments found</p>
                            <p className='text-xs text-slate-500'>No assignments matching the current filter.</p>
                        </div>
                    </div>
                )}
            </div>

            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitAssignment}
                title={`Assign Driver - ${jobOrderId}`}
                data={{}}
                fields={assignmentFields}
                isLoading={isSubmitting}
            />
        </section >
    );
}