'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) return;
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data.order);
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrder();
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="bg-[var(--gray-50)] min-h-screen py-12">
            <div className="container max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[var(--radius-2xl)] border border-[var(--gray-200)] p-8 lg:p-12 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle size={40} className="text-green-500" />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-[var(--gray-900)] mb-2">Order Confirmed!</h1>
                    <p className="text-[var(--gray-600)] mb-6">
                        Thank you for your purchase. Your order has been received.
                    </p>

                    {order && (
                        <>
                            <div className="bg-[var(--gray-50)] rounded-[var(--radius-xl)] p-6 text-left mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <Package size={24} className="text-[var(--primary-500)]" />
                                    <div>
                                        <p className="font-semibold text-[var(--gray-900)]">
                                            Order #{order.id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-sm text-[var(--gray-500)]">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-[var(--gray-200)] pt-4 space-y-2">
                                    <div className="flex justify-between text-[var(--gray-600)]">
                                        <span>Items</span>
                                        <span>{order.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-[var(--gray-900)]">
                                        <span>Total</span>
                                        <span>{formatPrice(order.total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-left mb-8">
                                <h2 className="font-semibold text-[var(--gray-900)] mb-2">Shipping Address</h2>
                                <p className="text-[var(--gray-600)]">
                                    {(order.shippingAddress as { firstName?: string; lastName?: string; address?: string; city?: string; postalCode?: string; country?: string })?.firstName} {(order.shippingAddress as { firstName?: string; lastName?: string })?.lastName}<br />
                                    {(order.shippingAddress as { address?: string })?.address}<br />
                                    {(order.shippingAddress as { city?: string })?.city}, {(order.shippingAddress as { postalCode?: string })?.postalCode}<br />
                                    {(order.shippingAddress as { country?: string })?.country}
                                </p>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/account/orders">
                            <Button>View Order Details</Button>
                        </Link>
                        <Link href="/shop">
                            <Button variant="outline">
                                Continue Shopping
                                <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full" />
                </div>
            }
        >
            <ConfirmationContent />
        </Suspense>
    );
}
