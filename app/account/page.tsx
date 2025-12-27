'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Package, MapPin, ChevronRight } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { Order } from '@/types';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';

export default function AccountPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (!session) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
                <Link href="/login">
                    <Button>Sign In</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--gray-50)] min-h-screen py-12">
            <div className="container max-w-4xl">
                <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-8">My Account</h1>

                <div className="grid gap-6">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-[var(--primary-100)] rounded-full flex items-center justify-center">
                                <User size={32} className="text-[var(--primary-600)]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--gray-900)]">
                                    {session.user.name}
                                </h2>
                                <p className="text-[var(--gray-500)]">{session.user.email}</p>
                                <Badge variant="primary" size="sm" className="mt-1">
                                    {session.user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link
                                href="/account/orders"
                                className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-lg)] hover:border-[var(--primary-500)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Package size={20} className="text-[var(--gray-500)]" />
                                    <span className="font-medium">My Orders</span>
                                </div>
                                <ChevronRight size={18} className="text-[var(--gray-400)]" />
                            </Link>

                            <Link
                                href="/account/addresses"
                                className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-lg)] hover:border-[var(--primary-500)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin size={20} className="text-[var(--gray-500)]" />
                                    <span className="font-medium">Addresses</span>
                                </div>
                                <ChevronRight size={18} className="text-[var(--gray-400)]" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-[var(--gray-900)]">Recent Orders</h2>
                            <Link href="/account/orders" className="text-[var(--primary-500)] hover:underline text-sm">
                                View All
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-20 skeleton rounded-[var(--radius-lg)]" />
                                ))}
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 border border-[var(--gray-200)] rounded-[var(--radius-lg)]"
                                    >
                                        <div>
                                            <p className="font-medium text-[var(--gray-900)]">
                                                Order #{order.id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="text-sm text-[var(--gray-500)]">
                                                {formatDate(order.createdAt)} · {order.items.length} items
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <p className="font-medium text-[var(--gray-900)] mt-1">
                                                {formatPrice(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-[var(--gray-500)]">
                                No orders yet. <Link href="/shop" className="text-[var(--primary-500)] hover:underline">Start shopping</Link>
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
