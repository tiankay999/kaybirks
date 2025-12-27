'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, Heart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button, Badge, ProductDetailSkeleton } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { Product, Review } from '@/types';
import { formatPrice, formatDate, calculateAverageRating } from '@/lib/utils';

// Dynamic import for 3D viewer to avoid SSR issues
const ProductViewer3D = dynamic(() => import('@/components/ProductViewer3D').then(mod => ({ default: mod.ProductViewer3D })), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] skeleton rounded-[var(--radius-xl)]" />,
});

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { slug } = use(params);
    const { data: session } = useSession();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [show3D, setShow3D] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data.product);
                    if (data.product.sizes.length > 0) {
                        setSelectedSize(data.product.sizes[0]);
                    }
                    if (data.product.colors.length > 0) {
                        setSelectedColor(data.product.colors[0]);
                    }

                    // Fetch related products
                    const relatedRes = await fetch(`/api/products?category=${data.product.category}&limit=4`);
                    if (relatedRes.ok) {
                        const relatedData = await relatedRes.json();
                        setRelatedProducts(relatedData.products.filter((p: Product) => p.id !== data.product.id).slice(0, 4));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (product && selectedSize && selectedColor) {
            addItem({
                product,
                quantity,
                size: selectedSize,
                color: selectedColor,
            });
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !session) return;

        setIsSubmittingReview(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    rating: reviewRating,
                    comment: reviewComment,
                }),
            });

            if (res.ok) {
                const newReview = await res.json();
                setProduct((prev) =>
                    prev ? { ...prev, reviews: [...(prev.reviews || []), newReview.review] } : null
                );
                setShowReviewForm(false);
                setReviewComment('');
                setReviewRating(5);
            }
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container py-12">
                <ProductDetailSkeleton />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <Link href="/shop">
                    <Button>Back to Shop</Button>
                </Link>
            </div>
        );
    }

    const averageRating = calculateAverageRating(product.reviews || []);
    const userHasReviewed = product.reviews?.some((r) => r.userId === session?.user?.id);

    return (
        <div className="bg-[var(--gray-50)] min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-[var(--gray-200)]">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm text-[var(--gray-500)]">
                        <Link href="/" className="hover:text-[var(--primary-500)]">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-[var(--primary-500)]">Shop</Link>
                        <span>/</span>
                        <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-[var(--primary-500)] capitalize">
                            {product.category}
                        </Link>
                        <span>/</span>
                        <span className="text-[var(--gray-900)]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Images / 3D Viewer */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-white rounded-[var(--radius-xl)] overflow-hidden border border-[var(--gray-200)]">
                            <AnimatePresence mode="wait">
                                {show3D && product.model3dUrl ? (
                                    <motion.div
                                        key="3d"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full"
                                    >
                                        <ProductViewer3D
                                            modelUrl={product.model3dUrl}
                                            fallbackImage={product.images[0]}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={`image-${selectedImage}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={product.images[selectedImage] || product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {!show3D && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* 3D Toggle */}
                            {product.model3dUrl && (
                                <button
                                    onClick={() => setShow3D(!show3D)}
                                    className="absolute top-4 right-4 px-4 py-2 bg-white/90 rounded-full shadow-md hover:bg-white text-sm font-medium"
                                >
                                    {show3D ? 'View Images' : 'View in 3D'}
                                </button>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {!show3D && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-20 h-20 rounded-[var(--radius-lg)] overflow-hidden border-2 flex-shrink-0 ${selectedImage === idx ? 'border-[var(--primary-500)]' : 'border-transparent'
                                            }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-[var(--primary-500)] uppercase tracking-wide mb-2">
                                    {product.category}
                                </p>
                                <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gray-900)]">
                                    {product.name}
                                </h1>
                            </div>
                            {product.featured && <Badge variant="primary">Featured</Badge>}
                        </div>

                        {/* Rating */}
                        {product.reviews && product.reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            className={star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--gray-300)]'}
                                        />
                                    ))}
                                </div>
                                <span className="font-medium">{averageRating.toFixed(1)}</span>
                                <span className="text-[var(--gray-500)]">({product.reviews.length} reviews)</span>
                            </div>
                        )}

                        {/* Price */}
                        <p className="text-3xl font-bold text-[var(--gray-900)] mb-6">
                            {formatPrice(product.price)}
                        </p>

                        {/* Description */}
                        <p className="text-[var(--gray-600)] mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <h3 className="font-medium text-[var(--gray-900)] mb-3">
                                Color: <span className="font-normal">{selectedColor}</span>
                            </h3>
                            <div className="flex gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                                                ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-200)]'
                                                : 'border-[var(--gray-300)]'
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    >
                                        {selectedColor === color && (
                                            <Check size={16} className="mx-auto text-white drop-shadow" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-[var(--gray-900)]">Size (EU)</h3>
                                <Link href="/size-guide" className="text-sm text-[var(--primary-500)] hover:underline">
                                    Size Guide
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-14 h-12 rounded-[var(--radius-lg)] border font-medium transition-all ${selectedSize === size
                                                ? 'bg-[var(--primary-500)] text-white border-transparent'
                                                : 'border-[var(--gray-300)] hover:border-[var(--primary-500)]'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="font-medium text-[var(--gray-900)] mb-3">Quantity</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-[var(--gray-300)] rounded-[var(--radius-lg)]">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-3 hover:bg-[var(--gray-100)]"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                        className="p-3 hover:bg-[var(--gray-100)]"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <span className="text-sm text-[var(--gray-500)]">
                                    {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <Button
                                size="lg"
                                fullWidth
                                onClick={handleAddToCart}
                                disabled={!selectedSize || !selectedColor || product.stock === 0}
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="lg" className="flex-shrink-0">
                                <Heart size={20} />
                            </Button>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-[var(--gray-900)]">Customer Reviews</h2>
                        {session && !userHasReviewed && (
                            <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
                        )}
                    </div>

                    {/* Review Form */}
                    <AnimatePresence>
                        {showReviewForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8"
                            >
                                <form
                                    onSubmit={handleSubmitReview}
                                    className="bg-white p-6 rounded-[var(--radius-xl)] border border-[var(--gray-200)]"
                                >
                                    <h3 className="font-semibold text-lg mb-4">Write Your Review</h3>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="p-1"
                                                >
                                                    <Star
                                                        size={28}
                                                        className={star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--gray-300)]'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Your Review</label>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-[var(--gray-300)] rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                            placeholder="Share your experience with this product..."
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" isLoading={isSubmittingReview}>
                                            Submit Review
                                        </Button>
                                        <Button type="button" variant="ghost" onClick={() => setShowReviewForm(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reviews List */}
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {product.reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white p-6 rounded-[var(--radius-xl)] border border-[var(--gray-200)]"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-[var(--gray-900)]">
                                                {review.user?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-[var(--gray-500)]">
                                                {formatDate(review.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--gray-300)]'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[var(--gray-600)]">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-[var(--radius-xl)] border border-[var(--gray-200)]">
                            <Star size={48} className="mx-auto text-[var(--gray-300)] mb-4" />
                            <p className="text-[var(--gray-600)]">No reviews yet. Be the first to review!</p>
                        </div>
                    )}
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
