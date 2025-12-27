'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, size: number, color: string) => void;
    updateQuantity: (productId: string, size: number, color: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kaybirks-cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch {
                console.error('Failed to parse cart from localStorage');
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage when it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: CartItem) => {
        setItems((currentItems) => {
            const existingIndex = currentItems.findIndex(
                (item) =>
                    item.product.id === newItem.product.id &&
                    item.size === newItem.size &&
                    item.color === newItem.color
            );

            if (existingIndex >= 0) {
                const updated = [...currentItems];
                updated[existingIndex].quantity += newItem.quantity;
                return updated;
            }

            return [...currentItems, newItem];
        });
    };

    const removeItem = (productId: string, size: number, color: string) => {
        setItems((currentItems) =>
            currentItems.filter(
                (item) =>
                    !(
                        item.product.id === productId &&
                        item.size === size &&
                        item.color === color
                    )
            )
        );
    };

    const updateQuantity = (
        productId: string,
        size: number,
        color: string,
        quantity: number
    ) => {
        if (quantity <= 0) {
            removeItem(productId, size, color);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product.id === productId &&
                    item.size === size &&
                    item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
