'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
    primary: `
    bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)]
    text-white hover:from-[var(--primary-600)] hover:to-[var(--primary-700)]
    shadow-md hover:shadow-lg active:shadow-sm
  `,
    secondary: `
    bg-[var(--gray-100)] text-[var(--gray-800)]
    hover:bg-[var(--gray-200)] active:bg-[var(--gray-300)]
  `,
    outline: `
    border-2 border-[var(--primary-500)] text-[var(--primary-500)]
    hover:bg-[var(--primary-50)] active:bg-[var(--primary-100)]
  `,
    ghost: `
    text-[var(--gray-600)] hover:bg-[var(--gray-100)]
    active:bg-[var(--gray-200)]
  `,
    danger: `
    bg-[var(--accent-error)] text-white
    hover:bg-red-600 active:bg-red-700
  `,
};

const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, fullWidth, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                transition={{ duration: 0.15 }}
                className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-[var(--radius-lg)]
          transition-all duration-[var(--transition-base)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
                disabled={disabled || isLoading}
                {...(props as HTMLMotionProps<'button'>)}
            >
                {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
