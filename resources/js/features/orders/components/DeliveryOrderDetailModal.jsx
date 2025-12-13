import React from 'react';
import { createPortal } from 'react-dom';

const CloseIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className={className}>
        <path d='M18 6L6 18' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 6l12 12' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PrinterIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className={className}>
        <path d='M6 9V2h12v7' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M6 14h12v8H6z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const UserIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='7' r='4' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const PhoneIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const MapPinIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='12' cy='10' r='3' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ArrowRightIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className={className}>
        <path d='M5 12h14' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 5l7 7-7 7' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const TruckIcon = ({ className = 'h-5 w-5' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <rect x='1' y='3' width='15' height='13' rx='2' ry='2' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M16 8h4l3 3v5h-7V8z' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='5.5' cy='18.5' r='2.5' strokeLinecap='round' strokeLinejoin='round' />
        <circle cx='18.5' cy='18.5' r='2.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const ClockIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='10' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 6v6l4 2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const InfoIcon = ({ className = 'h-4 w-4' }) => (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className={className}>
        <circle cx='12' cy='12' r='10' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 16v-4' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M12 8h.01' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

export default function DeliveryOrderDetailModal({ isOpen, onClose, data }) {
    if (!isOpen) return null;

    // Use passed data or fallback dummy
    const delivery = data || {
        id: 'DO-SAMPLE',
        status: 'Pending',
        priority: 'normal',
    };

    const statusColors = {
        pending: 'bg-slate-100 text-slate-600',
        loading: 'bg-amber-100 text-amber-700',
        'in transit': 'bg-sky-100 text-sky-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        completed: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-rose-100 text-rose-700',
        exception: 'bg-rose-100 text-rose-700'
    };

    const normalizeStatus = (s) => (s ? s.toString().toLowerCase() : 'pending');
    const statusStyle = statusColors[normalizeStatus(delivery.status)] || statusColors.pending;
    const isCompleted = ['delivered', 'completed'].includes(normalizeStatus(delivery.status));

    // Handle Route splitting
    const [originCity, destCity] = delivery.route && delivery.route.includes('→')
        ? delivery.route.split('→').map(s => s.trim())
        : [delivery.origin || 'Origin', delivery.destination || 'Destination'];

    // Safe access to nested raw data for address if available
    const address = delivery.raw?.source_info?.destination_address
        || delivery.raw?.customer?.address
        || delivery.address
        || 'Alamat lengkap tidak tersedia.';

    // Driver assigned check
    const hasDriver = delivery.driver && delivery.driver !== 'Belum ditugaskan';

    return createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
            <div className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity' onClick={onClose} />

            <div className='relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all'>

                {/* Header */}
                <div className='flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4'>
                    <div className='flex items-center gap-3'>
                        <h2 className='text-xl font-bold text-slate-900'>{delivery.id}</h2>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle} uppercase tracking-wide`}>
                            {delivery.status}
                        </span>
                        {delivery.priority === 'critical' && (
                            <span className='inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600 border border-rose-100 uppercase tracking-wide'>
                                Priority
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors'
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Scrollable Body - 2 Column Efficient Layout */}
                <div className='flex-1 overflow-y-auto px-6 py-6'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>

                        {/* LEFT COLUMN: LOGISTICS FOCUS */}
                        <div className='space-y-6'>

                            {/* Section: Delivery Info */}
                            <div>
                                <h3 className='flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide'>
                                    <MapPinIcon className='h-4 w-4 text-indigo-600' />
                                    Informasi Pengiriman
                                </h3>
                                <div className='rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm'>
                                    <div>
                                        <label className='text-[10px] text-slate-400 uppercase font-bold tracking-wider'>Customer Penerima</label>
                                        <p className='text-base font-semibold text-slate-900 mt-0.5'>{delivery.customer}</p>
                                        <p className='text-sm text-slate-500 mt-1 leading-relaxed'>{address}</p>
                                    </div>
                                    <div className='border-t border-slate-100 pt-3'>
                                        <label className='text-[10px] text-slate-400 uppercase font-bold tracking-wider'>Rute Pengiriman</label>
                                        <div className='flex items-center gap-3 mt-1.5'>
                                            <span className='bg-slate-50 px-3 py-1 rounded-md text-sm font-medium text-slate-700 border border-slate-100'>{originCity}</span>
                                            <ArrowRightIcon className='h-4 w-4 text-slate-300' />
                                            <span className='bg-slate-50 px-3 py-1 rounded-md text-sm font-medium text-slate-700 border border-slate-100'>{destCity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Cargo Details (The "Important" Box) */}
                            <div>
                                <div className='rounded-xl border border-indigo-100 bg-indigo-50/40 p-5'>
                                    <h4 className='text-sm font-bold text-indigo-900 mb-2'>Detail Muatan</h4>
                                    <p className='text-sm text-slate-800 font-medium mb-4'>{delivery.goods_desc || 'Deskripsi muatan tidak tersedia'}</p>

                                    <div className='flex flex-wrap gap-3'>
                                        <div className='rounded-lg bg-white px-3 py-2 border border-indigo-100 shadow-sm'>
                                            <span className='block text-[10px] text-slate-400 uppercase font-bold'>Berat Total</span>
                                            <span className='font-semibold text-slate-700'>{delivery.weight} Kg</span>
                                        </div>
                                        <div className='rounded-lg bg-white px-3 py-2 border border-indigo-100 shadow-sm'>
                                            <span className='block text-[10px] text-slate-400 uppercase font-bold'>Qty / Jumlah</span>
                                            <span className='font-bold text-indigo-600'>{delivery.qty} Koli</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: OPERATIONAL FOCUS */}
                        <div className='space-y-6'>

                            {/* Section: Fleet & Driver */}
                            <div>
                                <h3 className='flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide'>
                                    <TruckIcon className='h-4 w-4 text-indigo-600' />
                                    Armada & Driver
                                </h3>
                                <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
                                    {hasDriver ? (
                                        <div className='flex items-start gap-4'>
                                            <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-200'>
                                                <UserIcon className='h-6 w-6' />
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-semibold text-slate-900 text-base'>{delivery.driver}</p>
                                                {/* Simulated Phone Number if needed */}
                                                <p className='text-sm text-slate-500 mt-0.5 flex items-center gap-1.5'>
                                                    <PhoneIcon className='h-3.5 w-3.5 text-slate-400' />
                                                    <span>0812-XXXX-XXXX</span>
                                                </p>
                                                <div className='mt-3 flex items-center gap-2'>
                                                    <span className='inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 border border-indigo-100'>
                                                        {delivery.vehicle || 'N/A'}
                                                    </span>
                                                    <span className='text-xs text-slate-400'>•</span>
                                                    <span className='text-xs text-slate-500'>Tipe Armada</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-start gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100'>
                                            <InfoIcon className='h-5 w-5 text-slate-400 mt-0.5 shrink-0' />
                                            <div>
                                                <p className='text-sm font-medium text-slate-700'>Belum Ada Driver</p>
                                                <p className='text-xs text-slate-500 mt-0.5 leading-snug'>
                                                    Delivery Order ini belum memiliki driver. Silakan edit DO untuk menugaskan driver secara manual.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Timeline / Status */}
                            <div>
                                <h3 className='flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide'>
                                    <ClockIcon className='h-4 w-4 text-indigo-600' />
                                    Timeline & Status
                                </h3>
                                <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3'>
                                    <div className='flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0'>
                                        <span className='text-sm text-slate-500'>Jadwal Keberangkatan</span>
                                        <span className='text-sm font-medium text-slate-900'>{delivery.departure || '-'}</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-sm text-slate-500'>Estimasi Tiba (ETA)</span>
                                        <span className='text-sm font-semibold text-indigo-700'>{delivery.eta || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Proof of Delivery Section (Only if Completed) */}
                    {isCompleted && (
                        <div className='mt-8 pt-6 border-t-2 border-dashed border-slate-100'>
                            <h3 className='mb-4 text-sm font-bold uppercase tracking-wider text-emerald-600'>
                                Bukti Pengiriman (POD)
                            </h3>
                            <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                                    <div className='space-y-1'>
                                        <p className='text-xs text-slate-400 font-semibold uppercase'>Diterima Oleh</p>
                                        <p className='font-semibold text-slate-900'>Penerima Paket</p>
                                        <p className='text-xs text-slate-500'>Waktu: {delivery.lastUpdate}</p>
                                    </div>
                                    <div className='space-y-2'>
                                        <p className='text-xs text-slate-400 font-semibold uppercase'>Foto Barang</p>
                                        <div className='aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50'>
                                            <div className='flex h-full w-full items-center justify-center text-xs text-slate-400'>
                                                Foto tidak tersedia
                                            </div>
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <p className='text-xs text-slate-400 font-semibold uppercase'>Tanda Tangan</p>
                                        <div className='aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50'>
                                            <div className='flex h-full w-full items-center justify-center text-xs text-slate-400'>
                                                Tanda tangan digital
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className='flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4'>
                    <button
                        type='button'
                        disabled={!hasDriver}
                        title={!hasDriver ? 'Assign Driver terlebih dahulu untuk mencetak.' : 'Cetak Surat Jalan'}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-slate-200 ${!hasDriver
                                ? 'cursor-not-allowed text-slate-400 bg-slate-50'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <PrinterIcon className='h-4 w-4' />
                        Cetak Surat Jalan
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        className='inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
