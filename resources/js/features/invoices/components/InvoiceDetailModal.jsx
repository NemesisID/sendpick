import React from 'react';
import { HiOutlineDocumentText, HiOutlinePrinter, HiOutlineDownload } from 'react-icons/hi';
import Modal from '../../../components/common/Modal';

export default function InvoiceDetailModal({ isOpen, onClose, invoice }) {
    if (!isOpen || !invoice) return null;

    // Helper to parse currency string to number if needed, or just use the string
    // Assuming invoice.amount, invoice.tax, invoice.total are strings like "Rp 2.500.000"

    // Mock items if not present (since initial mock data doesn't have items)
    const items = invoice.items || [
        {
            description: 'Jasa Pengiriman (Default)',
            qty: 1,
            price: parseInt(invoice.amount.replace(/[^0-9]/g, '')) || 0
        }
    ];

    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = parseInt(invoice.tax.replace(/[^0-9]/g, '')) || 0;
    const total = subtotal + tax;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detail Invoice #${invoice.id}`}
            size="2xl"
        >
            <div className="flex flex-col h-full">
                {/* Content */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Invoice Header Info */}
                    <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer</label>
                                <p className="mt-1 text-base font-semibold text-slate-900">{invoice.customer}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order ID</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                                        {invoice.orderId}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 md:text-right">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tanggal Invoice</label>
                                <p className="mt-1 text-base font-medium text-slate-900">{invoice.date}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Jatuh Tempo</label>
                                <p className="mt-1 text-base font-medium text-rose-600">{invoice.dueDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Deskripsi Item</th>
                                    <th className="px-6 py-3 font-semibold text-center">Qty</th>
                                    <th className="px-6 py-3 font-semibold text-right">Harga Satuan</th>
                                    <th className="px-6 py-3 font-semibold text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                                        <td className="px-6 py-4 text-center text-slate-600">{item.qty}</td>
                                        <td className="px-6 py-4 text-right text-slate-600">Rp {item.price.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900">
                                            Rp {(item.qty * item.price).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50">
                                <tr>
                                    <td colSpan="3" className="px-6 py-3 text-right font-semibold text-slate-600">Subtotal</td>
                                    <td className="px-6 py-3 text-right font-semibold text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="px-6 py-3 text-right font-semibold text-slate-600">Pajak (PPN)</td>
                                    <td className="px-6 py-3 text-right font-semibold text-slate-900">Rp {tax.toLocaleString('id-ID')}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right text-base font-bold text-slate-900">Total Tagihan</td>
                                    <td className="px-6 py-4 text-right text-base font-bold text-indigo-600">Rp {total.toLocaleString('id-ID')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Payment History */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                            <HiOutlineDocumentText className="h-5 w-5 text-slate-500" />
                            Riwayat Pembayaran
                        </h4>

                        {invoice.paymentDate ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                            <HiOutlineDocumentText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Pembayaran Diterima</p>
                                            <p className="text-xs text-slate-500">{invoice.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600">{invoice.total}</p>
                                        <p className="text-xs text-slate-400">{invoice.paymentDate}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center">
                                <div className="mb-2 rounded-full bg-slate-200 p-3 text-slate-400">
                                    <HiOutlineDocumentText className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">Belum ada pembayaran</p>
                                <p className="text-xs text-slate-500">Invoice ini belum memiliki riwayat pembayaran.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <HiOutlinePrinter className="h-4 w-4" />
                        Cetak
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300"
                    >
                        <HiOutlineDownload className="h-4 w-4" />
                        Download PDF
                    </button>
                </div>
            </div>
        </Modal>
    );
}
