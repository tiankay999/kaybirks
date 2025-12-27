'use client';

import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-[var(--gray-100)] text-[var(--gray-700)]',
    primary: 'bg-[var(--primary-100)] text-[var(--primary-700)]',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = '', variant = 'default', size = 'md', children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={`
          inline-flex items-center font-medium
          rounded-[var(--radius-full)]
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
