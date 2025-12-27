'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { items, total, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: session?.user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'US',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            router.push('/login?callbackUrl=/checkout');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderItems = items.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.product.images[0],
            }));

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: orderItems,
                    shippingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                        phone: formData.phone,
                    },
                }),
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();
                router.push(`/checkout/confirmation?orderId=${data.order.id}`);
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to process order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-2">Your cart is empty</h1>
                <p className="text-[var(--gray-600)] mb-6">Add items to your cart before checkout</p>
                <Link href="/shop">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        );
    }

    const shippingCost = total >= 100 ? 0 : 10;
    const orderTotal = total + shippingCost;

    return (
        <div className="bg-[var(--gray-50)] min-h-screen">
            <div className="container py-8 lg:py-12">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-[var(--gray-600)] hover:text-[var(--primary-500)] mb-8"
                >
                    <ChevronLeft size={18} />
                    Back to Cart
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Checkout Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-8">Checkout</h1>

                        {!session && (
                            <div className="bg-[var(--primary-50)] p-4 rounded-[var(--radius-lg)] mb-6">
                                <p className="text-[var(--primary-700)]">
                                    Already have an account?{' '}
                                    <Link href="/login?callbackUrl=/checkout" className="font-medium underline">
                                        Sign in
                                    </Link>{' '}
                                    for faster checkout
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Info */}
                            <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6">
                                <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                                <div className="grid gap-4">
                                    <Input
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Phone (optional)"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6">
                                <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Input
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <Input
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Input
                                            label="Postal Code"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <Select
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        options={countries}
                                    />
                                </div>
                            </div>

                            {/* Payment Section (placeholder) */}
                            <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6">
                                <h2 className="font-semibold text-lg mb-4">Payment</h2>
                                <div className="bg-[var(--gray-100)] rounded-[var(--radius-lg)] p-4 text-center">
                                    <Lock size={24} className="mx-auto text-[var(--gray-400)] mb-2" />
                                    <p className="text-[var(--gray-600)] text-sm">
                                        Payment processing would be integrated here (Stripe, PayPal, etc.)
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                isLoading={isSubmitting}
                                disabled={!session}
                            >
                                {session ? `Pay ${formatPrice(orderTotal)}` : 'Sign in to Complete Order'}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6 sticky top-24">
                            <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                                {items.map((item) => (
                                    <div
                                        key={`${item.product.id}-${item.size}-${item.color}`}
                                        className="flex gap-4"
                                    >
                                        <div className="relative w-16 h-16 rounded-[var(--radius-md)] overflow-hidden bg-[var(--gray-100)] flex-shrink-0">
                                            {item.product.images[0] && (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary-500)] text-white text-xs rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[var(--gray-900)] truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-[var(--gray-500)]">
                                                EU {item.size} / {item.color}
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-[var(--gray-200)] pt-4 space-y-3">
                                <div className="flex justify-between text-[var(--gray-600)]">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-[var(--gray-600)]">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-[var(--gray-200)]">
                                    <span>Total</span>
                                    <span>{formatPrice(orderTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
