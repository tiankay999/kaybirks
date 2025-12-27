import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get counts
        const [totalOrders, totalProducts, totalUsers, orders, lowStockProducts, recentOrders] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.user.count(),
            prisma.order.findMany({
                select: { total: true },
            }),
            prisma.product.findMany({
                where: { stock: { lte: 5 } },
                take: 5,
                orderBy: { stock: 'asc' },
            }),
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            }),
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        return NextResponse.json({
            stats: {
                totalOrders,
                totalRevenue,
                totalProducts,
                totalUsers,
                lowStockProducts,
                recentOrders,
            },
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
