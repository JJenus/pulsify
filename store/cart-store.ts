import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/lib/products';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  variant?: {
    id: string;
    name: string;
    color?: string;
    size?: string;
  };
  productHandle?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getItem: (id: string) => CartItem | undefined;
  isInCart: (productId: string, variantId?: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: CartItem) => {
        const { items } = get();
        const existingItem = items.find(i => 
          i.id === item.id && i.variant?.id === item.variant?.id
        );
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(i =>
              i.id === existingItem.id && i.variant?.id === existingItem.variant?.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Add new item
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (id: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },
      
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      
      getItem: (id: string) => {
        return get().items.find(item => item.id === id);
      },
      
      isInCart: (productId: string, variantId?: string) => {
        return get().items.some(item => 
          item.productId === productId && 
          (!variantId || item.variant?.id === variantId)
        );
      },
    }),
    {
      name: 'cart-storage',
      // Optionally, you can serialize only specific parts of the state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Helper function to create cart item from product
export const createCartItem = (
  product: Product, 
  variant?: ProductVariant, 
  quantity: number = 1
): CartItem => {
  return {
    id: variant ? `${product.id}-${variant.id}` : product.id,
    productId: product.id,
    name: variant ? `${product.name} - ${variant.name}` : product.name,
    price: variant?.price || product.price,
    quantity,
    image: product.images[0],
    category: product.category,
    variant: variant ? {
      id: variant.id,
      name: variant.name,
      color: variant.color,
      size: variant.size,
    } : undefined,
    productHandle: product.handle,
  };
}; 