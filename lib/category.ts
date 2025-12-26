import { Product } from './products';
// Helper hooks for React components (optional)
import { useState, useEffect } from 'react';

export interface CategoryData {
  name: string;
  count: number;
  value: string;
}

export interface TagData {
  name: string;
  count: number;
  value: string;
}

class CategoryStore {
  private categories: CategoryData[] = [];
  private tags: TagData[] = [];

  // Get current categories
  getCategories(): CategoryData[] {
    return [...this.categories]; // Return copy
  }

  // Get current tags
  getTags(): TagData[] {
    return [...this.tags]; // Return copy
  }

  // Check if categories are loaded
  hasCategories(): boolean {
    return this.categories.length > 0;
  }

  // Extract and update categories/tags from products
  updateFromProducts(products: Product[]): void {
    try {
      const categoryMap = new Map<string, number>();
      const tagMap = new Map<string, number>();
      
      // Process all products
      products.forEach(product => {
        // Process category
        if (product.category && product.category !== 'Uncategorized') {
          const currentCount = categoryMap.get(product.category) || 0;
          categoryMap.set(product.category, currentCount + 1);
        }
        
        // Process tags
        product.tags?.forEach(tag => {
          const cleanTag = tag.trim().toLowerCase();
          if (cleanTag) {
            const currentCount = tagMap.get(cleanTag) || 0;
            tagMap.set(cleanTag, currentCount + 1);
          }
        });
      });
      
      // Convert categories to sorted array
      this.categories = Array.from(categoryMap.entries())
        .map(([name, count]) => ({
          name,
          count,
          value: name.toLowerCase().replace(/\s+/g, '-')
        }))
        .sort((a, b) => {
          // Sort by count (desc), then name (asc)
          if (b.count !== a.count) return b.count - a.count;
          return a.name.localeCompare(b.name);
        });
      
      // Convert tags to sorted array (limit to top 20)
      this.tags = Array.from(tagMap.entries())
        .map(([name, count]) => ({
          name: this.formatTagName(name),
          count,
          value: name.toLowerCase()
        }))
        .sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return a.name.localeCompare(b.name);
        })
        .slice(0, 20); // Top 20 tags
      
      console.log('Categories updated:', {
        categories: this.categories.length,
        tags: this.tags.length
      });
      
    } catch (error) {
      console.error('Error updating categories from products:', error);
    }
  }

  // Helper to format tag names (e.g., "best-seller" → "Best Seller")
  private formatTagName(tag: string): string {
    return tag
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  }

  // Clear all data (useful for testing/reset)
  clear(): void {
    this.categories = [];
    this.tags = [];
  }
}

// Singleton instance - shared across the app
export const categoryStore = new CategoryStore();


// Simple hook for components that need reactive categories
export function useCategories() {
  const [categories, setCategories] = useState(categoryStore.getCategories());
  const [tags, setTags] = useState(categoryStore.getTags());

  useEffect(() => {
    // Poll for updates (simple approach, no complex event system needed)
    const interval = setInterval(() => {
      const newCategories = categoryStore.getCategories();
      const newTags = categoryStore.getTags();
      
      // Only update if changed
      if (JSON.stringify(newCategories) !== JSON.stringify(categories)) {
        setCategories(newCategories);
      }
      if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
        setTags(newTags);
      }
    }, 5000); // Check every second

    return () => clearInterval(interval);
  }, [categories, tags]);

  return { categories, tags, hasCategories: categoryStore.hasCategories() };
}