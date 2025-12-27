import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const colors = searchParams.get('colors')?.split(',');
        const sizes = searchParams.get('sizes')?.split(',').map(Number);
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
        const sort = searchParams.get('sort') || 'newest';
        const inStock = searchParams.get('inStock') === 'true';
        const featured = searchParams.get('featured') === 'true';
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

        // Build where clause
        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search.toLowerCase() } },
            ];
        }

        if (category) {
            where.category = { equals: category, mode: 'insensitive' };
        }

        if (colors && colors.length > 0) {
            where.colors = { hasSome: colors };
        }

        if (sizes && sizes.length > 0) {
            where.sizes = { hasSome: sizes };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice;
            if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice;
        }

        if (inStock) {
            where.stock = { gt: 0 };
        }

        if (featured) {
            where.featured = true;
        }

        // Build order by
        let orderBy: Record<string, string> = { createdAt: 'desc' };
        switch (sort) {
            case 'price-asc':
                orderBy = { price: 'asc' };
                break;
            case 'price-desc':
                orderBy = { price: 'desc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        }

        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: limit,
            include: {
                reviews: {
                    include: {
                        user: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                images: body.images,
                model3dUrl: body.model3dUrl || null,
                sizes: body.sizes,
                colors: body.colors,
                category: body.category,
                stock: body.stock,
                featured: body.featured || false,
                tags: body.tags || [],
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Failed to create product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
