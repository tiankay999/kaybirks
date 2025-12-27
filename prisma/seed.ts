import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@kaybirks.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@kaybirks.com',
            passwordHash: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create test user
    const userPassword = await bcrypt.hash('user1234', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            name: 'John Doe',
            email: 'user@example.com',
            passwordHash: userPassword,
            role: 'USER',
        },
    });
    console.log('✅ Test user created:', user.email);

    // Sample products
    const products = [
        {
            name: 'Arizona Birko-Flor',
            slug: 'arizona-birko-flor',
            description: 'The iconic two-strap sandal with a contoured cork footbed for all-day comfort. Made with durable Birko-Flor upper that resembles smooth leather.',
            price: 110.00,
            images: [
                'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800',
                'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800',
            ],
            sizes: [39, 40, 41, 42, 43, 44, 45, 46],
            colors: ['Black', 'Brown', 'White'],
            category: 'Sandals',
            stock: 50,
            featured: true,
            tags: ['bestseller', 'classic', 'summer'],
        },
        {
            name: 'Boston Soft Footbed',
            slug: 'boston-soft-footbed',
            description: 'Premium suede leather clog with soft footbed for enhanced cushioning. Perfect for indoor and outdoor wear.',
            price: 155.00,
            images: [
                'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
            ],
            sizes: [40, 41, 42, 43, 44, 45, 46, 47],
            colors: ['Taupe', 'Black', 'Brown'],
            category: 'Clogs',
            stock: 35,
            featured: true,
            tags: ['premium', 'comfortable', 'year-round'],
        },
        {
            name: 'Gizeh Birko-Flor',
            slug: 'gizeh-birko-flor',
            description: 'Classic thong sandal with sleek profile. Features adjustable buckle and anatomically shaped footbed.',
            price: 100.00,
            images: [
                'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
            ],
            sizes: [38, 39, 40, 41, 42, 43, 44, 45],
            colors: ['Black', 'White', 'Navy'],
            category: 'Sandals',
            stock: 42,
            featured: false,
            tags: ['elegant', 'summer', 'versatile'],
        },
        {
            name: 'Milano Leather',
            slug: 'milano-leather',
            description: 'Three-strap sandal with heel strap for secure fit. Made with premium natural leather.',
            price: 130.00,
            images: [
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
            ],
            sizes: [39, 40, 41, 42, 43, 44, 45, 46],
            colors: ['Brown', 'Black', 'Tan'],
            category: 'Sandals',
            stock: 28,
            featured: true,
            tags: ['secure-fit', 'outdoor', 'hiking'],
        },
        {
            name: 'Zurich Suede',
            slug: 'zurich-suede',
            description: 'Double strap slide with soft suede upper. Features adjustable straps for personalized fit.',
            price: 135.00,
            images: [
                'https://images.unsplash.com/photo-1582897085656-c04f40577bee?w=800',
            ],
            sizes: [40, 41, 42, 43, 44, 45, 46],
            colors: ['Taupe', 'Gray', 'Navy'],
            category: 'Slides',
            stock: 20,
            featured: false,
            tags: ['casual', 'suede', 'adjustable'],
        },
        {
            name: 'Tokio Super Grip',
            slug: 'tokio-super-grip',
            description: 'Professional work clog with Super Grip sole. Designed for slip-resistance and all-day comfort.',
            price: 90.00,
            images: [
                'https://images.unsplash.com/photo-1595461135849-c308a3aee54a?w=800',
            ],
            sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
            colors: ['White', 'Black'],
            category: 'Clogs',
            stock: 60,
            featured: false,
            tags: ['professional', 'slip-resistant', 'work'],
        },
        {
            name: 'Barbados EVA',
            slug: 'barbados-eva',
            description: 'Lightweight waterproof slide made from EVA. Perfect for pool, beach, and casual wear.',
            price: 45.00,
            images: [
                'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800',
            ],
            sizes: [39, 40, 41, 42, 43, 44, 45, 46],
            colors: ['Black', 'White', 'Navy', 'Gray'],
            category: 'Slides',
            stock: 80,
            featured: false,
            tags: ['waterproof', 'beach', 'lightweight'],
        },
        {
            name: 'Stalon Chelsea Boot',
            slug: 'stalon-chelsea-boot',
            description: 'Classic Chelsea boot with Birkenstock footbed. Premium nubuck leather with elastic side panels.',
            price: 240.00,
            images: [
                'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800',
            ],
            sizes: [40, 41, 42, 43, 44, 45, 46, 47],
            colors: ['Black', 'Brown'],
            category: 'Boots',
            stock: 15,
            featured: true,
            tags: ['winter', 'premium', 'leather'],
        },
        {
            name: 'Mayari Oiled Leather',
            slug: 'mayari-oiled-leather',
            description: 'Cross-strap sandal with toe loop. Features rich oiled leather that develops unique patina over time.',
            price: 125.00,
            images: [
                'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
            ],
            sizes: [38, 39, 40, 41, 42, 43, 44, 45],
            colors: ['Habana', 'Black', 'Tobacco'],
            category: 'Sandals',
            stock: 3,
            featured: false,
            tags: ['leather', 'patina', 'unique'],
        },
        {
            name: 'Kyoto Wool Felt',
            slug: 'kyoto-wool-felt',
            description: 'Cozy slide with premium wool felt upper. Perfect for indoor wear during cooler months.',
            price: 140.00,
            images: [
                'https://images.unsplash.com/photo-1491553895911-0055uj8a7pu8?w=800',
            ],
            sizes: [39, 40, 41, 42, 43, 44, 45, 46],
            colors: ['Anthracite', 'Light Gray'],
            category: 'Slides',
            stock: 25,
            featured: false,
            tags: ['wool', 'indoor', 'cozy'],
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }
    console.log(`✅ ${products.length} products created`);

    console.log('🎉 Seed completed!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@kaybirks.com / admin123');
    console.log('User: user@example.com / user1234');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
