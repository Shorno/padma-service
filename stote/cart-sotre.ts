import { create } from "zustand";
import { persist, createJSONStorage, } from "zustand/middleware";
import { Service } from "@/db/schema";
import {
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart as clearDbCart,
    syncCartToDatabase,
    getCartItems
} from "@/app/actions/cart";

export interface CartItem extends Service {
    quantity: number;
    subtotal: number;
}

interface CartState {
    items: CartItem[]
    totalQuantity: number;
    totalPrice: number;
    isOpen?: boolean;
    isSyncing: boolean;
    actions: {
        addItem: (service: Service, isAuthenticated?: boolean) => Promise<void>;
        setIsOpen?: (isOpen: boolean) => void;
        increment: (serviceId: number, isAuthenticated?: boolean) => Promise<void>;
        decrement: (serviceId: number, isAuthenticated?: boolean) => Promise<void>;
        removeItem: (serviceId: number, isAuthenticated?: boolean) => Promise<void>;
        clearCart: (isAuthenticated?: boolean) => Promise<void>;
        syncToDatabase: () => Promise<void>;
        loadFromDatabase: () => Promise<void>;
        buyNow: (service: Service, quantity: number, isAuthenticated?: boolean) => Promise<void>;
    };
}

function calculateTotals(items: CartItem[]) {
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0)

    return {
        totalQuantity,
        totalPrice
    }
}

function calculateSubtotal(price: number, quantity: number): number {
    return Number(price) * quantity;
}

const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalQuantity: 0,
            totalPrice: 0,
            isOpen: false,
            isSyncing: false,
            actions: {
                async addItem(service: Service, isAuthenticated = false) {
                    set((state) => {
                        const existingCartItemIndex = state.items.findIndex((existingCartItem) => existingCartItem.id === service.id);
                        let updatedCartItems: CartItem[];
                        if (existingCartItemIndex !== -1) {
                            updatedCartItems = state.items.map((cartItem, currentIndex) => {
                                if (currentIndex !== existingCartItemIndex) {
                                    return cartItem;
                                }
                                const existingCartItem = cartItem;

                                const nextQuantity = service.stockQuantity !== undefined ?
                                    Math.min(existingCartItem.quantity + 1, service.stockQuantity) : existingCartItem.quantity + 1

                                const updatedCartItem: CartItem = {
                                    ...existingCartItem,
                                    quantity: nextQuantity,
                                    subtotal: calculateSubtotal(Number(existingCartItem.price), nextQuantity)
                                }

                                return updatedCartItem;
                            })
                        } else {
                            const newCartItem: CartItem = {
                                ...service,
                                quantity: 1,
                                subtotal: calculateSubtotal(Number(service.price), 1)
                            };
                            updatedCartItems = [...state.items, newCartItem]
                        }

                        const { totalQuantity, totalPrice } = calculateTotals(updatedCartItems)

                        return {
                            items: updatedCartItems,
                            totalPrice,
                            totalQuantity,
                            isOpen: true,
                        }
                    });

                    // Sync to database if authenticated
                    if (isAuthenticated) {
                        await addToCart(service.id, 1);
                    }
                },
                async increment(serviceId, isAuthenticated = false) {
                    let newQuantity = 0;

                    set((state) => {
                        const items = state.items.map((item) => {
                            if (item.id === serviceId) {
                                const max = item.stockQuantity ?? Infinity;
                                newQuantity = Math.min(item.quantity + 1, max);
                                return {
                                    ...item,
                                    quantity: newQuantity,
                                    subtotal: calculateSubtotal(Number(item.price), newQuantity)
                                }
                            }
                            return item;
                        })
                        const { totalQuantity, totalPrice } = calculateTotals(items);

                        return {
                            items,
                            totalQuantity,
                            totalPrice,
                        }
                    });

                    // Sync to database if authenticated
                    if (isAuthenticated && newQuantity > 0) {
                        await updateCartItemQuantity(serviceId, newQuantity);
                    }
                },
                async decrement(serviceId, isAuthenticated = false) {
                    let newQuantity = 0;

                    set((state) => {
                        const items = state.items.map((item) => {
                            if (item.id === serviceId) {
                                newQuantity = Math.max(item.quantity - 1, 1);
                                return {
                                    ...item,
                                    quantity: newQuantity,
                                    subtotal: calculateSubtotal(Number(item.price), newQuantity)
                                }
                            }
                            return item;
                        })
                        const { totalQuantity, totalPrice } = calculateTotals(items);
                        return {
                            items,
                            totalQuantity,
                            totalPrice
                        }
                    });

                    // Sync to database if authenticated
                    if (isAuthenticated && newQuantity > 0) {
                        await updateCartItemQuantity(serviceId, newQuantity);
                    }
                },
                async removeItem(serviceId, isAuthenticated = false) {
                    set((state) => {
                        const items = state.items.filter((item) => item.id !== serviceId);
                        const { totalQuantity, totalPrice } = calculateTotals(items);
                        return { items, totalQuantity, totalPrice };
                    });

                    // Sync to database if authenticated
                    if (isAuthenticated) {
                        await removeFromCart(serviceId);
                    }
                },
                setIsOpen(isOpen: boolean) {
                    set(() => ({ isOpen }));
                },
                async clearCart(isAuthenticated = false) {
                    set(() => ({
                        items: [],
                        totalQuantity: 0,
                        totalPrice: 0,
                        isOpen: false,
                    }));

                    // Sync to database if authenticated
                    if (isAuthenticated) {
                        await clearDbCart();
                    }
                },
                async syncToDatabase() {
                    const state = get();
                    if (state.isSyncing || state.items.length === 0) return;

                    set({ isSyncing: true });

                    try {
                        const cartData = state.items.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            priceAtAdd: item.price,
                        }));

                        await syncCartToDatabase(cartData);
                    } catch (error) {
                        console.error("Error syncing cart to database:", error);
                    } finally {
                        set({ isSyncing: false });
                    }
                },
                async loadFromDatabase() {
                    const state = get();
                    if (state.isSyncing) return;

                    set({ isSyncing: true });

                    try {
                        const result = await getCartItems();

                        if (result.success && result.data) {
                            const cartItems: CartItem[] = result.data.map((item) => ({
                                ...item.product,
                                quantity: item.quantity,
                                subtotal: calculateSubtotal(Number(item.product.price), item.quantity),
                            }));

                            const { totalQuantity, totalPrice } = calculateTotals(cartItems);

                            set({
                                items: cartItems,
                                totalQuantity,
                                totalPrice,
                            });
                        }
                    } catch (error) {
                        console.error("Error loading cart from database:", error);
                    } finally {
                        set({ isSyncing: false });
                    }
                },
                async buyNow(service: Service, quantity: number, isAuthenticated = false) {
                    set(() => ({
                        items: [],
                        totalQuantity: 0,
                        totalPrice: 0,
                        isOpen: false,
                    }));

                    const newCartItem: CartItem = {
                        ...service,
                        quantity,
                        subtotal: calculateSubtotal(Number(service.price), quantity)
                    };

                    set({
                        items: [newCartItem],
                        totalQuantity: quantity,
                        totalPrice: newCartItem.subtotal,
                        isOpen: true,
                    });

                    // Sync to database if authenticated
                    if (isAuthenticated) {
                        await clearDbCart(); // Clear existing cart in the database
                        await addToCart(service.id, quantity);
                    }
                },
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                items: state.items,
                totalQuantity: state.totalQuantity,
                totalPrice: state.totalPrice,
                isOpen: state.isOpen
            }),
            version: 1,
            // Fixed onRehydrateStorage
            onRehydrateStorage: () => {
                return (state) => {
                    if (state?.items) {
                        const { totalQuantity, totalPrice } = calculateTotals(state.items);
                        state.totalQuantity = totalQuantity;
                        state.totalPrice = totalPrice;
                    }
                }
            }
        }
    )
)

export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotalQuantity = () => useCartStore((state) => state.totalQuantity);
export const useCartTotalPrice = () => useCartStore((state) => state.totalPrice);
export const useCartActions = () => useCartStore((state) => state.actions);
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);
