import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/productCatalog';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface StoreState {
  cartItems: CartItem[];
  favoriteItems: Product[];
  isCartOpen: boolean;
  isFavoritesOpen: boolean;
  isCartVibrating: boolean;

  // Cart Actions
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  triggerCartVibration: () => void;

  // Favorites Actions
  toggleFavorite: (product: Product) => void;
  toggleFavoritesDrawer: () => void;
  setFavoritesOpen: (isOpen: boolean) => void;
}

export const useShopStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      favoriteItems: [],
      isCartOpen: false,
      isFavoritesOpen: false,
      isCartVibrating: false,

      addToCart: (product, size) => {
        get().triggerCartVibration(); // Start the 1.5s shake globally
        
        set((state) => {
        const existingItem = state.cartItems.find(
          (item) => item.product.id === product.id && item.size === size
        );
        if (existingItem) {
          return {
            cartItems: state.cartItems.map((item) =>
              item.product.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isCartOpen: true, // open cart automatically on add
          };
        }
        return { 
          cartItems: [...state.cartItems, { product, size, quantity: 1 }],
          isCartOpen: true 
        };
      });
      },

      removeFromCart: (productId, size) => set((state) => ({
        cartItems: state.cartItems.filter(
          (item) => !(item.product.id === productId && item.size === size)
        ),
      })),

      updateQuantity: (productId, size, quantity) => set((state) => ({
        cartItems: state.cartItems.map((item) => {
          if (item.product.id === productId && item.size === size) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        }),
      })),

      toggleCart: () => set((state) => {
        // Only one drawer should be open at a time
        return { 
          isCartOpen: !state.isCartOpen, 
          isFavoritesOpen: false 
        };
      }),

      setCartOpen: (isOpen) => set(() => ({ isCartOpen: isOpen })),

      triggerCartVibration: () => {
        set({ isCartVibrating: true });
        setTimeout(() => {
          set({ isCartVibrating: false });
        }, 1500);
      },

      toggleFavorite: (product) => set((state) => {
        const exists = state.favoriteItems.some((p) => p.id === product.id);
        if (exists) {
          return { favoriteItems: state.favoriteItems.filter((p) => p.id !== product.id) };
        }
        return { favoriteItems: [...state.favoriteItems, product] };
      }),

      toggleFavoritesDrawer: () => set((state) => {
        return { 
          isFavoritesOpen: !state.isFavoritesOpen, 
          isCartOpen: false 
        };
      }),

      setFavoritesOpen: (isOpen) => set(() => ({ isFavoritesOpen: isOpen })),
    }),
    {
      name: 'coritiba-premium-store',
      // We don't want to persist the 'isOpen' UI states
      partialize: (state) => ({
        cartItems: state.cartItems,
        favoriteItems: state.favoriteItems,
      }),
    }
  )
);

