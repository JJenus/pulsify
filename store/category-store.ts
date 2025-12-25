import { create } from 'zustand';
import { shopifyClient } from '@/lib/shopify/client';

interface Category {
  id: string;
  name: string;
  handle: string;
  productCount: number;
}

export interface TagData {
  id: string;
  name: string;
  count: number;
  value: string;
}

interface CategoryStore {
  categories: Category[];
  tags: TagData[]
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  hasCategories: () => boolean;
  clearCategories: () => void;
}

// Static fallback
const STATIC_CATEGORIES: Category[] = [
  { id: '1', name: 'Clothing', handle: 'clothing', productCount: 12 },
  { id: '2', name: 'Electronics', handle: 'electronics', productCount: 8 },
  { id: '3', name: 'Accessories', handle: 'accessories', productCount: 15 },
  { id: '4', name: 'Home Goods', handle: 'home-goods', productCount: 6 },
];

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  tags: [], 
  isLoading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch from Shopify Collections
      const collections = await shopifyClient.getCollections(20);
      
      // Transform to our Category type
      const shopifyCategories = collections.map(collection => ({
        id: collection.id,
        name: collection.title,
        handle: collection.handle,
        productCount: collection.products?.edges?.length || 0,
      }));
      
      // Use Shopify data if available, otherwise fallback
      set({ 
        categories: shopifyCategories.length > 0 ? shopifyCategories : STATIC_CATEGORIES,
        isLoading: false 
      });
      
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ 
        categories: STATIC_CATEGORIES, // Fallback
        error: error instanceof Error ? error.message : 'Failed to load categories',
        isLoading: false 
      });
    }
  },
  
  hasCategories: () => {
    return get().categories.length > 0;
  },
  
  clearCategories: () => set({ categories: [], error: null }),
}));