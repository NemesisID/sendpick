import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const EditModal = ({
    isOpen,
    onClose,
    onSubmit,
    data,
    initialData,
    title = 'Edit Data',
    fields = [],
    isLoading = false,
    size = 'lg',
    backdropOpacity = 'default',
    disableScroll = true,
    hideContentScrollbar = false,
    onFieldChange,
    calculateCombinedData,
    jobOrdersData,
    children
}) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Debug logging
    console.log('🔵 EditModal - isOpen:', isOpen, '| title:', title, '| fields count:', fields.length);

    // Initialize form data when modal opens or data changes
    useEffect(() => {
        if (isOpen) {
            const sourceData = initialData || data;
            const newFormData = {};
            fields.forEach(field => {
                newFormData[field.key || field.name] = sourceData?.[field.key || field.name] || field.defaultValue || '';
            });
            setFormData(newFormData);
            setErrors({});
        }
    }, [isOpen, data, initialData, fields]);

    // Handle input change
    const handleChange = (name, value) => {
        if (onFieldChange) {
            // Use custom field change handler if provided
            onFieldChange(name, value, setFormData);
        } else {
            // Default behavior
            setFormData(prev => {
                const newData = {
                    ...prev,
                    [name]: value
                };

                // Auto-fill data jika ini adalah field jobOrders dan ada calculateCombinedData
                if (name === 'jobOrders' && calculateCombinedData) {
                    const selectedJobOrders = Array.isArray(value) ? value : (value ? [value] : []);
                    const combinedData = calculateCombinedData(selectedJobOrders);

                    return {
                        ...newData,
                        ...combinedData
                    };
                }

                return newData;
            });
        }

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

        fields.forEach(field => {
            const fieldKey = field.key || field.name;
            const value = formData[fieldKey];
            const isEmptyArray = Array.isArray(value) && value.length === 0;
            const isEmptyString = typeof value === 'string' && value.trim() === '';
            const isMissing = value === undefined || value === null || isEmptyString || isEmptyArray;
            if (field.required && isMissing) {
                newErrors[fieldKey] = `${field.label} harus diisi`;
            }

            // Custom validation
            if (field.validate && formData[fieldKey]) {
                const validationResult = field.validate(formData[fieldKey]);
                if (validationResult !== true) {
                    newErrors[fieldKey] = validationResult;
                }
            }
        });

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
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle submission errors if needed
        }
    };

    // Render input field based on type
    const renderField = (field) => {
        const fieldKey = field.key || field.name;
        const commonProps = {
            id: fieldKey,
            name: fieldKey,
            value: formData[fieldKey] || '',
            onChange: (e) => handleChange(fieldKey, e.target.value),
            className: `
                w-full rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                placeholder:text-slate-400
                ${field.disabled || field.readOnly
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200'
                    : errors[fieldKey]
                        ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
                        : formData[fieldKey]
                            ? 'border-green-300 bg-green-50/50 text-slate-900 focus:border-indigo-500'
                            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:bg-indigo-50/50'
                }
            `,
            disabled: isLoading || field.disabled,
            readOnly: field.readOnly
        };

        if (field.type === 'select' && field.multiple) {
            commonProps.value = Array.isArray(formData[fieldKey]) ? formData[fieldKey] : [];
            commonProps.onChange = (event) => {
                const selectedValues = Array.from(event.target.selectedOptions).map((option) => option.value);
                handleChange(fieldKey, selectedValues);
            };
        }

        const resolvedOptions = typeof field.options === 'function' ? field.options() : field.options;

        switch (field.type) {
            case 'multiselect':
                const selectedValues = Array.isArray(formData[fieldKey]) ? formData[fieldKey] : [];
                return (
                    <div className="space-y-2">
                        <div className="relative">
                            <select
                                {...commonProps}
                                value=""
                                onChange={(e) => {
                                    if (e.target.value && !selectedValues.includes(e.target.value)) {
                                        const newValues = [...selectedValues, e.target.value];
                                        handleChange(fieldKey, newValues);
                                    }
                                }}
                            >
                                <option value="">-- Pilih Job Order --</option>
                                {resolvedOptions?.filter(option => !selectedValues.includes(option.value)).map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedValues.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedValues.map(value => {
                                    const option = resolvedOptions?.find(opt => opt.value === value);
                                    return (
                                        <span
                                            key={value}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-lg"
                                        >
                                            {option?.label || value}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newValues = selectedValues.filter(v => v !== value);
                                                    handleChange(fieldKey, newValues);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={field.rows || 3}
                        placeholder={field.placeholder}
                    />
                );

            case 'select':
                return (
                    <select {...commonProps} multiple={field.multiple}>
                        {!field.multiple && !resolvedOptions?.some(opt => opt.value === '') && (
                            <option value="">-- Pilih {field.label} --</option>
                        )}
                        {resolvedOptions?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'email':
                return (
                    <input
                        {...commonProps}
                        type="email"
                        placeholder={field.placeholder}
                        autoComplete="email"
                    />
                );

            case 'tel':
                return (
                    <input
                        {...commonProps}
                        type="tel"
                        placeholder={field.placeholder}
                        autoComplete="tel"
                    />
                );

            case 'password':
                return (
                    <input
                        {...commonProps}
                        type="password"
                        placeholder={field.placeholder}
                        autoComplete="new-password"
                    />
                );

            case 'number':
                return (
                    <input
                        {...commonProps}
                        type="number"
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                );

            case 'date':
                return (
                    <input
                        {...commonProps}
                        type="date"
                        placeholder={field.placeholder}
                    />
                );

            case 'datetime-local':
                return (
                    <input
                        {...commonProps}
                        type="datetime-local"
                        placeholder={field.placeholder}
                    />
                );

            case 'image-upload':
                const previewUrl = formData[fieldKey] instanceof File
                    ? URL.createObjectURL(formData[fieldKey])
                    : (formData[fieldKey] || field.defaultValue);

                return (
                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-slate-50 shadow-md">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <label
                                htmlFor={fieldKey}
                                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-4 transition-all hover:border-indigo-500 hover:bg-indigo-50/50"
                            >
                                <div className="text-center">
                                    <svg className="mx-auto h-8 w-8 text-slate-400 transition group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="mt-2 text-sm font-medium text-slate-600 group-hover:text-indigo-600">
                                        <span className="font-semibold text-indigo-600">Klik untuk upload</span> atau drag and drop
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">PNG, JPG, GIF up to 2MB</p>
                                </div>
                                <input
                                    id={fieldKey}
                                    name={fieldKey}
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            handleChange(fieldKey, file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                );

            default:
                return (
                    <input
                        {...commonProps}
                        type="text"
                        placeholder={field.placeholder}
                        autoComplete={field.autoComplete}
                    />
                );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size={size || "lg"}
            closeOnBackdropClick={!isLoading}
            backdropOpacity={backdropOpacity}
            disableScroll={disableScroll}
            hideContentScrollbar={hideContentScrollbar}
        >
            {children ? (
                children
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    {/* Scrollable form fields dengan desain yang lebih menarik */}
                    <div className={`flex-1 ${hideContentScrollbar ? 'space-y-4 overflow-hidden' : 'space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[60vh]'}`}>
                        {fields.map((field, index) => {
                            const fieldKey = field.key || field.name;
                            const staggerClass = `field-stagger-${Math.min(index + 1, 8)}`;
                            return (
                                <div key={fieldKey} className={`group field-wrapper ${staggerClass}`}>
                                    <label
                                        htmlFor={fieldKey}
                                        className={`${hideContentScrollbar ? 'mb-2' : 'mb-3'} block text-sm font-semibold text-slate-700 group-focus-within:text-indigo-600 transition-colors`}
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-red-500 font-medium">*</span>
                                        )}
                                    </label>

                                    <div className="relative">
                                        {renderField(field)}
                                        {/* Icon untuk field yang required */}
                                        {field.required && !errors[fieldKey] && formData[fieldKey] && field.type !== 'date' && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-green-500 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {errors[fieldKey] && (
                                        <div className={`${hideContentScrollbar ? 'mt-1' : 'mt-2'} flex items-center gap-2 error-shake`}>
                                            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm text-red-600 font-medium">
                                                {errors[fieldKey]}
                                            </p>
                                        </div>
                                    )}

                                    {field.description && (
                                        <p className="mt-2 text-xs text-slate-500 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200">
                                            ℹ️ {field.description}
                                        </p>
                                    )}

                                    {field.help && (
                                        <p className="mt-2 text-xs text-slate-500 bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-2 rounded-lg border border-slate-200">
                                            💡 {field.help}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Fixed action buttons dengan desain yang lebih menarik */}
                    <div className={`flex justify-end gap-4 border-t border-slate-200 ${hideContentScrollbar ? 'pt-4 mt-6' : 'pt-6 mt-8'} shrink-0 bg-gradient-to-r from-slate-50 to-white px-1`}>
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
                                {isLoading ? 'Menyimpan...' : '✨ Simpan Perubahan'}
                            </span>
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default EditModal;