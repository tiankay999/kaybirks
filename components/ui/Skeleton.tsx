'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'rectangular' | 'circular';
    width?: string | number;
    height?: string | number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className = '', variant = 'rectangular', width, height, style, ...props }, ref) => {
        const variantClasses = {
            text: 'rounded-[var(--radius-sm)]',
            rectangular: 'rounded-[var(--radius-md)]',
            circular: 'rounded-full',
        };

        return (
            <div
                ref={ref}
                className={`skeleton ${variantClasses[variant]} ${className}`}
                style={{
                    width: width,
                    height: height,
                    ...style,
                }}
                {...props}
            />
        );
    }
);

Skeleton.displayName = 'Skeleton';

// Pre-built skeleton components for common use cases
const ProductCardSkeleton = () => (
    <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] overflow-hidden">
        <Skeleton height={280} className="w-full" />
        <div className="p-4 space-y-3">
            <Skeleton height={20} width="60%" />
            <Skeleton height={16} width="80%" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton height={24} width="30%" />
                <Skeleton height={36} width={100} />
            </div>
        </div>
    </div>
);

const ProductDetailSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton height={500} className="w-full" />
        <div className="space-y-4">
            <Skeleton height={40} width="70%" />
            <Skeleton height={24} width="30%" />
            <Skeleton height={100} />
            <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height={40} width={60} />
                ))}
            </div>
            <Skeleton height={48} width="100%" />
        </div>
    </div>
);

const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
    <tr>
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-4 py-3">
                <Skeleton height={20} />
            </td>
        ))}
    </tr>
);

export { Skeleton, ProductCardSkeleton, ProductDetailSkeleton, TableRowSkeleton };
export type { SkeletonProps };
