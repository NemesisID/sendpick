import React, { useMemo, useState, useEffect } from 'react';
import FilterDropdown from './common/FilterDropdown';
import EditModal from './common/EditModal';
import DeleteConfirmModal from './common/DeleteConfirmModal';
import JobOrderDetail from './JobOrderDetail';

const summaryCards = [
    {
        title: 'Total Order',
        value: '1,247',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        description: 'Semua jenis order',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M4 4h16' strokeLinecap='round' />
                <path d='M5 8h14v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M9 12h6M9 16h4' strokeLinecap='round' />
            </svg>
        ),
    },
    {
        title: 'Pending',
        value: '89',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        description: 'Menunggu konfirmasi',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='M12 8v4l2.5 1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'In Progress',
        value: '156',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-500',
        description: 'Dalam proses pengiriman',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M4 7h11v9H4z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M15 11h3l2 2v3h-5' strokeLinecap='round' strokeLinejoin='round' />
                <circle cx='7' cy='18' r='1.5' />
                <circle cx='17' cy='18' r='1.5' />
            </svg>
        ),
    },
    {
        title: 'Completed',
        value: '1,002',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        description: 'Order selesai bulan ini',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='m9 12 2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const orderTabs = [
    { key: 'all', label: 'Semua Order', count: 3 },
    { key: 'jobOrder', label: 'Job Order', count: 1 },
    { key: 'manifest', label: 'Manifest', count: 1 },
    { key: 'delivery', label: 'Delivery Order', count: 1 },
];

const orderTypeStyles = {
    jobOrder: {
        label: 'Job Order',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    manifest: {
        label: 'Manifest',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    delivery: {
        label: 'Delivery Order',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
};

const statusStyles = {
    in_progress: {
        label: 'In Progress',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    pending: {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    delivered: {
        label: 'Delivered',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    completed: {
        label: 'Completed',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    created: {
        label: 'Created',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
    },
    confirmed: {
        label: 'Confirmed',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
    },
    cancelled: {
        label: 'Cancelled',
        bg: 'bg-red-50',
        text: 'text-red-600',
    },
};

const typeFilterOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'jobOrder', label: 'Job Order' },
    { value: 'manifest', label: 'Manifest' },
    { value: 'delivery', label: 'Delivery Order' },
];

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' }
];

const orderRecords = [
    {
        id: 'JO-2024-001',
        type: 'jobOrder',
        jobOrderType: 'LTL', // Add specific job order type
        customer: 'PT Maju Jaya',
        customer_id: '1', // Add customer_id for form mapping
        origin: 'Jakarta Selatan',
        destination: 'Bandung',
        commodity: 'Elektronik - 50 pcs',
        weight: '250',
        items: 'Elektronik - 50 pcs', // Add items field for form
        driver: 'Ahmad Subandi',
        vehicle: 'B 1234 AB',
        status: 'in_progress',
        startDate: '2024-01-15',
        endDate: '2024-01-16',
        ship_date: '2024-01-15', // Add ship_date for form
        value: '2500000',
    },
    {
        id: 'MF-2024-002',
        type: 'manifest',
        customer: 'CV Sukses Mandiri',
        customer_id: '2', // Add customer_id for form mapping
        origin: 'Jakarta Timur',
        destination: 'Surabaya',
        commodity: 'Tekstil - 100 pcs',
        weight: '500',
        items: 'Tekstil - 100 pcs', // Add items field for form
        driver: '-',
        vehicle: '-',
        status: 'pending',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        ship_date: '2024-01-15', // Add ship_date for form
        value: '3200000',
    },
    {
        id: 'DO-2024-003',
        type: 'delivery',
        customer: 'UD Berkah',
        customer_id: '3', // Add customer_id for form mapping
        origin: 'Jakarta Barat',
        destination: 'Medan',
        commodity: 'Makanan - 200 pcs',
        weight: '300',
        items: 'Makanan - 200 pcs', // Add items field for form
        driver: 'Budi Santoso',
        vehicle: 'B 5678 CD',
        status: 'delivered',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        ship_date: '2024-01-10', // Add ship_date for form
        value: '4100000',
    },
];

const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='6' />
        <path d='m20 20-3.5-3.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const EyeIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='12' r='3' />
    </svg>
);

const EditIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='m14.5 5.5 4 4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const CancelIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='10' />
        <path d='M15 9l-6 6' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M9 9l6 6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

function SummaryCard({ card }) {
    return (
        <article className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div>
                <p className='text-sm text-slate-400'>{card.title}</p>
                <p className='mt-2 text-3xl font-semibold text-slate-900'>{card.value}</p>
                <p className='mt-1 text-xs text-slate-400'>{card.description}</p>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
            </div>
        </article>
    );
}

function OrderTypeBadge({ type }) {
    const style = orderTypeStyles[type] ?? orderTypeStyles.jobOrder;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function StatusBadge({ status }) {
    const style = statusStyles[status] ?? statusStyles.pending;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function OrderRow({ order, onViewDetail, onEdit, onCancel }) {
    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4'>
                <div className='text-sm font-semibold text-slate-800'>{order.id}</div>
                <p className='text-xs text-slate-400'>{orderTypeStyles[order.type]?.label ?? order.type}</p>
            </td>
            <td className='px-6 py-4'>
                <OrderTypeBadge type={order.type} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{order.customer}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='flex flex-col gap-1'>
                    <span>
                        <span className='inline-flex items-center gap-1 text-xs font-medium text-slate-500'>
                            <span className='h-2 w-2 rounded-full bg-emerald-500' />
                            {order.origin}
                        </span>
                    </span>
                    <span>
                        <span className='inline-flex items-center gap-1 text-xs font-medium text-slate-500'>
                            <span className='h-2 w-2 rounded-full bg-sky-500' />
                            {order.destination}
                        </span>
                    </span>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>{order.commodity}</p>
                    <p className='text-xs text-slate-400'>{order.weight} kg</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>{order.driver}</p>
                    <p className='text-xs text-slate-400'>{order.vehicle}</p>
                </div>
            </td>
            <td className='px-6 py-4'>
                <StatusBadge status={order.status} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p>{order.startDate}</p>
                    <p>{order.endDate}</p>
                </div>
            </td>
            <td className='px-6 py-4 text-sm font-semibold text-slate-700'>
                Rp {parseInt(order.value).toLocaleString('id-ID')}
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            onViewDetail(order.id);
                        }}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Detail order ${order.id}`}
                    >
                        <EyeIcon />
                    </button>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit(order);
                        }}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Edit order ${order.id}`}
                    >
                        <EditIcon />
                    </button>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            onCancel(order);
                        }}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:text-rose-600'
                        aria-label={`Cancel order ${order.id}`}
                    >
                        <CancelIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function OrdersTable({ orders, onViewDetail, onEdit, onCancel }) {
    return (
        <div className='mt-6 overflow-x-auto'>
            <table className='w-full min-w-[960px] border-collapse'>
                <thead>
                    <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                        <th className='px-6 py-3'>Order ID</th>
                        <th className='px-6 py-3'>Tipe</th>
                        <th className='px-6 py-3'>Customer</th>
                        <th className='px-6 py-3'>Route</th>
                        <th className='px-6 py-3'>Barang</th>
                        <th className='px-6 py-3'>Driver/Kendaraan</th>
                        <th className='px-6 py-3'>Status</th>
                        <th className='px-6 py-3'>Tanggal</th>
                        <th className='px-6 py-3'>Nilai</th>
                        <th className='px-6 py-3'>Aksi</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderRow 
                                key={order.id} 
                                order={order} 
                                onViewDetail={onViewDetail}
                                onEdit={onEdit}
                                onCancel={onCancel}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className='px-6 py-12 text-center text-sm text-slate-400'>
                                Tidak ada order untuk filter saat ini.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function JobOrderContent() {
    console.log('JobOrderContent component mounted and rendering...');
    
    // Add useEffect to track component lifecycle
    useEffect(() => {
        console.log('JobOrderContent useEffect: Component did mount');
        
        // Test API connectivity
        fetch('/api/v1/job-orders')
            .then(response => {
                console.log('Job Orders API response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Job Orders API data received:', data);
            })
            .catch(error => {
                console.error('Job Orders API error:', error);
            });
        
        return () => {
            console.log('JobOrderContent useEffect: Component will unmount');
        };
    }, []);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    
    // Modal states
    const [editModal, setEditModal] = useState({ isOpen: false, order: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null });
    const [createModal, setCreateModal] = useState({ isOpen: false });
    const [isLoading, setIsLoading] = useState(false);

    const handleViewDetail = (orderId) => {
        setSelectedOrderId(orderId);
        setCurrentView('detail');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedOrderId(null);
    };

    // Edit modal handlers
    const handleEdit = (order) => {
        console.log('Edit button clicked for order:', order);
        
        // Prepare data for edit form - ensure all required fields are present
        const editData = {
            ...order,
            // Ensure we have the correct field mapping
            customer_id: order.customer_id || '',
            jobOrderType: order.jobOrderType || 'LTL',
            origin: order.origin || '',
            destination: order.destination || '',
            items: order.items || order.commodity || '',
            weight: order.weight || '',
            ship_date: order.ship_date || order.startDate || '',
            value: order.value || '',
            status: order.status || 'pending'
        };
        
        console.log('Prepared edit data:', editData);
        setEditModal({ isOpen: true, order: editData });
    };

    const handleCancel = (order) => {
        setDeleteModal({ isOpen: true, order });
    };

    const handleCancelConfirm = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Canceling order:', deleteModal.order.id);
            setDeleteModal({ isOpen: false, order: null });
        } catch (error) {
            console.error('Error canceling order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelClose = () => {
        setDeleteModal({ isOpen: false, order: null });
    };

    const handleEditSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update order data (in real app, this would be an API call)
            console.log('Updating job order:', editModal.order.id, 'with data:', formData);
            
            // Close modal
            setEditModal({ isOpen: false, order: null });
        } catch (error) {
            console.error('Error updating job order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClose = () => {
        setEditModal({ isOpen: false, order: null });
    };

    // Create modal handlers
    const handleCreate = () => {
        console.log('Create new job order button clicked');
        setCreateModal({ isOpen: true });
    };

    const handleCreateSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create new order data (in real app, this would be an API call)
            console.log('Creating new job order with data:', formData);
            
            // Close modal
            setCreateModal({ isOpen: false });
        } catch (error) {
            console.error('Error creating job order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateClose = () => {
        setCreateModal({ isOpen: false });
    };

    // State for customers data
    const [customers, setCustomers] = useState([]);

    // Load customers data
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const response = await fetch('/api/v1/customers');
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data.data || []);
                } else {
                    throw new Error('API not available');
                }
            } catch (error) {
                console.error('Error loading customers:', error);
                // Fallback customers for demo purposes
                setCustomers([
                    { id: '1', nama: 'PT Maju Jaya', kode: 'PMJ' },
                    { id: '2', nama: 'CV Sukses Mandiri', kode: 'CSM' },
                    { id: '3', nama: 'UD Berkah', kode: 'UDB' },
                    { id: '4', nama: 'PT Global Logistik', kode: 'PGL' },
                    { id: '5', nama: 'CV Sentosa Transport', kode: 'CST' }
                ]);
            }
        };
        loadCustomers();
    }, []);

    // Job order form fields configuration
    const jobOrderFields = [
        {
            name: 'customer_id',
            label: 'Customer',
            type: 'select',
            required: true,
            options: customers.map(customer => ({
                value: customer.id,
                label: `${customer.nama} (${customer.kode})`
            }))
        },
        {
            name: 'jobOrderType',
            label: 'Tipe Order',
            type: 'select',
            required: true,
            options: [
                { value: 'LTL', label: 'LTL (Less Than Truckload)' },
                { value: 'FTL', label: 'FTL (Full Truckload)' }
            ]
        },
        {
            name: 'origin',
            label: 'Lokasi Pickup',
            type: 'text',
            required: true,
            placeholder: 'Alamat pickup'
        },
        {
            name: 'destination', 
            label: 'Lokasi Tujuan',
            type: 'text',
            required: true,
            placeholder: 'Alamat tujuan'
        },
        {
            name: 'items',
            label: 'Deskripsi Barang',
            type: 'textarea',
            required: true,
            placeholder: 'Deskripsi barang yang dikirim',
            rows: 2
        },
        {
            name: 'weight',
            label: 'Berat (kg)',
            type: 'number',
            required: true,
            placeholder: 'Berat dalam kilogram',
            min: 0,
            step: 0.1
        },
        {
            name: 'ship_date',
            label: 'Tanggal Kirim',
            type: 'date',
            required: true
        },
        {
            name: 'value',
            label: 'Nilai Order',
            type: 'number',
            required: true,
            placeholder: 'Nilai dalam Rupiah'
        }
    ];

    // Job order form fields configuration for editing (includes status)
    const jobOrderEditFields = [
        {
            name: 'customer_id',
            label: 'Customer',
            type: 'select',
            required: true,
            options: customers.map(customer => ({
                value: customer.id,
                label: `${customer.nama} (${customer.kode})`
            }))
        },
        {
            name: 'jobOrderType',
            label: 'Tipe Order',
            type: 'select',
            required: true,
            options: [
                { value: 'LTL', label: 'LTL (Less Than Truckload)' },
                { value: 'FTL', label: 'FTL (Full Truckload)' }
            ]
        },
        {
            name: 'origin',
            label: 'Lokasi Pickup',
            type: 'text',
            required: true,
            placeholder: 'Alamat pickup'
        },
        {
            name: 'destination', 
            label: 'Lokasi Tujuan',
            type: 'text',
            required: true,
            placeholder: 'Alamat tujuan'
        },
        {
            name: 'items',
            label: 'Deskripsi Barang',
            type: 'textarea',
            required: true,
            placeholder: 'Deskripsi barang yang dikirim',
            rows: 2
        },
        {
            name: 'weight',
            label: 'Berat (kg)',
            type: 'number',
            required: true,
            placeholder: 'Berat dalam kilogram',
            min: 0,
            step: 0.1
        },
        {
            name: 'ship_date',
            label: 'Tanggal Kirim',
            type: 'date',
            required: true
        },
        {
            name: 'value',
            label: 'Nilai Order',
            type: 'number',
            required: true,
            placeholder: 'Nilai dalam Rupiah'
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            options: [
                { value: 'created', label: 'Created' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' }
            ]
        }
    ];

    const filteredOrders = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return orderRecords.filter((order) => {
            const matchesSearch =
                term.length === 0 ||
                order.id.toLowerCase().includes(term) ||
                order.customer.toLowerCase().includes(term) ||
                order.origin.toLowerCase().includes(term) ||
                order.destination.toLowerCase().includes(term);
            const matchesType =
                (activeTab !== 'all' ? order.type === activeTab : true) &&
                (typeFilter === 'all' || order.type === typeFilter);
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [searchTerm, typeFilter, statusFilter, activeTab]);

    // Render JobOrderDetail if in detail view
    if (currentView === 'detail' && selectedOrderId) {
        console.log('Rendering JobOrderDetail for order:', selectedOrderId);
        return (
            <JobOrderDetail 
                jobOrderId={selectedOrderId} 
                onBack={handleBackToList} 
            />
        );
    }

    console.log('Rendering main JobOrder content');
    console.log('Current view state:', currentView);
    console.log('Selected order ID:', selectedOrderId);
    
    return (
        <div className='flex flex-col gap-8'>
            {/* Page Header
            <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold text-slate-900'>Job Order Management</h1>
                    <p className='text-sm text-slate-500'>Kelola semua job order, manifest, dan delivery order</p>
                </div>
            </header> */}

            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='group relative flex-1'>
                        <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                            <SearchIcon />
                        </span>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder='Cari order, customer, atau lokasi...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <div className='flex flex-col gap-3 sm:flex-row'>
                        <FilterDropdown
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={typeFilterOptions}
                            widthClass='min-w-[160px]'
                        />
                        <FilterDropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilterOptions}
                            widthClass='min-w-[160px]'
                        />
                        <button
                            type='button'
                            onClick={handleCreate}
                            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
                        >
                            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                                <path d='M12 5v14' strokeLinecap='round' strokeLinejoin='round' />
                                <path d='M5 12h14' strokeLinecap='round' strokeLinejoin='round' />
                            </svg>
                            Tambah Job Order
                        </button>
                    </div>
                </div>
                <div className='mt-6 overflow-x-auto'>
                    <div className='inline-flex min-w-full rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-500'>
                        {orderTabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type='button'
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 rounded-xl px-4 py-2 transition ${
                                        isActive
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'hover:text-indigo-600'
                                    }`}
                                >
                                    {tab.label}
                                    <span className='ml-1 text-xs text-slate-400'>({tab.count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <OrdersTable 
                    orders={filteredOrders} 
                    onViewDetail={handleViewDetail}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                />
            </section>

            {/* Create Modal */}
            <EditModal
                isOpen={createModal.isOpen}
                onClose={handleCreateClose}
                onSubmit={handleCreateSubmit}
                title="Tambah Job Order Baru"
                data={{}} // Empty data for new creation
                fields={jobOrderFields}
                isLoading={isLoading}
            />

            {/* Edit Modal */}
            <EditModal
                isOpen={editModal.isOpen}
                onClose={handleEditClose}
                onSubmit={handleEditSubmit}
                title="Edit Job Order"
                data={editModal.order}
                fields={jobOrderEditFields}
                isLoading={isLoading}
            />

            {deleteModal.isOpen && (
                <DeleteConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={handleCancelClose}
                    onConfirm={handleCancelConfirm}
                    title="Batalkan Job Order"
                    message={`Apakah Anda yakin ingin membatalkan job order "${deleteModal.order?.id}"?`}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}
