import React, { useMemo, useState } from 'react';
import FilterDropdown from './common/FilterDropdown';
import EditModal from './common/EditModal';
import DeleteConfirmModal from './common/DeleteConfirmModal';

const summaryCards = [
    {
        title: 'Total Admin',
        value: '24',
        description: 'Termasuk super admin & staff',
        iconBg: 'bg-sky-100',
        iconColor: 'text-sky-600',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1' strokeLinecap='round' strokeLinejoin='round' />
                <circle cx='10' cy='7' r='3' />
                <path d='M20 19v-1a4 4 0 0 0-2.62-3.73' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M16 4a3 3 0 1 1 0 6' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Admin Aktif',
        value: '21',
        description: '87% dari total admin',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <circle cx='12' cy='12' r='8' />
                <path d='m9 12 2 2 4-4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
    {
        title: 'Online Hari Ini',
        value: '18',
        description: 'Admin dengan aktivitas hari ini',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M7 4h10l3 5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M7 9h13' strokeLinecap='round' />
            </svg>
        ),
    },
    {
        title: 'Total Role',
        value: '5',
        description: 'Role aktif dalam sistem',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: (
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-5 w-5'>
                <path d='M12 3a4 4 0 0 1 4 4v2h2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-4' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 3a4 4 0 0 0-4 4v2H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h4' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
        ),
    },
];

const roleStyles = {
    superAdmin: {
        label: 'Super Admin',
        bg: 'bg-rose-100',
        text: 'text-rose-600',
    },
    operations: {
        label: 'Operations Manager',
        bg: 'bg-sky-100',
        text: 'text-sky-600',
    },
    finance: {
        label: 'Finance Manager',
        bg: 'bg-emerald-100',
        text: 'text-emerald-600',
    },
    customerService: {
        label: 'Customer Service',
        bg: 'bg-amber-100',
        text: 'text-amber-600',
    },
    warehouse: {
        label: 'Warehouse Lead',
        bg: 'bg-indigo-100',
        text: 'text-indigo-600',
    },
};

const statusStyles = {
    active: {
        label: 'Aktif',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
    },
    inactive: {
        label: 'Tidak Aktif',
        bg: 'bg-slate-100',
        text: 'text-slate-500',
        dot: 'bg-slate-400',
    },
};

const roleFilterOptions = [
    { value: 'all', label: 'Semua Role' },
    { value: 'superAdmin', label: 'Super Admin' },
    { value: 'operations', label: 'Operations Manager' },
    { value: 'finance', label: 'Finance Manager' },
    { value: 'customerService', label: 'Customer Service' },
    { value: 'warehouse', label: 'Warehouse Lead' },
];

const adminRecords = [
    {
        name: 'Super Admin',
        code: 'ADM-001',
        role: 'superAdmin',
        email: 'admin@sendpick.com',
        phone: '+62 21-1111-2222',
        department: 'IT',
        status: 'active',
        lastLogin: '2024-01-15 09:30',
    },
    {
        name: 'Sari Dewi',
        code: 'ADM-002',
        role: 'operations',
        email: 'sari.dewi@sendpick.com',
        phone: '+62 21-3333-4444',
        department: 'Operations',
        status: 'active',
        lastLogin: '2024-01-15 08:15',
    },
    {
        name: 'Rudi Hartono',
        code: 'ADM-003',
        role: 'finance',
        email: 'rudi.hartono@sendpick.com',
        phone: '+62 21-5555-6666',
        department: 'Finance',
        status: 'active',
        lastLogin: '2024-01-14 16:45',
    },
    {
        name: 'Maya Sari',
        code: 'ADM-004',
        role: 'customerService',
        email: 'maya.sari@sendpick.com',
        phone: '+62 21-7777-8888',
        department: 'Customer Service',
        status: 'inactive',
        lastLogin: '2024-01-10 14:20',
    },
];

const rolesOverview = [
    {
        role: 'Super Admin',
        members: 2,
        description: 'Akses penuh sistem, manajemen pengguna dan konfigurasi.',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    {
        role: 'Operations Manager',
        members: 5,
        description: 'Kelola operasi harian, job order, dan armada.',
        color: 'text-sky-600',
        bg: 'bg-sky-50',
    },
    {
        role: 'Finance Manager',
        members: 4,
        description: 'Kontrol invoice, pelaporan, dan rekonsiliasi pembayaran.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        role: 'Customer Service',
        members: 6,
        description: 'Monitoring tiket pelanggan dan SLA pengiriman.',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
];

const SearchIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='11' cy='11' r='6' />
        <path d='m20 20-3.5-3.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const MailIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <rect x='3' y='5' width='18' height='14' rx='2' />
        <path d='m4 7 8 6 8-6' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PhoneIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M6.5 3h2a1 1 0 0 1 1 .72c.23.92.65 2.19 1.3 3.5a1 1 0 0 1-.23 1.15L9.1 10.04c1.4 2.3 3.2 4.1 5.5 5.5l1.67-1.47a1 1 0 0 1 1.15-.23c1.3.65 2.58 1.07 3.5 1.3a1 1 0 0 1 .72 1v2a1 1 0 0 1-1.05 1 16 16 0 0 1-14.5-14.45A1 1 0 0 1 6.5 3z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const EditIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5z' strokeLinecap='round' strokeLinejoin='round' />
        <path d='m14.5 5.5 4 4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const TrashIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M5 7h14' strokeLinecap='round' />
        <path d='M10 11v6M14 11v6' strokeLinecap='round' />
        <path d='M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' strokeLinecap='round' strokeLinejoin='round' />
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

function RoleBadge({ role }) {
    const style = roleStyles[role] ?? roleStyles.superAdmin;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function StatusBadge({ status }) {
    const style = statusStyles[status] ?? statusStyles.active;
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${style.bg} ${style.text}`}>
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {style.label}
        </span>
    );
}

function AdminRow({ admin, onEdit, onDelete }) {
    const initial = admin.name.charAt(0).toUpperCase();

    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4'>
                <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600'>
                        {initial}
                    </div>
                    <div>
                        <p className='text-sm font-semibold text-slate-800'>{admin.name}</p>
                        <p className='text-xs text-slate-400'>{admin.code}</p>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4'>
                <RoleBadge role={admin.role} />
            </td>
            <td className='px-6 py-4'>
                <div className='space-y-1 text-sm text-slate-600'>
                    <div className='flex items-center gap-2 text-slate-400'>
                        <MailIcon />
                        <span className='truncate'>{admin.email}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <PhoneIcon className='text-slate-400' />
                        <span>{admin.phone}</span>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{admin.department}</td>
            <td className='px-6 py-4'>
                <StatusBadge status={admin.status} />
            </td>
            <td className='px-6 py-4 text-sm font-medium text-slate-600'>{admin.lastLogin}</td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit(admin);
                        }}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Edit ${admin.name}`}
                    >
                        <EditIcon />
                    </button>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(admin);
                        }}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:text-rose-600'
                        aria-label={`Hapus ${admin.name}`}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function AdminTable({ admins, searchTerm, onSearchChange, roleFilter, onRoleChange, onAdd, onEdit, onDelete }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h2 className='text-lg font-semibold text-slate-900'>Daftar Admin & Pegawai</h2>
                    <p className='text-sm text-slate-400'>Kelola akses pengguna dan pembagian tugas tim.</p>
                </div>
                <div className='flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center'>
                    <div className='group relative min-w-[260px] flex-1'>
                        <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                            <SearchIcon />
                        </span>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder='Cari admin, email, atau role...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <FilterDropdown
                        value={roleFilter}
                        onChange={onRoleChange}
                        options={roleFilterOptions}
                        widthClass='w-full sm:w-48'
                    />
                    <button
                        type='button'
                        onClick={onAdd}
                        className='inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:w-auto'
                    >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='h-4 w-4'>
                            <path d='M12 5v14M5 12h14' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        Tambah Admin
                    </button>
                </div>
            </div>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[880px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Admin</th>
                            <th className='px-6 py-3'>Role</th>
                            <th className='px-6 py-3'>Kontak</th>
                            <th className='px-6 py-3'>Departemen</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Last Login</th>
                            <th className='px-6 py-3'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {admins.length > 0 ? (
                            admins.map((admin) => (
                                <AdminRow 
                                    key={admin.code} 
                                    admin={admin}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada admin yang sesuai dengan filter saat ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function RoleCard({ role }) {
    return (
        <article className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 ${role.bg}`}>
            <div className='flex items-center justify-between'>
                <p className={`text-sm font-semibold ${role.color}`}>{role.role}</p>
                <span className='text-xs font-semibold text-slate-400'>{role.members} anggota</span>
            </div>
            <p className='mt-3 text-sm text-slate-600'>{role.description}</p>
        </article>
    );
}

function RolePermissionsSection() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold text-slate-900'>Role & Permissions</h3>
                    <p className='text-sm text-slate-400'>Kelola akses fitur dan penugasan berdasarkan role.</p>
                </div>
                <button
                    type='button'
                    className='hidden items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 sm:flex'
                >
                    Kelola Role
                </button>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
                {rolesOverview.map((role) => (
                    <RoleCard key={role.role} role={role} />
                ))}
            </div>
        </section>
    );
}

export default function AdminContent() {
    console.log('AdminContent (Users.jsx) is rendering - FULL VERSION LOADED');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    
    // Modal states
    const [editModal, setEditModal] = useState({ isOpen: false, admin: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, admin: null });
    const [isLoading, setIsLoading] = useState(false);

    // Edit modal handlers
    const handleAdd = () => {
        setEditModal({ isOpen: true, admin: null });
    };

    const handleEdit = (admin) => {
        setEditModal({ isOpen: true, admin });
    };

    const handleEditSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update admin data (in real app, this would be an API call)
            console.log('Updating admin:', editModal.admin.code, 'with data:', formData);
            
            // Close modal
            setEditModal({ isOpen: false, admin: null });
        } catch (error) {
            console.error('Error updating admin:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClose = () => {
        setEditModal({ isOpen: false, admin: null });
    };

    // Delete modal handlers
    const handleDelete = (admin) => {
        setDeleteModal({ isOpen: true, admin });
    };

    const handleDeleteConfirm = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Delete admin (in real app, this would be an API call)
            console.log('Deleting admin:', deleteModal.admin.code);
            
            // Close modal
            setDeleteModal({ isOpen: false, admin: null });
        } catch (error) {
            console.error('Error deleting admin:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal({ isOpen: false, admin: null });
    };

    // Admin form fields configuration
    const adminFields = [
        {
            name: 'name',
            label: 'Nama Admin',
            type: 'text',
            required: true,
            placeholder: 'Masukkan nama admin'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'Masukkan alamat email'
        },
        {
            name: 'phone',
            label: 'Nomor Telepon',
            type: 'tel',
            required: true,
            placeholder: 'Contoh: +62812345678'
        },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            required: true,
            options: [
                { value: 'superAdmin', label: 'Super Admin' },
                { value: 'operations', label: 'Operations Manager' },
                { value: 'finance', label: 'Finance Manager' },
                { value: 'customerService', label: 'Customer Service' },
                { value: 'warehouse', label: 'Warehouse Lead' }
            ]
        },
        {
            name: 'department',
            label: 'Departemen',
            type: 'select',
            required: true,
            options: [
                { value: 'IT', label: 'IT' },
                { value: 'Operations', label: 'Operations' },
                { value: 'Customer Service', label: 'Customer Service' },
                { value: 'Finance', label: 'Finance' },
                { value: 'HR', label: 'Human Resources' }
            ]
        }
    ];

    const filteredAdmins = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return adminRecords.filter((admin) => {
            const matchesSearch =
                term.length === 0 ||
                admin.name.toLowerCase().includes(term) ||
                admin.code.toLowerCase().includes(term) ||
                admin.email.toLowerCase().includes(term) ||
                admin.phone.toLowerCase().includes(term) ||
                roleStyles[admin.role]?.label.toLowerCase().includes(term) ||
                admin.department.toLowerCase().includes(term);
            const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [searchTerm, roleFilter]);

    return (
        <>
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <AdminTable
                admins={filteredAdmins}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleChange={setRoleFilter}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <RolePermissionsSection />

            {/* Edit Modal */}
            <EditModal
                title={editModal.admin ? "Edit Admin" : "Tambah Admin"}
                fields={adminFields}
                initialData={editModal.admin}
                isOpen={editModal.isOpen}
                onClose={handleEditClose}
                onSubmit={handleEditSubmit}
                isLoading={isLoading}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                title="Hapus Admin"
                message={`Apakah Anda yakin ingin menghapus admin "${deleteModal.admin?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isLoading={isLoading}
            />
        </>
    );
}
