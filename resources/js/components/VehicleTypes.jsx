import React, { useEffect, useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';
import EditModal from './common/EditModal';
import DeleteConfirmModal from './common/DeleteConfirmModal';

const summaryCards = [
    {
        title: 'Total Tipe Kendaraan',
        value: '8',
        description: 'Kategori terdaftar',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2l-2 2H5l-2-2z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2l-2-2H5l-2 2z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M9 7v10' strokeLinecap='round' />
                <path d='M15 7v10' strokeLinecap='round' />
            </svg>
        ),
    },
    {
        title: 'Aktif',
        value: '7',
        description: 'Sedang digunakan',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M9 12l2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
                <circle cx='12' cy='12' r='9' />
            </svg>
        ),
    },
    {
        title: 'Non-Aktif',
        value: '1',
        description: 'Tidak digunakan',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='9' />
                <path d='M9 9l6 6' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M15 9l-6 6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Kendaraan Terdaftar',
        value: '45',
        description: 'Total unit',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M3 13h18l-2-6H5z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M5 17h14' strokeLinecap='round' />
                <circle cx='7.5' cy='17.5' r='1.5' />
                <circle cx='16.5' cy='17.5' r='1.5' />
            </svg>
        ),
    },
];

const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Non-Aktif' },
];

const vehicleTypesData = [
    {
        id: 1,
        name: 'Truk Besar',
        description: 'Kendaraan pengangkut barang berkapasitas besar untuk jarak jauh',
        capacity_range: '5-10 Ton',
        min_capacity_kg: 5000,
        max_capacity_kg: 10000,
        min_capacity_m3: 20,
        max_capacity_m3: 40,
        status: 'active',
        vehicle_count: 15,
        created_at: '2024-01-15',
    },
    {
        id: 2,
        name: 'Truk Sedang',
        description: 'Kendaraan pengangkut barang berkapasitas sedang untuk distribusi regional',
        capacity_range: '2-5 Ton',
        min_capacity_kg: 2000,
        max_capacity_kg: 5000,
        min_capacity_m3: 8,
        max_capacity_m3: 20,
        status: 'active',
        vehicle_count: 12,
        created_at: '2024-01-15',
    },
    {
        id: 3,
        name: 'Pick Up',
        description: 'Kendaraan ringan untuk pengiriman barang berukuran kecil hingga sedang',
        capacity_range: '0.5-2 Ton',
        min_capacity_kg: 500,
        max_capacity_kg: 2000,
        min_capacity_m3: 2,
        max_capacity_m3: 8,
        status: 'active',
        vehicle_count: 10,
        created_at: '2024-01-20',
    },
    {
        id: 4,
        name: 'Van',
        description: 'Kendaraan tertutup untuk pengiriman barang yang memerlukan perlindungan',
        capacity_range: '1-3 Ton',
        min_capacity_kg: 1000,
        max_capacity_kg: 3000,
        min_capacity_m3: 4,
        max_capacity_m3: 12,
        status: 'active',
        vehicle_count: 8,
        created_at: '2024-01-25',
    },
    {
        id: 5,
        name: 'Motor Box',
        description: 'Sepeda motor dengan box pengangkut untuk pengiriman express',
        capacity_range: '50-200 Kg',
        min_capacity_kg: 50,
        max_capacity_kg: 200,
        min_capacity_m3: 0.5,
        max_capacity_m3: 2,
        status: 'active',
        vehicle_count: 0,
        created_at: '2024-02-01',
    },
];

const EXIT_ANIMATION_DURATION = 250;

const PlusIcon = () => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
        <path d='M12 5v14M5 12h14' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const EditIcon = () => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
        <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const DeleteIcon = () => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
        <path d='M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M10 11v6M14 11v6' strokeLinecap='round' />
    </svg>
);

function PopupTambahTipeKendaraan({ open, onClose }) {
    const [shouldRender, setShouldRender] = useState(open);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        let timeoutId;

        if (open) {
            setShouldRender(true);
            setIsClosing(false);
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        } else if (shouldRender) {
            setIsClosing(true);
            timeoutId = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, EXIT_ANIMATION_DURATION);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [open, shouldRender]);

    if (!shouldRender) return null;

    const handleClose = () => {
        setIsClosing(true);
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-black/30 ${isClosing ? 'animate-fadeout' : 'animate-fadein'}`}
            onClick={handleClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl ${isClosing ? 'animate-popout' : 'animate-popin'}`}
                style={{
                    minWidth: '480px',
                    padding: '2rem'
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-6">Tambah Tipe Kendaraan Baru</h2>
                
                <div className="mb-4">
                    <label className="block text-xs mb-1">Nama Tipe</label>
                    <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Contoh: Truk Besar" />
                </div>
                
                <div className="mb-4">
                    <label className="block text-xs mb-1">Deskripsi</label>
                    <textarea 
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" 
                        rows="3"
                        placeholder="Deskripsi singkat tentang tipe kendaraan ini..."
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs mb-1">Kapasitas Minimum (Kg)</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="1000" type="number" />
                    </div>
                    <div>
                        <label className="block text-xs mb-1">Kapasitas Maksimum (Kg)</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="5000" type="number" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs mb-1">Volume Minimum (m³)</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="5" type="number" step="0.1" />
                    </div>
                    <div>
                        <label className="block text-xs mb-1">Volume Maksimum (m³)</label>
                        <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="20" type="number" step="0.1" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs mb-1">Status</label>
                    <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        <option value="active">Aktif</option>
                        <option value="inactive">Non-Aktif</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleClose();
                        }}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Batal
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ card }) {
    return (
        <article className='flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
            </div>
            <div>
                <p className='text-sm text-slate-400'>{card.title}</p>
                <p className='mt-1 text-2xl font-semibold text-slate-900'>{card.value}</p>
                <p className='text-xs text-slate-500'>{card.description}</p>
            </div>
        </article>
    );
}

function Tag({ children, bg, text }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${bg} ${text}`}>
            {children}
        </span>
    );
}

function VehicleTypeRow({ vehicleType, onEdit, onDelete }) {
    const statusConfig = vehicleType.status === 'active' 
        ? { label: 'Aktif', bg: 'bg-emerald-50', text: 'text-emerald-600' }
        : { label: 'Non-Aktif', bg: 'bg-slate-100', text: 'text-slate-500' };

    return (
        <tr className='hover:bg-slate-50'>
            <td className='px-6 py-4'>
                <div>
                    <div className='font-medium text-slate-900'>{vehicleType.name}</div>
                    <div className='text-sm text-slate-500'>{vehicleType.description}</div>
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='text-sm text-slate-900'>{vehicleType.capacity_range}</div>
                <div className='text-xs text-slate-500'>
                    {vehicleType.min_capacity_kg}kg - {vehicleType.max_capacity_kg}kg
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='text-sm text-slate-900'>
                    {vehicleType.min_capacity_m3}m³ - {vehicleType.max_capacity_m3}m³
                </div>
            </td>
            <td className='px-6 py-4'>
                <Tag bg={statusConfig.bg} text={statusConfig.text}>
                    {statusConfig.label}
                </Tag>
            </td>
            <td className='px-6 py-4'>
                <div className='text-sm text-slate-900'>{vehicleType.vehicle_count}</div>
                <div className='text-xs text-slate-500'>unit terdaftar</div>
            </td>
            <td className='px-6 py-4'>
                <div className='text-sm text-slate-900'>
                    {new Date(vehicleType.created_at).toLocaleDateString('id-ID')}
                </div>
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit(vehicleType);
                        }}
                        className='flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors'
                        title='Edit'
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(vehicleType);
                        }}
                        className='flex items-center justify-center h-8 w-8 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors'
                        title='Hapus'
                    >
                        <DeleteIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function VehicleTypeTable({ vehicleTypes, onEdit, onDelete }) {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full'>
                <thead>
                    <tr className='border-b border-slate-200'>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
                            Nama & Deskripsi
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
                            Kapasitas Berat
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
                            Volume
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
                            Status
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
                            Kendaraan
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
                            Dibuat
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-slate-100'>
                    {vehicleTypes.length > 0 ? (
                        vehicleTypes.map((vehicleType) => (
                            <VehicleTypeRow 
                                key={vehicleType.id} 
                                vehicleType={vehicleType}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className='px-6 py-12 text-center text-slate-500'>
                                <div className='flex flex-col items-center'>
                                    <svg className='h-12 w-12 text-slate-300 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-5v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V8a1 1 0 011-1h2a1 1 0 011 1z' />
                                    </svg>
                                    <p className='text-sm font-medium text-slate-900 mb-1'>Belum ada tipe kendaraan</p>
                                    <p className='text-sm text-slate-500'>Mulai dengan menambahkan tipe kendaraan pertama</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function VehicleTypesContent({ showPopup = false, setShowPopup = () => {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Modal states
    const [editModal, setEditModal] = useState({ isOpen: false, vehicleType: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, vehicleType: null });
    const [isLoading, setIsLoading] = useState(false);

    // Edit modal handlers
    const handleAdd = () => {
        setEditModal({ isOpen: true, vehicleType: null });
    };

    const handleEdit = (vehicleType) => {
        setEditModal({ isOpen: true, vehicleType });
    };

    const handleEditSubmit = async (formData) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Updating vehicle type:', editModal.vehicleType.id, 'with data:', formData);
            setEditModal({ isOpen: false, vehicleType: null });
        } catch (error) {
            console.error('Error updating vehicle type:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete modal handlers
    const handleDelete = (vehicleType) => {
        setDeleteModal({ isOpen: true, vehicleType });
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Deleting vehicle type:', deleteModal.vehicleType.id);
            setDeleteModal({ isOpen: false, vehicleType: null });
        } catch (error) {
            console.error('Error deleting vehicle type:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClose = () => setEditModal({ isOpen: false, vehicleType: null });
    const handleDeleteClose = () => setDeleteModal({ isOpen: false, vehicleType: null });

    const filteredVehicleTypes = useMemo(() => {
        return vehicleTypesData.filter(vehicleType => {
            const matchesSearch = vehicleType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                vehicleType.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || vehicleType.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    const editFormFields = [
        {
            name: 'name',
            label: 'Nama Tipe',
            type: 'text',
            required: true,
            placeholder: 'Nama tipe kendaraan'
        },
        {
            name: 'description',
            label: 'Deskripsi',
            type: 'textarea',
            required: false,
            placeholder: 'Deskripsi singkat tentang tipe kendaraan'
        },
        {
            name: 'min_capacity_kg',
            label: 'Kapasitas Minimum (Kg)',
            type: 'number',
            required: false,
            placeholder: '1000'
        },
        {
            name: 'max_capacity_kg',
            label: 'Kapasitas Maksimum (Kg)',
            type: 'number',
            required: false,
            placeholder: '5000'
        },
        {
            name: 'min_capacity_m3',
            label: 'Volume Minimum (m³)',
            type: 'number',
            required: false,
            placeholder: '5'
        },
        {
            name: 'max_capacity_m3',
            label: 'Volume Maksimum (m³)',
            type: 'number',
            required: false,
            placeholder: '20'
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            options: [
                { value: 'active', label: 'Aktif' },
                { value: 'inactive', label: 'Non-Aktif' }
            ]
        }
    ];

    return (
        <>
            {/* All popups/modals removed */}
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>

            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6'>
                    <div>
                        <h2 className='text-lg font-semibold text-slate-900'>Daftar Tipe Kendaraan</h2>
                        <p className='text-sm text-slate-500'>Kelola kategori dan spesifikasi tipe kendaraan</p>
                    </div>
                    
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Cari tipe kendaraan...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full sm:w-64 rounded-2xl border border-slate-200 bg-white px-4 py-2 pl-10 text-sm placeholder-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100'
                            />
                            <svg className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                        
                        <FilterDropdown
                            options={statusOptions}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            placeholder="Filter Status"
                        />
                        
                        <button
                            type='button'
                            onClick={handleAdd}
                            className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto'
                        >
                            <PlusIcon />
                            Tambah Tipe
                        </button>
                    </div>
                </div>

                <VehicleTypeTable 
                    vehicleTypes={filteredVehicleTypes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </section>

            <EditModal
                title={editModal.vehicleType ? 'Edit Tipe Kendaraan' : 'Tambah Tipe Kendaraan'}
                fields={editFormFields}
                initialData={editModal.vehicleType}
                isOpen={editModal.isOpen}
                onClose={handleEditClose}
                onSubmit={handleEditSubmit}
                isLoading={isLoading}
            />

            <DeleteConfirmModal
                title="Hapus Tipe Kendaraan"
                message={`Apakah Anda yakin ingin menghapus tipe kendaraan "${deleteModal.vehicleType?.name}"?`}
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isLoading={isLoading}
            />
        </>
    );
}