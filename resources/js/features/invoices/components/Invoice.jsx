import React, { useMemo, useState } from 'react';
import FilterDropdown from '../../../components/common/FilterDropdown';
import {
    HiOutlineDocumentText,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineExclamation,
    HiOutlineCurrencyDollar,
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlineDownload,
    HiOutlinePrinter,
    HiOutlinePencilAlt,
    HiOutlineXCircle,
    HiOutlineCash,
    HiOutlinePlus
} from 'react-icons/hi';

import InvoiceFormModal from './InvoiceFormModal';
import CancelInvoiceModal from './CancelInvoiceModal';
import RecordPaymentModal from './RecordPaymentModal';
import InvoiceDetailModal from './InvoiceDetailModal';

// Helper for currency formatting
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const summaryCards = [
    {
        title: 'Total Invoice',
        value: '4',
        description: 'Invoice bulan ini',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        icon: <HiOutlineDocumentText className='h-5 w-5' />,
    },
    {
        title: 'Paid',
        value: '1',
        description: 'Invoice lunas',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        icon: <HiOutlineCheckCircle className='h-5 w-5' />,
    },
    {
        title: 'Pending',
        value: '1',
        description: 'Menunggu pembayaran',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        icon: <HiOutlineClock className='h-5 w-5' />,
    },
    {
        title: 'Overdue',
        value: '1',
        description: 'Lampaui jatuh tempo',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-500',
        icon: <HiOutlineExclamation className='h-5 w-5' />,
    },
    {
        title: 'Total Revenue',
        value: 'Rp 2.750.000',
        description: 'Dari invoice paid',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-500',
        icon: <HiOutlineCurrencyDollar className='h-5 w-5' />,
    },
];

const statusStyles = {
    paid: {
        label: 'Paid',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
    },
    pending: {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-600',
    },
    overdue: {
        label: 'Overdue',
        bg: 'bg-rose-50',
        text: 'text-rose-600',
    },
    partial: {
        label: 'Partial',
        bg: 'bg-sky-50',
        text: 'text-sky-600',
    },
    cancelled: {
        label: 'Cancelled',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
    },
};

const statusFilterOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'partial', label: 'Partial' },
    { value: 'cancelled', label: 'Cancelled' },
];

const monthFilterOptions = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '2024-01', label: 'Januari 2024' },
    { value: '2023-12', label: 'Desember 2023' },
];

const invoiceRecords = [
    {
        id: 'INV-2024-001',
        orderId: 'JO-2024-001',
        customer: 'PT Maju Jaya',
        date: '2024-01-15',
        dueDate: '2024-01-30',
        total_amount: 2750000,
        paid_amount: 2750000,
        status: 'paid',
        last_payment: {
            payment_date: '2024-01-28',
            payment_method: 'Bank Transfer'
        },
        month: '2024-01',
    },
    {
        id: 'INV-2024-002',
        orderId: 'MF-2024-002',
        customer: 'CV Sukses Mandiri',
        date: '2024-01-16',
        dueDate: '2024-01-31',
        total_amount: 3520000,
        paid_amount: 0,
        status: 'pending',
        last_payment: null,
        month: '2024-01',
    },
    {
        id: 'INV-2024-003',
        orderId: 'DO-2024-003',
        customer: 'UD Berkah',
        date: '2024-01-12',
        dueDate: '2024-01-27',
        total_amount: 4510000,
        paid_amount: 0,
        status: 'overdue',
        last_payment: null,
        month: '2024-01',
    },
    {
        id: 'INV-2024-004',
        orderId: 'JO-2024-004',
        customer: 'PT Sejahtera Abadi',
        date: '2024-01-14',
        dueDate: '2024-01-29',
        total_amount: 1980000,
        paid_amount: 1000000,
        status: 'partial',
        last_payment: {
            payment_date: '2024-01-25',
            payment_method: 'Cash'
        },
        month: '2024-01',
    },
];

const paymentHighlights = [
    {
        title: 'This Month Paid',
        value: 'Rp 2.200.000',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-500',
        description: 'Pembayaran masuk Januari 2024',
        icon: <HiOutlinePlus className='h-6 w-6' />,
    },
    {
        title: 'Outstanding',
        value: 'Rp 412.500',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-500',
        description: 'Menunggu pembayaran customer',
        icon: <HiOutlineClock className='h-6 w-6' />,
    },
    {
        title: 'Overdue Amount',
        value: 'Rp 137.500',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-500',
        description: 'Segera follow up pelanggan',
        icon: <HiOutlineExclamation className='h-6 w-6' />,
    },
    {
        title: 'Average Payment Time',
        value: '12 days',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-500',
        description: 'Rata-rata penyelesaian invoice',
        icon: <HiOutlineClock className='h-6 w-6' />,
    },
];



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

function StatusBadge({ status }) {
    const style = statusStyles[status?.toLowerCase()] ?? statusStyles.pending;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    );
}

function InvoiceRow({ invoice, onEdit, onCancel, onRecordPayment, onViewDetail }) {
    const totalAmount = invoice.total_amount || 0;
    const paidAmount = invoice.paid_amount || 0;
    const dueAmount = totalAmount - paidAmount;

    return (
        <tr className='transition-colors hover:bg-slate-50'>
            <td className='whitespace-nowrap px-6 py-4'>
                <p className='text-sm font-semibold text-slate-800'>{invoice.id}</p>
            </td>
            <td className='px-6 py-4'>
                <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
                    {invoice.orderId}
                </span>
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>{invoice.customer}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>{invoice.date}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>{invoice.dueDate}</td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                <div className='space-y-1'>
                    <p className='font-bold text-slate-800'>Total: {formatCurrency(totalAmount)}</p>
                    <p className='text-xs font-medium text-emerald-600'>Paid: {formatCurrency(paidAmount)}</p>
                    <p className='text-xs font-medium text-rose-600'>Due: {formatCurrency(dueAmount)}</p>
                </div>
            </td>
            <td className='px-6 py-4'>
                <StatusBadge status={invoice.status} />
            </td>
            <td className='px-6 py-4 text-sm text-slate-600'>
                {invoice.last_payment ? (
                    <div>
                        <p>{invoice.last_payment.payment_date}</p>
                        <p className='text-xs text-slate-400'>{invoice.last_payment.payment_method}</p>
                    </div>
                ) : (
                    <span className='text-xs text-slate-400'>-</span>
                )}
            </td>
            <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => onViewDetail(invoice)}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-indigo-200 hover:text-indigo-600'
                        aria-label={`Detail invoice ${invoice.id}`}
                    >
                        <HiOutlineEye className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        onClick={() => onEdit(invoice)}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-emerald-200 hover:text-emerald-600'
                        aria-label={`Edit invoice ${invoice.id}`}
                    >
                        <HiOutlinePencilAlt className='h-4 w-4' />
                    </button>
                    <button
                        type='button'
                        onClick={() => onRecordPayment(invoice)}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-purple-200 hover:text-purple-600'
                        aria-label={`Record payment ${invoice.id}`}
                    >
                        <HiOutlineCash className='h-4 w-4' />
                    </button>

                    <button
                        type='button'
                        onClick={() => onCancel(invoice)}
                        className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:text-rose-600'
                        aria-label={`Cancel invoice ${invoice.id}`}
                    >
                        <HiOutlineXCircle className='h-4 w-4' />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function InvoiceTable({ invoices, onEdit, onCancel, onRecordPayment, onViewDetail }) {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <header className='flex items-center justify-between'>
                <h2 className='text-sm font-semibold text-slate-700'>Invoice Penjualan</h2>
                <button
                    type='button'
                    className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600'
                >
                    Export CSV
                </button>
            </header>
            <div className='mt-6 overflow-x-auto'>
                <table className='w-full min-w-[900px] border-collapse'>
                    <thead>
                        <tr className='text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                            <th className='px-6 py-3'>Invoice ID</th>
                            <th className='px-6 py-3'>Order ID</th>
                            <th className='px-6 py-3'>Customer</th>
                            <th className='px-6 py-3'>Tanggal</th>
                            <th className='px-6 py-3'>Due Date</th>
                            <th className='px-6 py-3'>Amount / Paid</th>
                            <th className='px-6 py-3'>Status</th>
                            <th className='px-6 py-3'>Last Payment</th>
                            <th className='px-6 py-3'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => <InvoiceRow key={invoice.id} invoice={invoice} onEdit={onEdit} onCancel={onCancel} onRecordPayment={onRecordPayment} onViewDetail={onViewDetail} />)
                        ) : (
                            <tr>
                                <td colSpan={9} className='px-6 py-12 text-center text-sm text-slate-400'>
                                    Tidak ada invoice yang cocok dengan filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function PaymentTracking() {
    return (
        <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-sm font-semibold text-slate-700'>Payment Tracking</h3>
            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
                {paymentHighlights.map((card) => (
                    <article
                        key={card.title}
                        className='rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm'
                    >
                        <div className='flex items-center gap-3'>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className='text-xs font-semibold text-slate-400 uppercase tracking-wide'>
                                    {card.title}
                                </p>
                                <p className='mt-1 text-lg font-semibold text-slate-800'>{card.value}</p>
                                <p className='text-xs text-slate-400'>{card.description}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default function InvoiceContent() {
    const [invoices, setInvoices] = useState(invoiceRecords);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [monthFilter, setMonthFilter] = useState('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceToCancel, setInvoiceToCancel] = useState(null);
    const [invoiceToRecordPayment, setInvoiceToRecordPayment] = useState(null);
    const [invoiceToView, setInvoiceToView] = useState(null);

    const filteredInvoices = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return invoices.filter((invoice) => {
            const matchesSearch =
                term.length === 0 ||
                invoice.id.toLowerCase().includes(term) ||
                invoice.orderId.toLowerCase().includes(term) ||
                invoice.customer.toLowerCase().includes(term);
            const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
            const matchesMonth = monthFilter === 'all' || invoice.month === monthFilter;
            return matchesSearch && matchesStatus && matchesMonth;
        });
    }, [searchTerm, statusFilter, monthFilter, invoices]);

    const handleCreate = () => {
        setSelectedInvoice(null);
        setIsModalOpen(true);
    };

    const handleViewDetail = (invoice) => {
        setInvoiceToView(invoice);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (invoice) => {
        if (invoice.status === 'paid') {
            alert('Invoice yang sudah lunas tidak dapat diedit.');
            return;
        }
        if (invoice.status === 'cancelled') {
            alert('Invoice yang sudah dibatalkan tidak dapat diedit.');
            return;
        }
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleCancel = (invoice) => {
        if (invoice.status === 'paid') {
            alert('Invoice yang sudah lunas tidak dapat dibatalkan.');
            return;
        }
        if (invoice.status === 'cancelled') {
            return;
        }
        setInvoiceToCancel(invoice);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = (invoiceId, reason) => {
        console.log(`Cancelling invoice ${invoiceId} for reason: ${reason}`);
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
                return { ...inv, status: 'cancelled' }; // In a real app, we'd also save the reason
            }
            return inv;
        }));
        setIsCancelModalOpen(false);
    };

    const handleRecordPayment = (invoice) => {
        if (invoice.status === 'paid') {
            alert('Invoice sudah lunas.');
            return;
        }
        if (invoice.status === 'cancelled') {
            alert('Invoice sudah dibatalkan.');
            return;
        }
        setInvoiceToRecordPayment(invoice);
        setIsRecordPaymentModalOpen(true);
    };

    const handleConfirmRecordPayment = (invoiceId, paymentData) => {
        console.log(`Recording payment for invoice ${invoiceId}:`, paymentData);
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
                const totalAmount = inv.total_amount;
                const paidAmount = (inv.paid_amount || 0) + parseInt(paymentData.amount);

                let newStatus = inv.status;
                if (paidAmount >= totalAmount) {
                    newStatus = 'paid';
                } else if (paidAmount > 0) {
                    newStatus = 'partial';
                }

                return {
                    ...inv,
                    status: newStatus,
                    paid_amount: paidAmount,
                    last_payment: {
                        payment_date: paymentData.paymentDate,
                        payment_method: paymentData.paymentMethod === 'transfer' ? 'Bank Transfer' :
                            paymentData.paymentMethod === 'cash' ? 'Cash' : 'Check'
                    }
                };
            }
            return inv;
        }));
        setIsRecordPaymentModalOpen(false);
    };

    const handleModalSubmit = (formData) => {
        if (selectedInvoice) {
            // Update existing invoice
            setInvoices(prev => prev.map(inv => {
                if (inv.id === selectedInvoice.id) {
                    const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
                    const total = subtotal + formData.tax;
                    return {
                        ...inv,
                        date: formData.date,
                        dueDate: formData.dueDate,
                        total_amount: total,
                        // In a real app, we'd update other fields too
                    };
                }
                return inv;
            }));
        } else {
            // Create new invoice
            const subtotal = formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
            const total = subtotal + formData.tax;
            const newInvoice = {
                id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
                orderId: formData.orderId,
                customer: formData.customer,
                date: formData.date,
                dueDate: formData.dueDate,
                total_amount: total,
                paid_amount: 0,
                status: 'pending',
                last_payment: null,
                month: formData.date.slice(0, 7),
            };
            setInvoices([newInvoice, ...invoices]);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
                    <p className="text-sm text-slate-500">Kelola tagihan, pembayaran, dan status penagihan</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    Buat Invoice
                </button>
            </div>

            <section className='grid grid-cols-5 gap-4'>
                {summaryCards.map((card) => (
                    <SummaryCard key={card.title} card={card} />
                ))}
            </section>
            <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div className='group relative flex-1'>
                        <span className='pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400'>
                            <HiOutlineSearch className='h-5 w-5' />
                        </span>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder='Cari invoice, customer, atau order ID...'
                            className='w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                        />
                    </div>
                    <div className='flex flex-col gap-3 sm:flex-row'>
                        <FilterDropdown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusFilterOptions}
                            widthClass='min-w-[160px]'
                        />
                        <FilterDropdown
                            value={monthFilter}
                            onChange={setMonthFilter}
                            options={monthFilterOptions}
                            widthClass='min-w-[160px]'
                        />
                    </div>
                </div>
            </section>
            <InvoiceTable
                invoices={filteredInvoices}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onRecordPayment={handleRecordPayment}
                onViewDetail={handleViewDetail}
            />
            <PaymentTracking />

            <InvoiceFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={selectedInvoice}
            />

            <CancelInvoiceModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                invoice={invoiceToCancel}
            />

            <RecordPaymentModal
                isOpen={isRecordPaymentModalOpen}
                onClose={() => setIsRecordPaymentModalOpen(false)}
                onConfirm={handleConfirmRecordPayment}
                invoice={invoiceToRecordPayment}
            />

            <InvoiceDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                invoice={invoiceToView}
            />
        </>
    );
}