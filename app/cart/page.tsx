'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const [isClearing, setIsClearing] = useState(false);

    const handleClearCart = async () => {
        setIsClearing(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        clearCart();
        setIsClearing(false);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <ShoppingBag size={64} className="text-[var(--gray-300)] mb-6" />
                <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-2">Your cart is empty</h1>
                <p className="text-[var(--gray-600)] mb-6">Add some items to get started</p>
                <Link href="/shop">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--gray-50)] min-h-screen">
            <div className="container py-8 lg:py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-[var(--gray-900)]">Shopping Cart</h1>
                    <button
                        onClick={handleClearCart}
                        disabled={isClearing}
                        className="text-[var(--gray-500)] hover:text-[var(--accent-error)] transition-colors text-sm"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <motion.div
                                    key={`${item.product.id}-${item.size}-${item.color}`}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-4 lg:p-6"
                                >
                                    <div className="flex gap-4 lg:gap-6">
                                        {/* Image */}
                                        <Link href={`/shop/${item.product.slug}`} className="block flex-shrink-0">
                                            <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-[var(--radius-lg)] overflow-hidden bg-[var(--gray-100)]">
                                                {item.product.images[0] && (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <Link
                                                        href={`/shop/${item.product.slug}`}
                                                        className="font-semibold text-[var(--gray-900)] hover:text-[var(--primary-500)] transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-sm text-[var(--gray-500)] mt-1">
                                                        Size: EU {item.size} / Color: {item.color}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                                                    className="p-2 text-[var(--gray-400)] hover:text-[var(--accent-error)] transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-[var(--gray-300)] rounded-[var(--radius-lg)]">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product.id,
                                                                item.size,
                                                                item.color,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="p-2 hover:bg-[var(--gray-100)] transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-10 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product.id,
                                                                item.size,
                                                                item.color,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="p-2 hover:bg-[var(--gray-100)] transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <p className="font-bold text-[var(--gray-900)]">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-[var(--gray-900)] mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[var(--gray-600)]">
                                    <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-[var(--gray-600)]">
                                    <span>Shipping</span>
                                    <span>{total >= 100 ? 'Free' : formatPrice(10)}</span>
                                </div>
                                {total < 100 && (
                                    <p className="text-sm text-[var(--primary-500)]">
                                        Add {formatPrice(100 - total)} more for free shipping!
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-[var(--gray-200)] pt-4 mb-6">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(total >= 100 ? total : total + 10)}</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button fullWidth size="lg">
                                    Proceed to Checkout
                                    <ArrowRight size={18} />
                                </Button>
                            </Link>

                            <Link
                                href="/shop"
                                className="block text-center mt-4 text-[var(--primary-500)] hover:underline"
                            >
                                Continue Shopping
                            </Link>

                            {/* Promo Code */}
                            <div className="mt-6 pt-6 border-t border-[var(--gray-200)]">
                                <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                                    Promo Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="flex-1 px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                    <Button variant="outline">Apply</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
