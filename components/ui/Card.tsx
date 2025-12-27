'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<'div'>> {
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', hover = false, padding = 'md', children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-xl)' } : undefined}
                transition={{ duration: 0.2 }}
                className={`
          bg-white rounded-[var(--radius-xl)]
          border border-[var(--gray-200)]
          shadow-[var(--shadow-sm)]
          ${hover ? 'cursor-pointer' : ''}
          ${paddingClasses[padding]}
          ${className}
        `}
                {...(props as HTMLMotionProps<'div'>)}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`pb-4 border-b border-[var(--gray-200)] ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div ref={ref} className={`py-4 ${className}`} {...props}>
                {children}
            </div>
        );
    }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`pt-4 border-t border-[var(--gray-200)] ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps };
