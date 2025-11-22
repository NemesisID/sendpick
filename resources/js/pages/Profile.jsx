import React, { useState } from 'react';

// Profile details data
const profileDetails = {
    fullName: 'Gultom',
    username: 'admin@patralogistik.com',
    branch: 'PT Global Pilar Media',
    role: 'Admin',
};

const InfoIcon = ({ className = 'h-3.5 w-3.5' }) => (
    <svg viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='10' cy='10' r='8' />
        <path d='M10 9v4' strokeLinecap='round' />
        <path d='M10 6h.01' strokeLinecap='round' />
    </svg>
);

export default function ProfileContent() {
    // Create profileFields from static data
    const profileFields = [
        { key: 'fullName', label: 'Nama Lengkap', value: profileDetails.fullName },
        { key: 'username', label: 'User name', value: profileDetails.username, showInfo: true },
        { key: 'branch', label: 'Cabang', value: profileDetails.branch },
        { key: 'role', label: 'Role', value: profileDetails.role },
        { key: 'password', label: 'Password', isPassword: true },
    ];

    const handleEditClick = () => {
        // Placeholder for future edit functionality
        console.log('Edit Profile clicked');
    };

    return (
        <>
            <section className='space-y-6'>
                <article className='rounded-3xl border border-slate-200 bg-white p-8 shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-slate-200 dark:bg-white'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                        <div>
                            <h2 className='text-lg font-semibold text-slate-900 dark:text-slate-900'>Profile Details</h2>
                            <p className='mt-1 text-sm text-slate-500 dark:text-slate-500'>
                                Ringkasan informasi akun SendPick Anda.
                            </p>
                        </div>
                        <button
                            onClick={handleEditClick}
                            className='inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95'
                        >
                            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                            </svg>
                            Edit Profile
                        </button>
                    </div>

                <dl className='mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-x-12'>
                    {profileFields.map((field) => (
                        <React.Fragment key={field.key}>
                            <dt className='text-sm font-medium text-slate-500 dark:text-slate-500'>
                                <span className='inline-flex items-center gap-1'>
                                    {field.label}
                                    {field.showInfo ? (
                                        <InfoIcon className='h-3.5 w-3.5 text-slate-300 transition dark:text-slate-400' />
                                    ) : null}
                                </span>
                            </dt>
                            <dd className='text-sm font-semibold text-slate-900 dark:text-slate-900'>
                                {field.isPassword ? (
                                    <span className='text-indigo-500'>
                                        (
                                        <button
                                            type='button'
                                            className='inline text-sm font-semibold text-indigo-500 transition hover:text-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-white'
                                        >
                                            Rubah Password
                                        </button>
                                        )
                                    </span>
                                ) : (
                                    field.value
                                )}
                            </dd>
                        </React.Fragment>
                    ))}
                </dl>
            </article>
                <article className='rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 transition-colors duration-300 dark:border-slate-200 dark:bg-white dark:text-slate-600'>
                    Informasi profil diperbarui secara berkala. Gunakan tombol refresh untuk memastikan data terbaru tampil di halaman ini.
                </article>
            </section>
        </>
    );
}