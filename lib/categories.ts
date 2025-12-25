import { Product } from './products';
import { shopifyClient } from '@/lib/shopify/client';
import { useState, useEffect, useCallback } from 'react';

// ==================== TYPES ====================
export interface CategoryData {
  name: string;
  count: number;
  value: string; // Shopify collection handle
}

export interface TagData {
  name: string;
  count: number;
  value: string; // Lowercase tag
}

// ==================== STATIC FALLBACKS ====================
const STATIC_CATEGORIES: CategoryData[] = [
  { name: 'Clothing', count: 12, value: 'clothing' },
  { name: 'Electronics', count: 8, value: 'electronics' },
  { name: 'Accessories', count: 15, value: 'accessories' },
  { name: 'Home Goods', count: 6, value: 'home-goods' },
  { name: 'Sale', count: 25, value: 'sale' },
  { name: 'New Arrivals', count: 10, value: 'new-arrivals' },
];

const STATIC_TAGS: TagData[] = [
  { name: 'Best Seller', count: 18, value: 'best-seller' },
  { name: 'New Arrival', count: 12, value: 'new' },
  { name: 'On Sale', count: 25, value: 'sale' },
  { name: 'Eco Friendly', count: 8, value: 'eco-friendly' },
  { name: 'Premium', count: 15, value: 'premium' },
  { name: 'Limited Edition', count: 5, value: 'limited-edition' },
];

// ==================== STORE CLASS ====================
class CategoryStore {
  // State
  private categories: CategoryData[] = [];
  private tags: TagData[] = [];
  private isLoading: boolean = false;
  private error: string | null = null;
  
  // Cache
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private fetchPromise: Promise<void> | null = null;

  // Public Getters
  getCategories(): CategoryData[] {
    return [...this.categories];
  }

  getTags(): TagData[] {
    return [...this.tags];
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  getError(): string | null {
    return this.error;
  }

  hasCategories(): boolean {
    return this.categories.length > 0;
  }

  // Main Method: Fetch categories from Shopify with cache
  async fetchCategories(): Promise<void> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.hasCategories() && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      console.log('📦 Using cached categories');
      return;
    }

    // Prevent duplicate concurrent requests
    if (this.fetchPromise) {
      await this.fetchPromise;
      return;
    }

    // Create fetch promise
    this.fetchPromise = this._fetchCategories();
    await this.fetchPromise;
    this.fetchPromise = null;
  }

  // Private: Actual Shopify fetch logic
  private async _fetchCategories(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      console.log('🛍️ Fetching categories from Shopify...');
      
      // 1. Fetch collections from Shopify
      const collections = await shopifyClient.getCollections(20);
      
      // 2. Transform collections to categories
      const shopifyCategories: CategoryData[] = collections.map(collection => ({
        name: collection.title,
        count: collection.products?.edges?.length || 0,
        value: collection.handle
      }));

      // 3. Fetch products for tags extraction
      const products = await shopifyClient.getTransformedProducts({ first: 50 });
      const shopifyTags = this.extractTagsFromProducts(products);

      // 4. Update store state
      this.categories = shopifyCategories.length > 0 
        ? shopifyCategories 
        : STATIC_CATEGORIES;
      
      this.tags = shopifyTags.length > 0 
        ? shopifyTags 
        : STATIC_TAGS;

      this.lastFetchTime = Date.now();
      
      console.log('✅ Categories fetched successfully:', {
        categories: this.categories.length,
        tags: this.tags.length
      });

    } catch (error) {
      console.error('❌ Failed to fetch categories from Shopify:', error);
      
      // Use fallback data
      this.categories = STATIC_CATEGORIES;
      this.tags = STATIC_TAGS;
      this.error = error instanceof Error ? error.message : 'Unknown error';
      
    } finally {
      this.isLoading = false;
    }
  }

  // Extract tags from products (optional - for filter tags)
  private extractTagsFromProducts(products: Product[]): TagData[] {
    const tagMap = new Map<string, number>();
    
    products.forEach(product => {
      product.tags?.forEach(tag => {
        const cleanTag = tag.trim().toLowerCase();
        if (cleanTag) {
          const currentCount = tagMap.get(cleanTag) || 0;
          tagMap.set(cleanTag, currentCount + 1);
        }
      });
    });
    
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({
        name: this.formatTagName(name),
        count,
        value: name
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 tags
  }

  private formatTagName(tag: string): string {
    return tag
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  // Manually update from products (for product page)
  updateFromProducts(products: Product[]): void {
    if (!this.hasCategories()) {
      this.categories = this.extractCategoriesFromProducts(products);
    }
    
    // Always update tags from latest products
    this.tags = this.extractTagsFromProducts(products);
  }

  private extractCategoriesFromProducts(products: Product[]): CategoryData[] {
    const categoryMap = new Map<string, number>();
    
    products.forEach(product => {
      if (product.category && product.category !== 'Uncategorized') {
        const currentCount = categoryMap.get(product.category) || 0;
        categoryMap.set(product.category, currentCount + 1);
      }
    });
    
    const categories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        value: name.toLowerCase().replace(/\s+/g, '-')
      }))
      .sort((a, b) => b.count - a.count);
    
    return categories.length > 0 ? categories : STATIC_CATEGORIES;
  }

  // Clear cache (for testing or logout)
  clearCache(): void {
    this.categories = [];
    this.tags = [];
    this.lastFetchTime = 0;
    this.error = null;
  }
}

// ==================== SINGLETON INSTANCE ====================
export const categoryStore = new CategoryStore();

// ==================== REACT HOOK ====================
export function useCategories() {
  const [categories, setCategories] = useState<CategoryData[]>(categoryStore.getCategories());
  const [tags, setTags] = useState<TagData[]>(categoryStore.getTags());
  const [isLoading, setIsLoading] = useState(categoryStore.getIsLoading());
  const [error, setError] = useState<string | null>(categoryStore.getError());

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await categoryStore.fetchCategories();
      setCategories(categoryStore.getCategories());
      setTags(categoryStore.getTags());
      setError(categoryStore.getError());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!categoryStore.hasCategories()) {
      refresh();
    }
  }, [refresh]);

  // Subscribe to store changes (no polling!)
  useEffect(() => {
    const checkForUpdates = () => {
      const newCategories = categoryStore.getCategories();
      const newTags = categoryStore.getTags();
      const newIsLoading = categoryStore.getIsLoading();
      const newError = categoryStore.getError();

      if (JSON.stringify(newCategories) !== JSON.stringify(categories)) {
        setCategories(newCategories);
      }
      if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
        setTags(newTags);
      }
      if (newIsLoading !== isLoading) {
        setIsLoading(newIsLoading);
      }
      if (newError !== error) {
        setError(newError);
      }
    };

    // Check every 500ms (not polling Shopify, just checking local state)
    const interval = setInterval(checkForUpdates, 500);
    return () => clearInterval(interval);
  }, [categories, tags, isLoading, error]);

  return {
    categories,
    tags,
    isLoading,
    error,
    refresh,
    hasCategories: categoryStore.hasCategories(),
  };
}