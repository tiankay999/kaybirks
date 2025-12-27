'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, helperText, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--gray-700)] mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2.5
            bg-white border rounded-[var(--radius-lg)]
            text-[var(--gray-900)] placeholder-[var(--gray-400)]
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
                />
                {(error || helperText) && (
                    <p
                        className={`mt-1.5 text-sm ${error ? 'text-[var(--accent-error)]' : 'text-[var(--gray-500)]'
                            }`}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
