'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, Eye } from 'lucide-react';
import { Button, Badge, Select } from '@/components/ui';
import { Order } from '@/types';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setIsLoading(true);
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

    async function updateStatus(orderId: string, status: string) {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, status: status as Order['status'] } : o))
                );
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    }

    const filteredOrders = orders.filter(
        (order) => !statusFilter || order.status === statusFilter
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Orders</h1>
                    <p className="text-[var(--gray-600)]">{orders.length} total orders</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-4 mb-6">
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={statusOptions}
                    className="w-48"
                />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Order ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Customer</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Items</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Total</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Status</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--gray-600)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-200)]">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="px-4 py-4">
                                            <div className="h-12 skeleton rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-[var(--gray-50)]"
                                    >
                                        <td className="px-4 py-4">
                                            <span className="font-mono font-medium text-[var(--gray-900)]">
                                                #{order.id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-medium text-[var(--gray-900)]">
                                                    {order.user?.name || 'Guest'}
                                                </p>
                                                <p className="text-sm text-[var(--gray-500)]">
                                                    {order.user?.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[var(--gray-600)]">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-4 py-4 text-[var(--gray-600)]">
                                            {order.items.length} items
                                        </td>
                                        <td className="px-4 py-4 font-medium text-[var(--gray-900)]">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                options={statusOptions.slice(1)}
                                                className="w-32"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end">
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye size={16} />
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-[var(--gray-500)]">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
