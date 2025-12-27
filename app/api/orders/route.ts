import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createOrderSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const userId = searchParams.get('userId');

        const where: Record<string, unknown> = {};

        // Admin can see all orders, users only their own
        if (session.user.role === 'ADMIN') {
            if (userId) where.userId = userId;
            if (status) where.status = status;
        } else {
            where.userId = session.user.id;
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
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
        const validation = createOrderSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { items, shippingAddress } = validation.data;

        // Calculate total
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingCost = total >= 100 ? 0 : 10;
        const orderTotal = total + shippingCost;

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                items,
                total: orderTotal,
                shippingAddress,
                status: 'PENDING',
            },
        });

        // Update product stock
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        }

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error('Failed to create order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
