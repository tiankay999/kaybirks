import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Check if id is a slug or actual id
        const product = await prisma.product.findFirst({
            where: {
                OR: [
                    { id },
                    { slug: id },
                ],
            },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                images: body.images,
                model3dUrl: body.model3dUrl,
                sizes: body.sizes,
                colors: body.colors,
                category: body.category,
                stock: body.stock,
                featured: body.featured,
                tags: body.tags,
            },
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
