import React, { useState, useEffect } from 'react';
import Modal from './Modal';

/**
 * DeliveryOrderModal - Form untuk membuat Delivery Order sesuai SRS
 * 
 * Delivery Order adalah dokumen yang dibuat dari (mengeksekusi) Job Order atau Manifest yang sudah ada.
 * Form ini memungkinkan Admin untuk:
 * 1. Memilih tipe sumber (Job Order atau Manifest)
 * 2. Memilih ID sumber yang akan dieksekusi
 * 3. Assign driver dan kendaraan (opsional)
 * 4. Menentukan tanggal pelaksanaan DO
 * 
 * Status default untuk DO baru adalah 'Pending' (tidak perlu dipilih oleh Admin)
 * Data Customer, Rute, dan Barang akan terisi otomatis berdasarkan sumber yang dipilih
 */

const DeliveryOrderModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title = 'Tambah Delivery Order',
    isLoading = false
}) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const [jobOrders, setJobOrders] = useState([]);
    const [manifests, setManifests] = useState([]);
    const [isFetchingSources, setIsFetchingSources] = useState(false);

    // Fetch available sources when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchSources = async () => {
                setIsFetchingSources(true);
                try {
                    // Fetch Job Orders
                    const joResponse = await import('../../features/orders/services/jobOrderService').then(module => module.fetchJobOrders({ per_page: 100 }));
                    const joOptions = joResponse.items.map(jo => ({
                        value: jo.job_order_id,
                        label: `${jo.job_order_id} - ${jo.customer?.customer_name || 'Unknown Customer'}`
                    }));
                    setJobOrders(joOptions);

                    // Fetch Manifests
                    const mfResponse = await import('../../features/manifests/services/manifestService').then(module => module.fetchManifests({ per_page: 100 }));
                    const mfOptions = mfResponse.items.map(mf => ({
                        value: mf.manifest_id,
                        label: `${mf.manifest_id} - ${mf.origin_city} → ${mf.dest_city}`
                    }));
                    setManifests(mfOptions);
                } catch (error) {
                    console.error('Failed to fetch sources:', error);
                } finally {
                    setIsFetchingSources(false);
                }
            };

            fetchSources();
        }
    }, [isOpen]);

    // Initialize form data when modal opens
    useEffect(() => {
        if (isOpen) {
            const newFormData = {
                source_type: initialData?.source_type || '',
                source_id: initialData?.source_id || '',
                do_date: initialData?.do_date || ''
            };
            setFormData(newFormData);
            setErrors({});
        }
    }, [isOpen, initialData]);

    // Handle input change
    const handleChange = (name, value) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Reset source selection when source type changes
            if (name === 'source_type') {
                newData.source_id = '';
            }

            return newData;
        });

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.source_type) {
            newErrors.source_type = 'Tipe sumber harus dipilih';
        }

        if (!formData.source_id) {
            newErrors.source_id = 'Sumber harus dipilih';
        }

        if (!formData.do_date) {
            newErrors.do_date = 'Tanggal DO harus diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // Render input field
    const renderField = (field) => {
        const { name, label, type, required, options, placeholder, description, help } = field;
        const value = formData[name] || '';
        const hasError = errors[name];

        const commonProps = {
            id: name,
            name: name,
            value: value,
            onChange: (e) => handleChange(name, e.target.value),
            className: `
                w-full rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                placeholder:text-slate-400
                ${hasError
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
                    : value
                        ? 'border-green-300 bg-green-50/50 text-slate-900 focus:border-indigo-500'
                        : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:bg-indigo-50/50'
                }
            `,
            disabled: isLoading
        };

        return (
            <div key={name} className="group field-wrapper">
                <label
                    htmlFor={name}
                    className="mb-3 block text-sm font-semibold text-slate-700 group-focus-within:text-indigo-600 transition-colors"
                >
                    {label}
                    {required && (
                        <span className="ml-1 text-red-500 font-medium">*</span>
                    )}
                </label>

                <div className="relative">
                    {type === 'select' ? (
                        <select {...commonProps}>
                            <option value="">-- Pilih {label} --</option>
                            {options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : type === 'date' ? (
                        <input
                            {...commonProps}
                            type="date"
                        />
                    ) : (
                        <input
                            {...commonProps}
                            type={type}
                            placeholder={placeholder}
                        />
                    )}

                    {/* Icon untuk field yang required dan sudah diisi */}
                    {required && !hasError && value && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-green-500 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                {hasError && (
                    <div className="mt-2 flex items-center gap-2 error-shake">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-red-600 font-medium">
                            {hasError}
                        </p>
                    </div>
                )}

                {description && (
                    <p className="mt-2 text-xs text-slate-500 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200">
                        ℹ️ {description}
                    </p>
                )}

                {help && (
                    <p className="mt-2 text-xs text-slate-500 bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-2 rounded-lg border border-slate-200">
                        💡 {help}
                    </p>
                )}
            </div>
        );
    };

    // Get current fields based on form state
    const getCurrentFields = () => {
        const fields = [
            {
                name: 'source_type',
                label: 'Tipe Sumber',
                type: 'select',
                required: true,
                options: [
                    { value: 'JO', label: 'Job Order' },
                    { value: 'MF', label: 'Manifest' }
                ],
                description: 'Pilih apakah DO ini dibuat dari Job Order atau Manifest yang sudah ada'
            }
        ];

        // Add source selection field if type is selected
        if (formData.source_type) {
            fields.push({
                name: 'source_id',
                label: formData.source_type === 'JO' ? 'Pilih Job Order' : 'Pilih Manifest',
                type: 'select',
                required: true,
                options: formData.source_type === 'JO' ? jobOrders : manifests,
                description: `Data Customer, Rute, dan Barang akan terisi otomatis berdasarkan ${formData.source_type === 'JO' ? 'Job Order' : 'Manifest'} yang dipilih`
            });
        }

        // Add date field
        fields.push({
            name: 'do_date',
            label: 'Tanggal DO',
            type: 'date',
            required: true,
            description: 'Tanggal ketika Delivery Order ini akan dijalankan'
        });

        return fields;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
            closeOnBackdropClick={!isLoading}
            backdropOpacity="default"
            disableScroll={true}
            hideContentScrollbar={false}
        >
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                {/* Scrollable form fields dengan desain yang lebih menarik */}
                <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[60vh]">
                    {getCurrentFields().map((field, index) => {
                        const staggerClass = `field-stagger-${Math.min(index + 1, 8)}`;
                        return (
                            <div key={field.name} className={`${staggerClass}`}>
                                {renderField(field)}
                            </div>
                        );
                    })}
                </div>

                {/* Fixed action buttons dengan desain yang lebih menarik */}
                <div className="flex justify-end gap-4 border-t border-slate-200 pt-6 mt-8 shrink-0 bg-gradient-to-r from-slate-50 to-white px-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="group relative px-6 py-3 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-semibold transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 btn-interactive focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <span className="relative z-10">Batal</span>
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold btn-interactive shadow-glow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:scale-100"
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
                            {isLoading ? 'Menyimpan...' : '✨ Simpan Delivery Order'}
                        </span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default DeliveryOrderModal;