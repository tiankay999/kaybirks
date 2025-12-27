export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    addresses?: Address[];
    createdAt: Date;
}

export interface Address {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    model3dUrl?: string | null;
    sizes: number[];
    colors: string[];
    category: string;
    stock: number;
    featured: boolean;
    tags: string[];
    createdAt: Date;
    reviews?: Review[];
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: number;
    color?: string;
    image?: string;
}

export interface Order {
    id: string;
    userId: string;
    user?: User;
    items: OrderItem[];
    total: number;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    shippingAddress: Address;
    createdAt: Date;
}

export interface Review {
    id: string;
    productId: string;
    product?: Product;
    userId: string;
    user?: User;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface CartItem {
    product: Product;
    quantity: number;
    size: number;
    color: string;
}

export interface FilterOptions {
    sizes?: number[];
    colors?: string[];
    priceMin?: number;
    priceMax?: number;
    category?: string;
    inStock?: boolean;
}

export interface SortOption {
    label: string;
    value: string;
    field: 'createdAt' | 'price' | 'rating';
    direction: 'asc' | 'desc';
}

export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    lowStockProducts: Product[];
    recentOrders: Order[];
}
