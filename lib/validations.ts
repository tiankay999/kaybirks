import { z } from 'zod';

// User schemas
export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(7, 'Password must be at least 7 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Product schemas
export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    model3dUrl: z.string().url().optional().nullable(),
    sizes: z.array(z.number()).min(1, 'At least one size is required'),
    colors: z.array(z.string()).min(1, 'At least one color is required'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

// Order schemas
export const orderItemSchema = z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive(),
    size: z.number(),
    color: z.string().optional(),
    image: z.string().optional(),
});

export const shippingAddressSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    phone: z.string().optional(),
});

export const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
    shippingAddress: shippingAddressSchema,
});

// Review schemas
export const reviewSchema = z.object({
    productId: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1, 'Comment is required'),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
