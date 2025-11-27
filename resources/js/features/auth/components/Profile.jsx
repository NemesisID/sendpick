import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { HiPencil } from 'react-icons/hi2';
import EditProfileModal from '../../../pages/EditProfileModal';

export default function Profile() {
    const { user, updateUser } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleUpdateProfile = (updatedData) => {
        updateUser(updatedData);
        setIsEditModalOpen(false);
        // In a real app, you'd send this to the backend here
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-semibold shrink-0">
                                {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'GU'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{user.fullName}</h2>
                                <p className="text-indigo-600 font-medium mb-1">{user.role}</p>
                                <p className="text-slate-500 text-sm">Kelola informasi profil dan keamanan akun Anda di sini.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm shadow-indigo-200"
                        >
                            <HiPencil className="h-4 w-4" />
                            Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                NAMA LENGKAP
                            </label>
                            <p className="text-base font-semibold text-slate-900">{user.fullName}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                USER NAME <span className="text-slate-300 cursor-help" title="Username tidak dapat diubah">ⓘ</span>
                            </label>
                            <p className="text-base font-semibold text-slate-900">{user.username}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                NOMOR TELEPON
                            </label>
                            <p className="text-base font-semibold text-slate-900">{user.phone}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                ROLE
                            </label>
                            <p className="text-base font-semibold text-slate-900">{user.role}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                PASSWORD
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-900 font-semibold text-xl leading-none">••••••••</span>
                                <button className="text-indigo-600 text-sm font-medium hover:underline">(Ubah)</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                        Informasi profil diperbarui secara berkala. Gunakan tombol refresh untuk memastikan data terbaru tampil di halaman ini.
                    </p>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateProfile}
                initialData={user}
            />
        </div>
    );
}
