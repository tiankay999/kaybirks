'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    User,
    Menu,
    X,
    Search,
    ChevronDown,
    LogOut,
    Package,
    Settings,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from './ui';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/shop?category=sandals', label: 'Sandals' },
    { href: '/shop?category=clogs', label: 'Clogs' },
    { href: '/shop?category=slides', label: 'Slides' },
];

export function Header() {
    const { data: session } = useSession();
    const { items } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-[var(--shadow-md)]'
                    : 'bg-white'
                }`}
        >
            <div className="container">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[var(--primary-600)]">
                            Kay<span className="text-[var(--gray-900)]">Birks</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[var(--gray-600)] hover:text-[var(--primary-500)] font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Search */}
                        <AnimatePresence>
                            {isSearchOpen ? (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 'auto', opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    onSubmit={handleSearch}
                                    className="hidden sm:flex items-center"
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-48 px-4 py-2 border border-[var(--gray-300)] rounded-l-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="p-2 border border-l-0 border-[var(--gray-300)] rounded-r-[var(--radius-lg)] hover:bg-[var(--gray-100)]"
                                    >
                                        <X size={20} />
                                    </button>
                                </motion.form>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="hidden sm:flex p-2 text-[var(--gray-600)] hover:text-[var(--primary-500)] transition-colors"
                                    aria-label="Search"
                                >
                                    <Search size={22} />
                                </button>
                            )}
                        </AnimatePresence>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-[var(--gray-600)] hover:text-[var(--primary-500)] transition-colors"
                            aria-label="Cart"
                        >
                            <ShoppingBag size={22} />
                            {cartItemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary-500)] text-white text-xs font-bold rounded-full flex items-center justify-center"
                                >
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 p-2 text-[var(--gray-600)] hover:text-[var(--primary-500)] transition-colors"
                                >
                                    <User size={22} />
                                    <ChevronDown size={16} className="hidden sm:block" />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--gray-200)] z-50 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-[var(--gray-200)]">
                                                    <p className="font-medium text-[var(--gray-900)]">
                                                        {session.user.name}
                                                    </p>
                                                    <p className="text-sm text-[var(--gray-500)]">
                                                        {session.user.email}
                                                    </p>
                                                </div>

                                                <div className="py-2">
                                                    <Link
                                                        href="/account"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-2 text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                                                    >
                                                        <User size={18} />
                                                        My Account
                                                    </Link>
                                                    <Link
                                                        href="/account/orders"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-2 text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                                                    >
                                                        <Package size={18} />
                                                        Orders
                                                    </Link>
                                                    {session.user.role === 'ADMIN' && (
                                                        <Link
                                                            href="/admin"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-2 text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                                                        >
                                                            <Settings size={18} />
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                </div>

                                                <div className="border-t border-[var(--gray-200)] py-2">
                                                    <button
                                                        onClick={() => signOut()}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-[var(--accent-error)] hover:bg-red-50"
                                                    >
                                                        <LogOut size={18} />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-[var(--gray-600)]"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden bg-white border-t border-[var(--gray-200)] overflow-hidden"
                    >
                        <nav className="container py-4">
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="flex-1 px-4 py-2 border border-[var(--gray-300)] rounded-l-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-r-[var(--radius-lg)]"
                                    >
                                        <Search size={20} />
                                    </button>
                                </div>
                            </form>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 text-[var(--gray-700)] hover:text-[var(--primary-500)] font-medium border-b border-[var(--gray-100)]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
