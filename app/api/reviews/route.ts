import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        const where: Record<string, unknown> = {};
        if (productId) where.productId = productId;

        const reviews = await prisma.review.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true },
                },
                product: {
                    select: { id: true, name: true, slug: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate input
        const validation = reviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { productId, rating, comment } = validation.data;

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                productId_userId: {
                    productId,
                    userId: session.user.id,
                },
            },
        });

        if (existingReview) {
            // Update existing review
            const review = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment },
                include: {
                    user: {
                        select: { id: true, name: true },
                    },
                },
            });
            return NextResponse.json({ review });
        }

        // Create new review
        const review = await prisma.review.create({
            data: {
                productId,
                userId: session.user.id,
                rating,
                comment,
            },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });

        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        console.error('Failed to create review:', error);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }
}
