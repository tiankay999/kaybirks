'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Badge, Button } from './ui';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
    product: Product;
    showQuickView?: boolean;
}

export function ProductCard({ product, showQuickView = true }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem } = useCart();

    const averageRating = product.reviews?.length
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.sizes.length > 0 && product.colors.length > 0) {
            addItem({
                product,
                quantity: 1,
                size: product.sizes[0],
                color: product.colors[0],
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setSelectedImage(0);
            }}
            className="group relative bg-white rounded-[var(--radius-xl)] overflow-hidden border border-[var(--gray-200)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] transition-all duration-300"
        >
            <Link href={`/shop/${product.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--gray-50)]">
                    {product.images.length > 0 && (
                        <Image
                            src={product.images[selectedImage] || product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.featured && (
                            <Badge variant="primary" size="sm">Featured</Badge>
                        )}
                        {product.stock === 0 && (
                            <Badge variant="error" size="sm">Out of Stock</Badge>
                        )}
                        {product.stock > 0 && product.stock <= 5 && (
                            <Badge variant="warning" size="sm">Low Stock</Badge>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute top-3 right-3 flex flex-col gap-2"
                    >
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-[var(--primary-500)] hover:text-white transition-colors"
                            aria-label="Add to wishlist"
                        >
                            <Heart size={18} />
                        </button>
                        {showQuickView && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-[var(--primary-500)] hover:text-white transition-colors"
                                aria-label="Quick view"
                            >
                                <Eye size={18} />
                            </button>
                        )}
                    </motion.div>

                    {/* Image Thumbnails on Hover */}
                    {product.images.length > 1 && isHovered && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {product.images.slice(0, 4).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedImage(idx);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${selectedImage === idx
                                            ? 'bg-[var(--primary-500)] w-4'
                                            : 'bg-white/70'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Quick Add Button */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                        className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={handleQuickAdd}
                            disabled={product.stock === 0}
                            className="backdrop-blur-sm"
                        >
                            <ShoppingBag size={16} />
                            Quick Add
                        </Button>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Category */}
                    <p className="text-xs font-medium text-[var(--primary-500)] uppercase tracking-wide mb-1">
                        {product.category}
                    </p>

                    {/* Name */}
                    <h3 className="font-semibold text-[var(--gray-900)] group-hover:text-[var(--primary-600)] transition-colors line-clamp-2 mb-2">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {product.reviews && product.reviews.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-[var(--gray-700)]">
                                {averageRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-[var(--gray-500)]">
                                ({product.reviews.length})
                            </span>
                        </div>
                    )}

                    {/* Price & Colors */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[var(--gray-900)]">
                            {formatPrice(product.price)}
                        </span>

                        {/* Color Swatches */}
                        <div className="flex items-center gap-1">
                            {product.colors.slice(0, 4).map((color, idx) => (
                                <span
                                    key={idx}
                                    className="w-4 h-4 rounded-full border border-[var(--gray-300)]"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                />
                            ))}
                            {product.colors.length > 4 && (
                                <span className="text-xs text-[var(--gray-500)]">
                                    +{product.colors.length - 4}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="mt-3 flex flex-wrap gap-1">
                        {product.sizes.slice(0, 6).map((size) => (
                            <span
                                key={size}
                                className="px-2 py-0.5 text-xs border border-[var(--gray-200)] rounded text-[var(--gray-600)]"
                            >
                                EU {size}
                            </span>
                        ))}
                        {product.sizes.length > 6 && (
                            <span className="px-2 py-0.5 text-xs text-[var(--gray-500)]">
                                +{product.sizes.length - 6}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
