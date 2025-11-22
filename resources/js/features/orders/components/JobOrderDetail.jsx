import React, { useState } from 'react';
import JobOrderStatusHistory from './JobOrderStatusHistory';
import JobOrderAssignment from './JobOrderAssignment';

const JobOrderDetail = ({ jobOrderId, onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Sample job order data - in real app, fetch from API based on jobOrderId
    const jobOrder = {
        id: jobOrderId || 'JO-2024-874',
        customer: 'PT Maju Jaya Logistics',
        status: 'in_progress',
        priority: 'high',
        type: 'job_order',
        origin: 'Jakarta Selatan',
        destination: 'Bandung',
        createdAt: '2024-01-15 08:30:00',
        estimatedDelivery: '2024-01-16 14:00:00',
        packages: 48,
        totalWeight: '1,250 kg',
        totalValue: 'Rp 2,500,000',
        driver: 'Ahmad Subandi',
        vehicle: 'B 1234 AB',
        currentLocation: 'Tol Cipularang KM 23',
        progress: 65,
        commodity: 'Elektronik - 50 pcs',
        notes: 'Barang elektronik fragile, handle with care'
    };

    const getStatusStyle = (status) => {
        const styles = {
            pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Pending' },
            in_progress: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'In Progress' },
            completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Completed' },
            cancelled: { bg: 'bg-red-50', text: 'text-red-600', label: 'Cancelled' }
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
                                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
                                    activeTab === tab.id
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
                                            <p className="text-sm text-slate-500">Origin</p>
                                            <p className="font-medium text-slate-900">{jobOrder.origin}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Destination</p>
                                            <p className="font-medium text-slate-900">{jobOrder.destination}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Commodity</p>
                                            <p className="font-medium text-slate-900">{jobOrder.commodity}</p>
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

                                {/* Progress */}
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Progress</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Current Location</span>
                                            <span className="text-sm font-medium text-slate-900">{jobOrder.currentLocation}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div 
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${jobOrder.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">{jobOrder.progress}% Complete</span>
                                            <span className="text-slate-500">ETA: {jobOrder.estimatedDelivery}</span>
                                        </div>
                                    </div>
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
                                            <p className="font-medium text-slate-900">{jobOrder.packages} packages</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <JobOrderStatusHistory jobOrderId={jobOrder.id} />
                    )}

                    {activeTab === 'assignment' && (
                        <JobOrderAssignment jobOrderId={jobOrder.id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobOrderDetail;