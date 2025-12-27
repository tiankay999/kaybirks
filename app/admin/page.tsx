'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { DashboardStats, Order, Product } from '@/types';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: 'bg-blue-500',
            href: '/admin/orders',
        },
        {
            title: 'Total Revenue',
            value: formatPrice(stats?.totalRevenue || 0),
            icon: DollarSign,
            color: 'bg-green-500',
            href: '/admin/orders',
        },
        {
            title: 'Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-purple-500',
            href: '/admin/products',
        },
        {
            title: 'Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'bg-orange-500',
            href: '/admin/users',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--gray-900)]">Dashboard</h1>
                <p className="text-[var(--gray-600)]">Welcome back! Here&apos;s what&apos;s happening.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={stat.href}>
                            <Card hover padding="lg" className="h-full">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-[var(--gray-500)] mb-1">{stat.title}</p>
                                        <p className="text-2xl lg:text-3xl font-bold text-[var(--gray-900)]">
                                            {isLoading ? '...' : stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-[var(--radius-lg)] ${stat.color}`}>
                                        <stat.icon size={24} className="text-white" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-[var(--gray-900)] flex items-center gap-2">
                                <AlertTriangle size={20} className="text-yellow-500" />
                                Low Stock Alert
                            </h2>
                            <Link href="/admin/products" className="text-sm text-[var(--primary-500)] hover:underline">
                                View All
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-12 skeleton rounded-lg" />
                                ))}
                            </div>
                        ) : stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                            <div className="space-y-3">
                                {stats.lowStockProducts.map((product: Product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-[var(--gray-900)]">{product.name}</p>
                                            <p className="text-sm text-[var(--gray-500)]">{product.category}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-6 text-[var(--gray-500)]">
                                All products are well stocked!
                            </p>
                        )}
                    </Card>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-[var(--gray-900)] flex items-center gap-2">
                                <TrendingUp size={20} className="text-[var(--primary-500)]" />
                                Recent Orders
                            </h2>
                            <Link href="/admin/orders" className="text-sm text-[var(--primary-500)] hover:underline">
                                View All
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-12 skeleton rounded-lg" />
                                ))}
                            </div>
                        ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentOrders.slice(0, 5).map((order: Order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-[var(--gray-900)]">
                                                #{order.id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="text-sm text-[var(--gray-500)]">
                                                {order.user?.name || 'Guest'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <p className="text-sm font-medium text-[var(--gray-900)] mt-1">
                                                {formatPrice(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-6 text-[var(--gray-500)]">
                                No orders yet
                            </p>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
