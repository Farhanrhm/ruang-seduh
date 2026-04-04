import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpenCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpenCart: false,
      
      openCart: () => set({ isOpenCart: true }),
      closeCart: () => set({ isOpenCart: false }),

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },

      decreaseQuantity: (productId) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === productId);

        if (existingItem?.quantity === 1) {
          set({ items: currentItems.filter((item) => item.id !== productId) });
        } else {
          set({
            items: currentItems.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    { name: 'ruang-seduh-cart' }
  )
);