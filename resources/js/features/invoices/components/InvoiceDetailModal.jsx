import React from 'react';
import { HiOutlineDocumentText, HiOutlinePrinter, HiOutlineDownload } from 'react-icons/hi';
import Modal from '../../../components/common/Modal';

export default function InvoiceDetailModal({ isOpen, onClose, invoice }) {
    if (!isOpen || !invoice) return null;

    // Helper to parse currency value safely
    const parseCurrencyValue = (value) => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return parseFloat(value) || 0;
        return 0;
    };

    // Helper for date formatting
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const invoiceAmount = invoice.amount || invoice.total_amount || 0;
    const invoiceTax = invoice.tax_amount || invoice.tax || 0;

    // Mock items if not present (since initial mock data doesn't have items)
    const items = invoice.items || [
        {
            description: 'Jasa Pengiriman (Default)',
            qty: 1,
            price: parseCurrencyValue(invoiceAmount) - parseCurrencyValue(invoiceTax) // Adjust price to exclude tax for display if needed, or assume amount includes tax depending on logic. 
            // Better logic: if items are missing, assume total amount is the item price + tax. 
            // But usually 'total_amount' = subtotal + tax.
            // If we only have total_amount and tax, subtotal = total - tax.
        }
    ];

    // Recalculate based on available data
    // If items exist, use them. If not, construct a default item from total and tax.
    let displayItems = items;
    if (!invoice.items || invoice.items.length === 0) {
        // Fix: Ensure we are using the correct values from the invoice object
        // The issue described was: Subtotal negative, Tax positive, Total positive but math wrong.
        // This likely happened because we were doing: price = total - tax.
        // If total < tax (which is weird), price becomes negative.

        // Let's trust the invoice.subtotal if it exists, otherwise calculate it.
        const totalVal = parseCurrencyValue(invoice.total_amount || invoice.amount || 0);
        const taxVal = parseCurrencyValue(invoice.tax_amount || invoice.tax || 0);
        const subtotalVal = invoice.subtotal ? parseCurrencyValue(invoice.subtotal) : (totalVal - taxVal);

        displayItems = [{
            description: 'Jasa Pengiriman (Default)',
            qty: 1,
            price: subtotalVal
        }];
    }

    const subtotal = displayItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    // Use the stored tax amount if available, otherwise calculate from rate if available, otherwise 0
    const taxRate = invoice.tax_rate ? parseFloat(invoice.tax_rate) : 11;
    const tax = invoice.tax_amount ? parseCurrencyValue(invoice.tax_amount) : (subtotal * (taxRate / 100));
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
                                <p className="mt-1 text-base font-medium text-slate-900">{formatDate(invoice.date)}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Jatuh Tempo</label>
                                <p className="mt-1 text-base font-medium text-rose-600">{formatDate(invoice.dueDate)}</p>
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
                                {displayItems.map((item, index) => (
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
                                    <td colSpan="3" className="px-6 py-3 text-right font-semibold text-slate-600">
                                        Pajak (PPN {invoice.tax_rate ? parseFloat(invoice.tax_rate) : 11}%)
                                    </td>
                                    <td className="px-6 py-3 text-right font-semibold text-slate-900">Rp {tax.toLocaleString('id-ID')}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right text-base font-bold text-slate-900">Total Tagihan</td>
                                    <td className="px-6 py-4 text-right text-base font-bold text-indigo-600">Rp {total.toLocaleString('id-ID')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Notes Section */}
                    {invoice.notes && (
                        <div className="mb-4 rounded-2xl border border-slate-200 bg-amber-50 p-6">
                            <h4 className="mb-2 text-sm font-bold text-slate-900">Catatan</h4>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Cancellation Note Section */}
                    {invoice.status === 'Cancelled' && invoice.cancellation_note && (
                        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-6">
                            <h4 className="mb-2 text-sm font-bold text-rose-900">Alasan Pembatalan</h4>
                            <p className="text-sm text-rose-600 whitespace-pre-wrap">{invoice.cancellation_note}</p>
                        </div>
                    )}

                    {/* Payment History */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
                            <HiOutlineDocumentText className="h-5 w-5 text-slate-500" />
                            Riwayat Pembayaran
                        </h4>

                        {(invoice.last_payment || invoice.paymentDate) ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                            <HiOutlineDocumentText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Pembayaran Terakhir</p>
                                            <p className="text-xs text-slate-500">
                                                {invoice.last_payment?.payment_method || invoice.paymentMethod || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600">
                                            Rp {parseCurrencyValue(invoice.paid_amount || invoice.last_payment?.amount || 0).toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {formatDate(invoice.last_payment?.payment_date || invoice.paymentDate)}
                                        </p>
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