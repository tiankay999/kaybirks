'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, options, placeholder, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-[var(--gray-700)] mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`
            w-full px-4 py-2.5
            bg-white border rounded-[var(--radius-lg)]
            text-[var(--gray-900)]
            transition-all duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent
            disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed
            ${error
                            ? 'border-[var(--accent-error)] focus:ring-[var(--accent-error)]'
                            : 'border-[var(--gray-300)] hover:border-[var(--gray-400)]'
                        }
            ${className}
          `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1.5 text-sm text-[var(--accent-error)]">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
