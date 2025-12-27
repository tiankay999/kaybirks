'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Button, Input, Select, ProductCardSkeleton } from '@/components/ui';
import { Product } from '@/types';

const categories = ['All', 'Sandals', 'Clogs', 'Slides', 'Boots'];
const colors = ['Black', 'Brown', 'Tan', 'White', 'Navy', 'Gray'];
const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

const sortOptions = [
    { value: 'newest', label: 'Newest First', field: 'createdAt', direction: 'desc' },
    { value: 'price-asc', label: 'Price: Low to High', field: 'price', direction: 'asc' },
    { value: 'price-desc', label: 'Price: High to Low', field: 'price', direction: 'desc' },
    { value: 'rating', label: 'Best Rating', field: 'rating', direction: 'desc' },
];

function ShopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter state
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [inStockOnly, setInStockOnly] = useState(false);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (selectedCategory !== 'All') params.set('category', selectedCategory.toLowerCase());
            if (selectedColors.length) params.set('colors', selectedColors.join(','));
            if (selectedSizes.length) params.set('sizes', selectedSizes.join(','));
            if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
            if (priceRange.max < 500) params.set('maxPrice', priceRange.max.toString());
            if (sortBy) params.set('sort', sortBy);
            if (inStockOnly) params.set('inStock', 'true');

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory, selectedColors, selectedSizes, priceRange, sortBy, inStockOnly]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const updateURL = useCallback(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (selectedCategory !== 'All') params.set('category', selectedCategory.toLowerCase());
        if (sortBy !== 'newest') params.set('sort', sortBy);
        router.push(`/shop?${params.toString()}`, { scroll: false });
    }, [searchQuery, selectedCategory, sortBy, router]);

    useEffect(() => {
        updateURL();
    }, [updateURL]);

    const toggleColor = (color: string) => {
        setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    const toggleSize = (size: number) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setSelectedColors([]);
        setSelectedSizes([]);
        setPriceRange({ min: 0, max: 500 });
        setSortBy('newest');
        setInStockOnly(false);
    };

    const activeFiltersCount =
        (selectedCategory !== 'All' ? 1 : 0) +
        selectedColors.length +
        selectedSizes.length +
        (priceRange.min > 0 || priceRange.max < 500 ? 1 : 0) +
        (inStockOnly ? 1 : 0);

    return (
        <div className="min-h-screen bg-[var(--gray-50)]">
            {/* Header */}
            <div className="bg-white border-b border-[var(--gray-200)]">
                <div className="container py-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gray-900)]">Shop Collection</h1>
                    <p className="text-[var(--gray-600)] mt-2">
                        Discover our premium selection of men&apos;s Birkenstock footwear
                    </p>
                </div>
            </div>

            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)] p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-semibold text-[var(--gray-900)]">Filters</h2>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[var(--primary-500)] hover:underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="font-medium text-[var(--gray-900)] mb-3">Category</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`block w-full text-left px-3 py-2 rounded-[var(--radius-md)] transition-colors ${selectedCategory === cat
                                                    ? 'bg-[var(--primary-100)] text-[var(--primary-700)]'
                                                    : 'text-[var(--gray-600)] hover:bg-[var(--gray-100)]'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="mb-6">
                                <h3 className="font-medium text-[var(--gray-900)] mb-3">Colors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => toggleColor(color)}
                                            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedColors.includes(color)
                                                    ? 'bg-[var(--primary-500)] text-white border-transparent'
                                                    : 'border-[var(--gray-300)] text-[var(--gray-600)] hover:border-[var(--primary-500)]'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="mb-6">
                                <h3 className="font-medium text-[var(--gray-900)] mb-3">Sizes (EU)</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-2 py-1.5 text-sm rounded-[var(--radius-md)] border transition-colors ${selectedSizes.includes(size)
                                                    ? 'bg-[var(--primary-500)] text-white border-transparent'
                                                    : 'border-[var(--gray-300)] text-[var(--gray-600)] hover:border-[var(--primary-500)]'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-medium text-[var(--gray-900)] mb-3">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange((p) => ({ ...p, min: +e.target.value }))}
                                        className="w-20 px-2 py-1.5 text-sm border border-[var(--gray-300)] rounded-[var(--radius-md)]"
                                        placeholder="Min"
                                    />
                                    <span className="text-[var(--gray-400)]">-</span>
                                    <input
                                        type="number"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange((p) => ({ ...p, max: +e.target.value }))}
                                        className="w-20 px-2 py-1.5 text-sm border border-[var(--gray-300)] rounded-[var(--radius-md)]"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>

                            {/* In Stock Only */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-4 h-4 rounded border-[var(--gray-300)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                                />
                                <span className="text-[var(--gray-700)]">In stock only</span>
                            </label>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 bg-white rounded-[var(--radius-lg)] p-4 border border-[var(--gray-200)]">
                            <div className="flex items-center gap-4">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[var(--gray-300)] rounded-[var(--radius-lg)]"
                                >
                                    <SlidersHorizontal size={18} />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="w-5 h-5 bg-[var(--primary-500)] text-white text-xs rounded-full flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                <p className="text-[var(--gray-600)]">
                                    <span className="font-medium">{products.length}</span> products
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[var(--gray-500)] hidden sm:block">Sort by:</span>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
                                    className="w-44"
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                                : products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                        </div>

                        {/* Empty State */}
                        {!isLoading && products.length === 0 && (
                            <div className="text-center py-16">
                                <Search size={48} className="mx-auto text-[var(--gray-400)] mb-4" />
                                <h3 className="text-xl font-semibold text-[var(--gray-900)] mb-2">
                                    No products found
                                </h3>
                                <p className="text-[var(--gray-600)] mb-6">
                                    Try adjusting your filters or search terms
                                </p>
                                <Button onClick={clearFilters}>Clear Filters</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold">Filters</h2>
                                    <button onClick={() => setIsFilterOpen(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Same filter content as sidebar */}
                                <div className="space-y-6">
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />

                                    <div>
                                        <h3 className="font-medium mb-3">Category</h3>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => { setSelectedCategory(cat); }}
                                                className={`block w-full text-left px-3 py-2 rounded-lg ${selectedCategory === cat
                                                        ? 'bg-[var(--primary-100)] text-[var(--primary-700)]'
                                                        : 'hover:bg-[var(--gray-100)]'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    <Button fullWidth onClick={() => setIsFilterOpen(false)}>
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--gray-50)]" />}>
            <ShopContent />
        </Suspense>
    );
}
