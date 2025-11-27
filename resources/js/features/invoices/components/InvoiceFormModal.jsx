import React, { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import EditModal from '../../../components/common/EditModal';

// Mock data for order references (Completed JO/DO)
const MOCK_ORDER_REFERENCES = [
    { id: 'JO-2024-005', customer: 'PT Sinar Jaya', type: 'Job Order' },
    { id: 'DO-2024-006', customer: 'CV Makmur Abadi', type: 'Delivery Order' },
    { id: 'JO-2024-007', customer: 'UD Sentosa', type: 'Job Order' },
];

export default function InvoiceFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        orderId: '',
        customer: '',
        date: '',
        dueDate: '',
        items: [{ description: '', qty: 1, price: 0 }],
        tax: 0,
        notes: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Parse items from initialData if available, otherwise default
                setFormData({
                    orderId: initialData.orderId || '',
                    customer: initialData.customer || '',
                    date: initialData.date || '',
                    dueDate: initialData.dueDate || '',
                    items: initialData.items || [{ description: 'Jasa Pengiriman', qty: 1, price: parseInt(initialData.amount?.replace(/[^0-9]/g, '') || 0) }],
                    tax: parseInt(initialData.tax?.replace(/[^0-9]/g, '') || 0),
                    notes: initialData.notes || '',
                });
            } else {
                // Reset for Create mode
                setFormData({
                    orderId: '',
                    customer: '',
                    date: new Date().toISOString().split('T')[0],
                    dueDate: '',
                    items: [{ description: '', qty: 1, price: 0 }],
                    tax: 0,
                    notes: '',
                });
            }
        }
    }, [isOpen, initialData]);

    const handleOrderSelect = (e) => {
        const selectedId = e.target.value;
        const order = MOCK_ORDER_REFERENCES.find(o => o.id === selectedId);
        if (order) {
            setFormData(prev => ({
                ...prev,
                orderId: selectedId,
                customer: order.customer
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                orderId: '',
                customer: ''
            }));
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', qty: 1, price: 0 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal + Number(formData.tax);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <EditModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Invoice' : 'Buat Invoice Baru'}
            size="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order & Customer Section */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Order Referensi <span className="text-rose-500">*</span>
                        </label>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={formData.orderId}
                                disabled
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-500"
                            />
                        ) : (
                            <select
                                value={formData.orderId}
                                onChange={handleOrderSelect}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="">Pilih Order...</option>
                                {MOCK_ORDER_REFERENCES.map(order => (
                                    <option key={order.id} value={order.id}>
                                        {order.id} - {order.type}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Nama Customer
                        </label>
                        <input
                            type="text"
                            value={formData.customer}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-500"
                            placeholder="Otomatis terisi..."
                        />
                    </div>
                </div>

                {/* Dates Section */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Tanggal Invoice <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Jatuh Tempo <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                            min={formData.date}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                {/* Items Section */}
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">
                            Rincian Item / Biaya <span className="text-rose-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={addItem}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                        >
                            <HiOutlinePlus className="h-4 w-4" />
                            Tambah Item
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="flex-[3]">
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        placeholder="Deskripsi item..."
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                                        placeholder="Qty"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value) || 0)}
                                        placeholder="Harga Satuan"
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>
                                {formData.items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50"
                                    >
                                        <HiOutlineTrash className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="rounded-2xl bg-slate-50 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Catatan (Opsional)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="3"
                                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                placeholder="Catatan tambahan untuk invoice ini..."
                            ></textarea>
                        </div>
                        <div className="w-full space-y-3 sm:w-72">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium">Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-slate-600">Pajak (Rp)</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.tax}
                                    onChange={(e) => setFormData({ ...formData, tax: parseInt(e.target.value) || 0 })}
                                    className="w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-right text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div className="border-t border-slate-200 pt-3">
                                <div className="flex justify-between text-base font-bold text-slate-800">
                                    <span>Total</span>
                                    <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-indigo-300"
                    >
                        {isEditMode ? 'Simpan Perubahan' : 'Buat Invoice'}
                    </button>
                </div>
            </form>
        </EditModal>
    );
}