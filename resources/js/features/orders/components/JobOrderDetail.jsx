import React, { useState, useEffect } from 'react';
import JobOrderStatusHistory from './JobOrderStatusHistory';
import JobOrderAssignment from './JobOrderAssignment';
import { getJobOrder } from '../services/jobOrderService';

const JobOrderDetail = ({ jobOrderId, onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [jobOrder, setJobOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadJobOrder = async () => {
        setLoading(true);
        try {
            const data = await getJobOrder(jobOrderId);
            if (data) {
                // Map API response to component state
                const activeAssignment = data.assignments?.find(a => a.status === 'Active') || data.assignments?.[0];

                setJobOrder({
                    id: data.job_order_id,
                    customer: data.customer?.customer_name || '-',
                    status: data.status?.toLowerCase() || 'pending',
                    priority: 'medium', // Default as not in API response yet
                    type: data.order_type || 'job_order',
                    origin: data.pickup_city || data.pickup_address || '-',
                    originAddress: data.pickup_address || '-',
                    destination: data.delivery_city || data.delivery_address || '-',
                    destinationAddress: data.delivery_address || '-',
                    createdAt: new Date(data.created_at).toLocaleString('id-ID'),
                    estimatedDelivery: data.ship_date ? new Date(data.ship_date).toLocaleDateString('id-ID') : '-',
                    packages: '-', // Not in API
                    totalWeight: `${data.goods_weight} kg`,
                    totalValue: data.order_value ? `Rp ${Number(data.order_value).toLocaleString('id-ID')}` : '-',
                    driver: activeAssignment?.driver?.driver_name || '-',
                    vehicle: activeAssignment?.vehicle ?
                        `${activeAssignment.vehicle.license_plate || activeAssignment.vehicle.plate_no || 'Unknown'} - ${activeAssignment.vehicle.vehicle_type?.name || 'Unknown Type'}`
                        : '-',
                    volume: data.goods_volume ? `${data.goods_volume} m³` : '-',
                    notes: data.goods_desc || '-',
                    statusHistories: data.status_histories || []
                });
            }
        } catch (err) {
            console.error('Error loading job order detail:', err);
            setError('Gagal memuat detail job order.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobOrderId) {
            loadJobOrder();
        }
    }, [jobOrderId]);

    const getStatusStyle = (status) => {
        const styles = {
            pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Pending' },
            assigned: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'Assigned' },
            in_progress: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'In Progress' },
            completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Completed' },
            cancelled: { bg: 'bg-red-50', text: 'text-red-600', label: 'Cancelled' },
            delivered: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Delivered' },
            created: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Created' }
        };
        return styles[status] || styles.pending;
    };

    const getPriorityStyle = (priority) => {
        const styles = {
            high: { bg: 'bg-red-50', text: 'text-red-600', label: 'High Priority' },
            medium: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: 'Medium Priority' },
            low: { bg: 'bg-green-50', text: 'text-green-600', label: 'Low Priority' }
        };
        return styles[priority] || styles.medium;
    };

    if (loading) {
        return <div className="p-6 text-center text-slate-500">Memuat detail job order...</div>;
    }

    if (error || !jobOrder) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500 mb-4">{error || 'Data tidak ditemukan'}</p>
                <button onClick={onBack} className="text-indigo-600 hover:underline">Kembali</button>
            </div>
        );
    }

    const statusStyle = getStatusStyle(jobOrder.status);
    const priorityStyle = getPriorityStyle(jobOrder.priority);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📋' },
        { id: 'status', label: 'Status History', icon: '📅' },
        { id: 'assignment', label: 'Assignment Management', icon: '👥' }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Job Orders
                    </button>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{jobOrder.id}</h1>
                        <p className="text-slate-600">{jobOrder.customer}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                            {priorityStyle.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Job Order Details */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Job Order Details</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-sm text-slate-500">Type</p>
                                            <p className="font-medium text-slate-900">{jobOrder.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Customer</p>
                                            <p className="font-medium text-slate-900">{jobOrder.customer}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Origin</p>
                                            <p className="font-medium text-slate-900">{jobOrder.origin}</p>
                                            <p className="text-xs text-slate-500 mt-1">{jobOrder.originAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Destination</p>
                                            <p className="font-medium text-slate-900">{jobOrder.destination}</p>
                                            <p className="text-xs text-slate-500 mt-1">{jobOrder.destinationAddress}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Volume</p>
                                            <p className="font-medium text-slate-900">{jobOrder.volume}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Total Weight</p>
                                            <p className="font-medium text-slate-900">{jobOrder.totalWeight}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Driver</p>
                                            <p className="font-medium text-slate-900">{jobOrder.driver}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Vehicle</p>
                                            <p className="font-medium text-slate-900">{jobOrder.vehicle}</p>
                                        </div>
                                    </div>
                                    {jobOrder.notes && (
                                        <div className="mt-4">
                                            <p className="text-sm text-slate-500">Notes</p>
                                            <p className="font-medium text-slate-900">{jobOrder.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Summary</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-slate-500">Created</p>
                                            <p className="font-medium text-slate-900">{jobOrder.createdAt}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Total Value</p>
                                            <p className="font-medium text-slate-900">{jobOrder.totalValue}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Estimated Delivery</p>
                                            <p className="font-medium text-slate-900">{jobOrder.estimatedDelivery}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Packages</p>
                                            <p className="font-medium text-slate-900">{jobOrder.packages}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <JobOrderStatusHistory
                            jobOrderId={jobOrder.id}
                            historyData={jobOrder.statusHistories}
                        />
                    )}

                    {activeTab === 'assignment' && (
                        <JobOrderAssignment
                            jobOrderId={jobOrder.id}
                            status={jobOrder.status}
                            onAssignmentUpdate={loadJobOrder}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobOrderDetail;