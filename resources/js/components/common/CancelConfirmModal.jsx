import React from 'react';
import Modal from './Modal';

const CancelConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Batalkan Manifest',
    message = 'Apakah Anda yakin ingin membatalkan Manifest ini? Job Order di dalamnya akan dilepas dan tersedia kembali.',
    itemName = '',
    isLoading = false,
    backdropOpacity = 'default',
    disableScroll = true,
    hideContentScrollbar = false
}) => {

    const handleConfirm = async () => {
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error cancelling item:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
            closeOnBackdropClick={!isLoading}
            backdropOpacity={backdropOpacity}
            disableScroll={disableScroll}
            hideContentScrollbar={hideContentScrollbar}
        >
            <div className="text-center py-4">
                {/* Warning Icon (Ban/X) */}
                <div className="warning-container mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-6 relative">
                    <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse"></div>
                    <div className="text-red-600 relative z-10">
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h3>

                    <div className="space-y-3">
                        <p className="text-slate-600 leading-relaxed">
                            {message}
                        </p>

                        {itemName && (
                            <div className="mx-auto max-w-xs">
                                <div className="rounded-xl bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 px-4 py-3">
                                    <p className="text-sm font-bold text-red-900 break-words">
                                        "{itemName}"
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mx-4">
                            <p className="text-xs text-amber-800 font-medium flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Manifest akan berstatus 'Cancelled'
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 group relative px-6 py-3 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-semibold btn-interactive focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <span className="relative z-10">Kembali</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`
                            flex-1 group relative px-6 py-3 rounded-xl text-white font-semibold 
                            btn-interactive shadow-glow focus:outline-none focus:ring-2 focus:ring-offset-2 
                            disabled:opacity-50 disabled:hover:scale-100
                            bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                        `}
                    >
                        {isLoading && (
                            <svg
                                className="mr-3 h-5 w-5 animate-spin inline"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        )}
                        <span className="relative z-10">
                            {isLoading ? 'Membatalkan...' : 'Ya, Batalkan'}
                        </span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CancelConfirmModal;
