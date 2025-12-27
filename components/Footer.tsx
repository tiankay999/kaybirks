import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
    shop: [
        { label: 'All Products', href: '/shop' },
        { label: 'Sandals', href: '/shop?category=sandals' },
        { label: 'Clogs', href: '/shop?category=clogs' },
        { label: 'Slides', href: '/shop?category=slides' },
        { label: 'New Arrivals', href: '/shop?sort=newest' },
    ],
    support: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/faqs' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns & Exchanges', href: '/returns' },
        { label: 'Size Guide', href: '/size-guide' },
    ],
    company: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Story', href: '/story' },
        { label: 'Sustainability', href: '/sustainability' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
    ],
};

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--gray-900)] text-white">
            {/* Main Footer */}
            <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-2xl font-bold">
                                <span className="text-[var(--primary-400)]">Kay</span>Birks
                            </span>
                        </Link>
                        <p className="text-[var(--gray-400)] mb-6 max-w-sm">
                            Premium men&apos;s Birkenstock footwear. Quality craftsmanship meets timeless style for the modern gentleman.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-[var(--gray-400)]">
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-[var(--primary-400)]" />
                                <span>support@kaybirks.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-[var(--primary-400)]" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-[var(--primary-400)]" />
                                <span>New York, NY 10001</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Shop</h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--gray-400)] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--gray-400)] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[var(--gray-400)] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[var(--gray-800)]">
                <div className="container py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[var(--gray-500)] text-sm">
                            © {currentYear} KayBirks. All rights reserved.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-800)] rounded-full transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>

                        {/* Legal Links */}
                        <div className="flex items-center gap-6 text-sm text-[var(--gray-500)]">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
