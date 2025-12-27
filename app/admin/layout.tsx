'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Star,
    Users,
    Settings,
    ArrowLeft,
} from 'lucide-react';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!session || session.user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-4">Access Denied</h1>
                <p className="text-[var(--gray-600)] mb-6">You don&apos;t have permission to access this area.</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--primary-500)] hover:underline"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--gray-100)]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--gray-900)] text-white z-40 hidden lg:block">
                <div className="p-6 border-b border-[var(--gray-800)]">
                    <Link href="/admin" className="text-xl font-bold">
                        <span className="text-[var(--primary-400)]">Kay</span>Birks
                        <span className="text-sm font-normal text-[var(--gray-400)] block">Admin Panel</span>
                    </Link>
                </div>

                <nav className="p-4">
                    {adminNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] mb-1 transition-colors ${isActive
                                        ? 'bg-[var(--primary-600)] text-white'
                                        : 'text-[var(--gray-400)] hover:bg-[var(--gray-800)] hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--gray-800)]">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--gray-400)] hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-[var(--gray-900)] text-white z-40 p-4">
                <div className="flex items-center justify-between">
                    <Link href="/admin" className="font-bold">
                        <span className="text-[var(--primary-400)]">Kay</span>Birks Admin
                    </Link>
                    <Link href="/" className="text-sm text-[var(--gray-400)]">
                        Back to Store
                    </Link>
                </div>
                <nav className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {adminNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap text-sm ${isActive
                                        ? 'bg-[var(--primary-600)]'
                                        : 'bg-[var(--gray-800)] text-[var(--gray-400)]'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* Main Content */}
            <main className="lg:ml-64 pt-28 lg:pt-0 min-h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 lg:p-8"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
