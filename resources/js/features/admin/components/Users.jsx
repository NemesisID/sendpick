import React, { useEffect, useMemo, useRef, useState } from 'react';
import FilterDropdown from '../../../components/common/FilterDropdown';
import EditModal from '../../../components/common/EditModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import Pagination from '../../../components/common/Pagination';
import { useAdmins } from '../hooks/useAdmins';
import { useAdminsCrud } from '../hooks/useAdminsCrud';

// Jumlah data per halaman
const ITEMS_PER_PAGE = 6;

const defaultSummary = {
    totalAdmin: '0',
    activeAdmin: '0',
    onlineToday: '0',
    totalRole: '0',
};

const roleStyles = {
    superAdmin: {
        label: 'Super Admin',
        bg: 'bg-rose-100',
        text: 'text-rose-600',
    },
    adminOperational: {
        label: 'Admin Operasional',
        bg: 'bg-sky-100',
        text: 'text-sky-600',
    },
    admin: {
        label: 'Admin',
        bg: 'bg-blue-100',
        text: 'text-blue-600',
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
    { value: 'adminOperational', label: 'Admin Operasional' },
];

// Role configuration untuk styling dan deskripsi
const roleConfig = {
    superAdmin: {
        role: 'Super Admin',
        description: 'Akses penuh sistem, manajemen pengguna dan konfigurasi.',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    admin: {
        role: 'Admin Operasional',
        description: 'Kelola operasi harian, job order, manifest, delivery order, dan armada.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
};

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

const getRoleKey = (roleName) => {
    if (!roleName) return 'superAdmin';
    const normalized = roleName.toLowerCase();
    if (normalized.includes('super')) return 'superAdmin';
    if (normalized.includes('operasional') || normalized.includes('operational') || normalized.includes('operation')) return 'adminOperational';
    if (normalized === 'admin') return 'admin';
    return 'superAdmin';
};

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
                <RoleBadge role={getRoleKey(admin.roles?.[0]?.name)} />
            </td>
            <td className='px-6 py-4'>
                <div className='space-y-1 text-sm text-slate-600'>
                    <div className='flex items-center gap-2 text-slate-400'>
                        <MailIcon />
                        <span className='truncate'>{admin.email}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <PhoneIcon className='h-4 w-4 text-slate-400' />
                        <span>{admin.phone}</span>
                    </div>
                </div>
            </td>
            <td className='px-6 py-4'>
                <StatusBadge status={admin.status} />
            </td>
            <td className='px-6 py-4 text-sm font-medium text-slate-600'>
                {admin.last_login ? new Date(admin.last_login).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '-'}
            </td>
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

function AdminTableSkeleton({ rows = 6 }) {
    return (
        <tbody className='divide-y divide-slate-100'>
            {Array.from({ length: rows }).map((_, index) => (
                <tr key={`driver-skeleton-${index}`} className='animate-pulse'>
                    <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 rounded-full bg-slate-200' />
                            <div className='space-y-2'>
                                <div className='h-3 w-28 rounded bg-slate-200' />
                                <div className='h-3 w-16 rounded bg-slate-100' />
                            </div>
                        </div>
                    </td>
                    <td className='px-6 py-4'>
                        <div className='space-y-2'>
                            <div className='h-3 w-32 rounded bg-slate-200' />
                            <div className='h-3 w-20 rounded bg-slate-100' />
                        </div>
                    </td>
                    <td className='px-6 py-4'>
                        <div className='h-3 w-28 rounded bg-slate-200' />
                    </td>
                    <td className='px-6 py-4'>
                        <div className='h-6 w-20 rounded-full bg-slate-200' />
                    </td>
                    <td className='px-6 py-4'>
                        <div className='h-3 w-16 rounded bg-slate-200' />
                    </td>
                    <td className='px-6 py-4'>
                        <div className='inline-flex items-center gap-1'>
                            <div className='h-3 w-3 rounded-full bg-slate-200' />
                            <div className='h-3 w-10 rounded bg-slate-200' />
                        </div>
                    </td>
                    <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                            <div className='h-9 w-9 rounded-full bg-slate-200' />
                            <div className='h-9 w-9 rounded-full bg-slate-200' />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

function AdminTable({
    admins,
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleChange,
    onAdd,
    onEdit,
    onDelete,
    loading,
    // Pagination props
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
}) {
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
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Last Login</th>
                            <th className='px-6 py-3'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {loading ? (
                            <AdminTableSkeleton rows={ITEMS_PER_PAGE} />
                        ) : admins.length > 0 ? (
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

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={onPageChange}
            />
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

function RolePermissionsSection({ admins = [] }) {
    // Hitung jumlah anggota per role secara dinamis dari data admin
    const roleCounts = useMemo(() => {
        const counts = {
            superAdmin: 0,
            adminOperational: 0,
            admin: 0,
        };

        admins.forEach(admin => {
            const roleKey = getRoleKey(admin.roles?.[0]?.name);
            if (counts.hasOwnProperty(roleKey)) {
                counts[roleKey]++;
            }
        });

        return counts;
    }, [admins]);

    // Generate roles overview dengan member count real-time
    // Hanya tampilkan role yang memiliki anggota (members > 0)
    const rolesWithCounts = useMemo(() => {
        return Object.entries(roleConfig)
            .filter(([key]) => roleCounts[key] > 0)
            .map(([key, config]) => ({
                ...config,
                members: roleCounts[key],
            }));
    }, [roleCounts]);

    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold text-slate-900'>Role & Permissions</h3>
                    <p className='text-sm text-slate-400'>Kelola akses fitur dan penugasan berdasarkan role.</p>
                </div>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
                {rolesWithCounts.map((role) => (
                    <RoleCard key={role.role} role={role} />
                ))}
            </div>
        </section>
    );
}

export default function AdminContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [adminList, setAdminList] = useState([]);
    const [summary, setSummary] = useState(defaultSummary);
    const [editModal, setEditModal] = useState({ isOpen: false, admin: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, admin: null });
    const [currentPage, setCurrentPage] = useState(1);
    const filterEffectInitialized = useRef(false);

    const {
        admins,
        roles,
        loading,
        error: fetchError,
        fetchWithParams,
        refetch,
    } = useAdmins({ per_page: 15 });

    const {
        createAdmin,
        updateAdmin,
        deleteAdmin,
        creating,
        updating,
        deleting,
        error: mutationError,
        success: mutationSuccess,
    } = useAdminsCrud(setAdminList);

    useEffect(() => {
        setAdminList(admins ?? []);
        const today = new Date().toDateString();
        setSummary((prev) => ({
            ...prev,
            totalAdmin: admins?.length?.toString() ?? prev.totalAdmin,
            activeAdmin: admins?.length?.toString() ?? '0',
            onlineToday: admins?.filter(a => a.last_login && new Date(a.last_login).toDateString() === today)?.length?.toString() ?? '0',
        }));
    }, [admins]);

    useEffect(() => {
        if (!filterEffectInitialized.current) {
            filterEffectInitialized.current = true;
            return;
        }

        const handler = setTimeout(() => {
            fetchWithParams({
                search: searchTerm || undefined,
                role: roleFilter !== 'all' ? roleFilter : undefined,
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm, roleFilter, fetchWithParams]);

    const resolveAdminId = (admin) => admin?.user_id ?? admin?.code;

    const handleAdd = () => {
        setEditModal({ isOpen: true, admin: null });
    };

    const handleEdit = (admin) => {
        setEditModal({ isOpen: true, admin });
    };

    const handleEditClose = () => {
        setEditModal({ isOpen: false, admin: null });
    };

    const handleDelete = (admin) => {
        setDeleteModal({ isOpen: true, admin });
    };

    const handleDeleteClose = () => {
        setDeleteModal({ isOpen: false, admin: null });
    };

    const handleEditSubmit = async (formData) => {
        const payload = {
            ...formData,
            role_ids: [formData.role_ids],
        };

        if (editModal.admin) {
            await updateAdmin(resolveAdminId(editModal.admin), payload);
        } else {
            await createAdmin(payload);
        }
        await refetch();
        // Note: handleEditClose() dipanggil oleh EditModal setelah onSubmit berhasil
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.admin) {
            return;
        }

        try {
            await deleteAdmin(resolveAdminId(deleteModal.admin));
            await refetch();
            handleDeleteClose();
        } catch (error) {
            console.error('Gagal menghapus admin:', error);
        }
    };

    const adminFields = useMemo(() => {
        const baseFields = [
            {
                name: 'name',
                label: 'Nama Admin',
                type: 'text',
                required: true,
                placeholder: 'Masukkan nama admin',
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'Masukkan alamat email',
            },
            {
                name: 'phone',
                label: 'Nomor Telepon',
                type: 'tel',
                required: true,
                placeholder: 'Contoh: +62812345678',
            },
            {
                name: 'role_ids',
                label: 'Role System',
                type: 'select',
                required: true,
                placeholder: 'Pilih role',
                description: 'Wajib memilih satu role aktif.',
                options: roles.map((role) => ({
                    value: role.id?.toString(),
                    label: role.name,
                })),
            },
        ];

        const passwordFields = editModal.admin
            ? [
                {
                    name: 'password',
                    label: 'Password Baru (Opsional)',
                    type: 'password',
                    required: false,
                    placeholder: 'Minimal 8 karakter dengan huruf besar, kecil, dan angka',
                    description: 'Kosongkan jika tidak ingin mengubah password.',
                },
                {
                    name: 'password_confirmation',
                    label: 'Konfirmasi Password Baru',
                    type: 'password',
                    required: false,
                    placeholder: 'Ulangi password baru',
                },
            ]
            : [
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    required: true,
                    placeholder: 'Minimal 8 karakter dengan huruf besar, kecil, dan angka',
                },
                {
                    name: 'password_confirmation',
                    label: 'Konfirmasi Password',
                    type: 'password',
                    required: true,
                    placeholder: 'Ulangi password',
                },
            ];

        const statusFields = editModal.admin
            ? [
                {
                    name: 'status',
                    label: 'Status Akun',
                    type: 'select',
                    required: true,
                    options: [
                        { value: 'active', label: 'Aktif' },
                        { value: 'inactive', label: 'Tidak Aktif' },
                    ],
                },
            ]
            : [];

        return [...baseFields, ...statusFields, ...passwordFields];
    }, [roles, editModal.admin]);

    const modalInitialData = useMemo(() => {
        if (!editModal.admin) {
            return { role_ids: [] };
        }

        const existingRoleIds = editModal.admin.roles?.map((role) => role.id?.toString()) ?? [];
        return {
            ...editModal.admin,
            role_ids: existingRoleIds[0] || '',
        };
    }, [editModal.admin]);

    const filteredAdmins = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return adminList.filter((admin) => {
            const matchesSearch =
                term.length === 0 ||
                admin.name?.toLowerCase().includes(term) ||
                admin.user_id?.toLowerCase().includes(term) ||
                admin.email?.toLowerCase().includes(term) ||
                admin.phone?.toLowerCase().includes(term);
            const matchesRole = roleFilter === 'all' || admin.roles?.some((role) => role.name === roleFilter);
            return matchesSearch && matchesRole;
        });
    }, [adminList, searchTerm, roleFilter]);

    // Pagination calculations
    const totalItems = filteredAdmins.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

    // Reset ke halaman 1 saat filter/search berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            {(fetchError || mutationError || mutationSuccess) ? (
                <div className='mb-4 space-y-2'>
                    {fetchError ? (
                        <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                            {fetchError}
                        </div>
                    ) : null}
                    {mutationError ? (
                        <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
                            {mutationError}
                        </div>
                    ) : null}
                    {mutationSuccess ? (
                        <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                            {mutationSuccess}
                        </div>
                    ) : null}
                </div>
            ) : null}

            <section className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {[
                    {
                        title: 'Total Admin',
                        value: summary.totalAdmin,
                        description: 'Jumlah admin terdaftar',
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
                        value: summary.activeAdmin,
                        description: 'Memiliki status aktif',
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
                        value: summary.onlineToday,
                        description: 'Aktif hari ini',
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
                        value: roles.length.toString(),
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
                ].map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <AdminTable
                admins={paginatedAdmins}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                roleFilter={roleFilter}
                onRoleChange={setRoleFilter}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={handlePageChange}
            />
            <RolePermissionsSection admins={adminList} />

            {/* Edit Modal */}
            <EditModal
                title={editModal.admin ? 'Edit Admin' : 'Tambah Admin'}
                fields={adminFields}
                initialData={modalInitialData}
                isOpen={editModal.isOpen}
                onClose={handleEditClose}
                onSubmit={handleEditSubmit}
                isLoading={creating || updating}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                title='Hapus Admin'
                message={`Apakah Anda yakin ingin menghapus admin "${deleteModal.admin?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                isLoading={deleting}
            />
        </>
    );
}