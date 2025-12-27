'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { Review } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {
        setIsLoading(true);
        try {
            const res = await fetch('/api/reviews');
            if (res.ok) {
                const data = await res.json();
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(reviewId: string) {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            }
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">Reviews</h1>
                <p className="text-[var(--gray-600)]">{reviews.length} total reviews</p>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-32 skeleton rounded-xl" />
                    ))
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-[var(--gray-200)] p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div>
                                            <p className="font-medium text-[var(--gray-900)]">
                                                {review.user?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-[var(--gray-500)]">
                                                {formatDate(review.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--gray-300)]'}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {review.product && (
                                        <Link
                                            href={`/shop/${review.product.slug}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-sm text-[var(--primary-500)] hover:underline mb-3"
                                        >
                                            {review.product.name}
                                            <ExternalLink size={14} />
                                        </Link>
                                    )}

                                    <p className="text-[var(--gray-600)]">{review.comment}</p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(review.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl border border-[var(--gray-200)] p-12 text-center">
                        <Star size={48} className="mx-auto text-[var(--gray-300)] mb-4" />
                        <p className="text-[var(--gray-500)]">No reviews yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
