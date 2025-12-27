'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[var(--gray-50)] py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--gray-200)] p-8 shadow-[var(--shadow-lg)]">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold">
                                <span className="text-[var(--primary-500)]">Kay</span>Birks
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-[var(--gray-900)]">Welcome Back</h1>
                        <p className="text-[var(--gray-600)] mt-2">Sign in to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-[var(--radius-lg)] mb-6">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                className="w-full pl-12 pr-4 py-3 border border-[var(--gray-300)] rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full pl-12 pr-12 py-3 border border-[var(--gray-300)] rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--gray-400)]"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary-500)]"
                                />
                                <span className="text-[var(--gray-600)]">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-[var(--primary-500)] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center mt-6 text-[var(--gray-600)]">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-[var(--primary-500)] font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
