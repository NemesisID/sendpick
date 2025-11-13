import React, { useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';
import EditModal from './common/EditModal';
import DeleteConfirmModal from './common/DeleteConfirmModal';
import { 
    HiUsers, 
    HiCheckCircle, 
    HiBuildingOffice, 
    HiStar, 
    HiMagnifyingGlass, 
    HiFunnel, 
    HiPlus, 
    HiPencil, 
    HiTrash, 
    HiEye,
    HiPhone,
    HiEnvelope,
    HiMapPin
} from 'react-icons/hi2';

const summaryCards = [
    {
        title: 'Total Pelanggan',
        value: '245',
        description: 'Termasuk corporate & individu',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: <HiUsers className='h-5 w-5' />,
    },
    {
        title: 'Pelanggan Aktif',
        value: '198',
        description: '81% dari total pelanggan',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: <HiCheckCircle className='h-5 w-5' />,
    },
    {
        title: 'Corporate',
        value: '89',
        description: 'Termasuk SME & enterprise',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: <HiBuildingOffice className='h-5 w-5' />,
    },
    {
        title: 'Rata-rata Rating',
        value: '4.7',
        description: 'Dari 320 ulasan pelanggan',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: <HiStar className='h-5 w-5' />,
    },
];

const customerTypeStyles = {
    corporate: {
        label: 'Corporate',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
    },
    sme: {
        label: 'SME',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    individual: {
        label: 'Individual',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
};

const customerStatusStyles = {
    active: {
        label: 'Aktif',
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        dot: 'bg-emerald-500',
    },
    inactive: {
        label: 'Tidak Aktif',
        text: 'text-slate-500',
        bg: 'bg-slate-100',
        dot: 'bg-slate-400',
    },
};

const customerTypeOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'sme', label: 'SME' },
    { value: 'individual', label: 'Individual' },
];

const customerRecords = [
    {
        name: 'PT Maju Jaya',
        code: 'CUST-001',
        type: 'corporate',
        contact: 'Budi Santoso',
        phone: '+62 21-1234-5678',
        email: 'budi@majujaya.com',
        address: 'Jl. Sudirman No. 123, Jakarta Selatan',
        status: 'active',
        totalOrders: 156,
        totalValue: 'Rp 45.000.000',
        rating: 4.8,
    },
    {
        name: 'CV Sukses Mandiri',
        code: 'CUST-002',
        type: 'sme',
        contact: 'Siti Nurhaliza',
        phone: '+62 21-8765-4321',
        email: 'siti@suksesmandiri.com',
        address: 'Jl. Gatot Subroto No. 456, Jakarta Timur',
        status: 'active',
        totalOrders: 89,
        totalValue: 'Rp 28.500.000',
        rating: 4.6,
    },
    {
        name: 'UD Berkah',
        code: 'CUST-003',
        type: 'individual',
        contact: 'Ahmad Fauzi',
        phone: '+62 21-8555-6666',
        email: 'ahmad@udberkah.com',
        address: 'Jl. Pemuda No. 789, Jakarta Barat',
        status: 'inactive',
        totalOrders: 34,
        totalValue: 'Rp 12.800.000',
        rating: 4.4,
    },
    {
        name: 'PT Sentosa Logistik',
        code: 'CUST-004',
        type: 'corporate',
        contact: 'Rina Sasmita',
        phone: '+62 21-3344-7788',
        email: 'rina@sentosalogistik.com',
        address: 'Jl. Asia Afrika No. 88, Jakarta Pusat',
        status: 'active',
        totalOrders: 203,
        totalValue: 'Rp 57.200.000',
        rating: 4.9,
    },
];

const SearchIcon = ({ className = 'h-5 w-5' }) => <HiMagnifyingGlass className={className} />;
const PhoneIcon = ({ className = 'h-4 w-4' }) => <HiPhone className={className} />;
const MailIcon = ({ className = 'h-4 w-4' }) => <HiEnvelope className={className} />;
const MapPinIcon = ({ className = 'h-4 w-4' }) => <HiMapPin className={className} />;
const StarIcon = ({ className = 'h-4 w-4' }) => <HiStar className={className} />;
const EditIcon = ({ className = 'h-4 w-4' }) => <HiPencil className={className} />;
const TrashIcon = ({ className = 'h-4 w-4' }) => <HiTrash className={className} />;

function CustomerSummaryCard({ card }) {
    return (
        <article className='flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm'>
            <div className='min-w-0 flex-1'>
                <p className='text-sm text-slate-400 truncate'>{card.title}</p>
                <p className='mt-2 text-2xl sm:text-3xl font-semibold text-slate-900'>{card.value}</p>
                <p className='mt-1 text-xs text-slate-400 truncate'>{card.description}</p>
            </div>
            <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor} flex-shrink-0 ml-3`}>
                {card.icon}
            </div>
        </article>
    );
}

function CustomerTypeBadge({ type }) {
    const style = customerTypeStyles[type] ?? customerTypeStyles.corporate;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function CustomerStatusBadge({ status }) {
    const style = customerStatusStyles[status] ?? customerStatusStyles.active;
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${style.bg} ${style.text}`}>
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {style.label}
        </span>
    );
}

function CustomerRow({ customer, onEdit, onDelete }) {
    const initial = customer.name.charAt(0).toUpperCase();
    const ratingDisplay = customer.rating.toFixed(1);

    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-3 py-4 sm:px-6'>
                <div className='flex items-center gap-2 sm:gap-3'>
                    <div className='flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 text-xs sm:text-sm font-semibold text-slate-600'>
                        {initial}
                    </div>
                    <div className='min-w-0'>
                        <p className='text-sm font-semibold text-slate-800 truncate'>{customer.name}</p>
                        <p className='text-xs text-slate-400'>{customer.code}</p>
                    </div>
                </div>
            </td>
            <td className='px-3 py-4 sm:px-6'>
                <CustomerTypeBadge type={customer.type} />
            </td>
            <td className='px-3 py-4 sm:px-6'>
                <div className='space-y-1 text-sm text-slate-600'>
                    <p className='font-semibold text-slate-700 truncate'>{customer.contact}</p>
                    <div className='flex items-center gap-2'>
                        <PhoneIcon className='text-slate-400 flex-shrink-0' />
                        <span className='truncate'>{customer.phone}</span>
                    </div>
                    <div className='flex items-center gap-2 text-slate-400'>
                        <MailIcon className='flex-shrink-0' />
                        <span className='truncate'>{customer.email}</span>
                    </div>
                </div>
            </td>
            <td className='px-3 py-4 sm:px-6 text-sm text-slate-600'>
                <div className='flex items-center gap-2'>
                    <MapPinIcon className='text-slate-400 flex-shrink-0' />
                    <span className='truncate'>{customer.address}</span>
                </div>
            </td>
            <td className='px-3 py-4 sm:px-6'>
                <CustomerStatusBadge status={customer.status} />
            </td>
            <td className='px-3 py-4 sm:px-6 text-sm font-semibold text-slate-700'>{customer.totalOrders}</td>
            <td className='px-3 py-4 sm:px-6 text-sm font-semibold text-slate-700'>{customer.totalValue}</td>
            <td className='px-3 py-4 sm:px-6'>
                <div className='flex items-center gap-1 text-sm font-semibold text-slate-700'>
                    <StarIcon className='text-amber-400' />
                    <span>{ratingDisplay}</span>
                </div>
            </td>
            <td className='px-3 py-4 sm:px-6'>
                <div className='flex items-center gap-1 sm:gap-2'>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit(customer);
                        }}
                        className='inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Edit ${customer.name}`}
                    >
                        <EditIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                    </button>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(customer);
                        }}
                        className='inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:text-rose-600'
                        aria-label={`Hapus ${customer.name}`}
                    >
                        <TrashIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function CustomerTable({ customers, searchTerm, onSearchChange, typeFilter, onTypeChange, onEdit, onDelete, onAdd }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <h2 className='text-lg font-semibold text-slate-900'>Daftar Pelanggan</h2>
                        <p className='text-sm text-slate-400'>Kelola kontak pelanggan dan histori transaksi</p>
                    </div>
                    {/* Tombol tambah di mobile dipindah ke atas */}
                    <button
                        type='button'
                        onClick={onAdd}
                        className='group relative flex-shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-5'
                    >
                        <HiPlus className='h-5 w-5 transition-transform group-hover:rotate-90' />
                        {/* Tampilkan full text pada md ke atas, singkat pada mobile */}
                        <span className='hidden md:inline'>Tambah Pelanggan</span>
                        <span className='inline md:hidden'>Tambah</span>
                    </button>
                </div>
                
                {/* Controls section - search dan filter */}
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                    <div className='group relative flex-1 min-w-0'>
                        <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                            <SearchIcon />
                        </span>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder='Cari pelanggan, kontak, atau nomor telepon...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <FilterDropdown
                        value={typeFilter}
                        onChange={onTypeChange}
                        options={customerTypeOptions}
                        widthClass='w-full sm:w-48'
                    />
                </div>
            </div>
            <div className='mt-4 sm:mt-6 overflow-x-auto'>
                <table className='w-full min-w-[900px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-3 py-3 sm:px-6'>Pelanggan</th>
                            <th className='px-3 py-3 sm:px-6'>Tipe</th>
                            <th className='px-3 py-3 sm:px-6'>Kontak</th>
                            <th className='px-3 py-3 sm:px-6'>Alamat</th>
                            <th className='px-3 py-3 sm:px-6'>Status</th>
                            <th className='px-3 py-3 sm:px-6'>Total Order</th>
                            <th className='px-3 py-3 sm:px-6'>Total Nilai</th>
                            <th className='px-3 py-3 sm:px-6'>Rating</th>
                            <th className='px-3 py-3 sm:px-6'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <CustomerRow 
                                    key={customer.code} 
                                    customer={customer} 
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className='px-3 py-12 sm:px-6 text-center text-sm text-slate-400'>
                                    Tidak ada pelanggan yang sesuai dengan filter saat ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default function CustomerContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [editModal, setEditModal] = useState({ isOpen: false, customer: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, customer: null });

    const filteredCustomers = useMemo(() => {
        return customerRecords.filter((customer) => {
            const matchesSearch = 
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.code.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesType = typeFilter === 'all' || customer.type === typeFilter;
            
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter]);

    const handleAddCustomer = () => {
        setEditModal({ isOpen: true, customer: null });
    };

    const handleEditCustomer = (customer) => {
        setEditModal({ isOpen: true, customer });
    };

    const handleDeleteCustomer = (customer) => {
        setDeleteModal({ isOpen: true, customer });
    };

    const handleCloseEditModal = () => {
        setEditModal({ isOpen: false, customer: null });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ isOpen: false, customer: null });
    };

    const handleSaveCustomer = (formData) => {
        if (editModal.customer) {
            console.log('Updating customer:', editModal.customer.code, 'with data:', formData);
        } else {
            console.log('Adding new customer with data:', formData);
        }
        handleCloseEditModal();
    };

    const handleConfirmDelete = () => {
        if (deleteModal.customer) {
            console.log('Deleting customer:', deleteModal.customer.code);
        }
        handleCloseDeleteModal();
    };

    const customerModalFields = [
        {
            key: 'name',
            label: 'Nama Pelanggan',
            type: 'text',
            placeholder: 'Masukkan nama pelanggan',
            required: true,
        },
        {
            key: 'code',
            label: 'Kode Pelanggan',
            type: 'text',
            placeholder: 'Masukkan kode pelanggan',
            required: true,
        },
        {
            key: 'type',
            label: 'Tipe Pelanggan',
            type: 'select',
            options: [
                { value: 'corporate', label: 'Corporate' },
                { value: 'sme', label: 'SME' },
                { value: 'individual', label: 'Individual' },
            ],
            required: true,
        },
        {
            key: 'contact',
            label: 'Nama Kontak',
            type: 'text',
            placeholder: 'Masukkan nama kontak',
            required: true,
        },
        {
            key: 'phone',
            label: 'Nomor Telepon',
            type: 'tel',
            placeholder: 'Masukkan nomor telepon',
            required: true,
        },
        {
            key: 'email',
            label: 'Email',
            type: 'email',
            placeholder: 'Masukkan alamat email',
            required: true,
        },
        {
            key: 'address',
            label: 'Alamat',
            type: 'textarea',
            placeholder: 'Masukkan alamat lengkap',
            required: true,
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'active', label: 'Aktif' },
                { value: 'inactive', label: 'Tidak Aktif' },
            ],
            required: true,
        },
    ];

    return (
        <div className='space-y-4 p-4 sm:space-y-6 sm:p-6'>
          
            <section className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <CustomerSummaryCard key={card.title} card={card} />
                ))}
            </section>

            <CustomerTable
                customers={filteredCustomers}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                onAdd={handleAddCustomer}
            />

            <EditModal
                isOpen={editModal.isOpen}
                onClose={handleCloseEditModal}
                onSubmit={handleSaveCustomer}
                title={editModal.customer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
                fields={customerModalFields}
                initialData={editModal.customer}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title='Hapus Pelanggan'
                message={`Apakah Anda yakin ingin menghapus pelanggan "${deleteModal.customer?.name}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </div>
    );
}