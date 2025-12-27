'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Button, Badge, Input, Select } from '@/components/ui';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(productId: string) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setProducts((prev) => prev.filter((p) => p.id !== productId));
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    }

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || product.category.toLowerCase() === categoryFilter.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map((p) => p.category))];

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Products</h1>
                    <p className="text-[var(--gray-600)]">{products.length} total products</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus size={18} />
                        Add Product
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    options={[
                        { value: '', label: 'All Categories' },
                        ...categories.map((c) => ({ value: c.toLowerCase(), label: c })),
                    ]}
                    className="w-48"
                />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Product</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Price</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Stock</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--gray-600)]">Status</th>
                                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--gray-600)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--gray-200)]">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-4 py-4">
                                            <div className="h-12 skeleton rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-[var(--gray-50)]"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--gray-100)] flex-shrink-0">
                                                    {product.images[0] && (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[var(--gray-900)]">{product.name}</p>
                                                    <p className="text-sm text-[var(--gray-500)]">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="capitalize text-[var(--gray-700)]">{product.category}</span>
                                        </td>
                                        <td className="px-4 py-4 font-medium text-[var(--gray-900)]">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`font-medium ${product.stock === 0
                                                    ? 'text-red-600'
                                                    : product.stock <= 5
                                                        ? 'text-yellow-600'
                                                        : 'text-green-600'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {product.featured ? (
                                                <Badge variant="primary" size="sm">Featured</Badge>
                                            ) : (
                                                <Badge variant="default" size="sm">Regular</Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit2 size={16} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-[var(--gray-500)]">
                                        No products found
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
