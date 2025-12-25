// lib/shopify/transformers.ts
import { Product, ProductVariant } from '@/lib/products';

// Define the extended ShopifyProduct interface with metafields
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
    };
  };
  tags: string[];
  totalInventory: number;
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  collections?: {
    edges: Array<{
      node: {
        title: string;
        handle: string;
      };
    }>;
  };
  metafields?: Array<{
    value: string;
    key: string;
    namespace: string;
  }>;
}

/**
 * Safely extracts and parses a metafield value
 */
function getMetafieldValue<T = any>(
  metafields: Array<{ value: string; key: string; namespace: string }> | undefined,
  namespace: string,
  key: string,
  fallback: T,
  parser?: (value: string) => T
): T {
  try {
    const meta = metafields?.find(
      m => m.namespace === namespace && m.key === key
    );
    
    if (!meta?.value) return fallback;
    
    return parser ? parser(meta.value) : meta.value as unknown as T;
  } catch (error) {
    console.warn(`Error parsing metafield ${namespace}.${key}:`, error);
    return fallback;
  }
}

/**
 * Helper to parse JSON metafields with validation
 */
function parseJSON<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Invalid JSON in metafield:', jsonString);
    return fallback;
  }
}

/**
 * Safely parse numeric values from metafields
 */
function parseNumber(value: string, fallback: number): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Helper to get a clean category from various sources
 */
function determineCategory(
  shopifyProduct: ShopifyProduct,
  categoryFromMeta: string | null
): string {
  // Priority 1: Category from metafield (highest priority)
  if (categoryFromMeta && categoryFromMeta.trim()) {
    return categoryFromMeta.trim();
  }
  
  // Priority 2: First collection title
  const firstCollection = shopifyProduct.collections?.edges[0]?.node.title;
  if (firstCollection && firstCollection.trim()) {
    return firstCollection.trim();
  }
  
  // Priority 3: First tag (excluding system tags)
  const systemTags = ['gid://', '__', 'admin'];
  const validTag = shopifyProduct.tags.find(tag => 
    tag.trim() && !systemTags.some(sysTag => tag.includes(sysTag))
  );
  if (validTag) {
    return validTag.trim();
  }
  
  // Priority 4: Fallback
  return 'Uncategorized';
}

/**
 * Helper to transform variants with error handling
 */
function transformVariants(
  shopifyVariants: ShopifyProduct['variants'],
  baseId: string
): ProductVariant[] | undefined {
  try {
    const variants = shopifyVariants.edges.map(({ node }) => {
      const sizeOption = node.selectedOptions?.find(opt => 
        opt.name.toLowerCase().includes('size')
      );
      const colorOption = node.selectedOptions?.find(opt => 
        opt.name.toLowerCase().includes('color')
      );

      return {
        id: node.id.split('/').pop() || `${baseId}-${node.title}`.replace(/\s+/g, '-'),
        name: node.title,
        price: parseFloat(node.price.amount),
        size: sizeOption?.value,
        color: colorOption?.value,
        inStock: node.availableForSale,
        originalPrice: node.compareAtPrice?.amount 
          ? parseFloat(node.compareAtPrice.amount)
          : undefined,
      };
    });

    // Only return if we have meaningful variants (more than 1, or 1 with actual options)
    const hasMeaningfulVariants = variants.length > 1 || 
      (variants.length === 1 && (variants[0].size || variants[0].color));
    
    return hasMeaningfulVariants ? variants : undefined;
  } catch (error) {
    console.warn('Error transforming variants:', error);
    return undefined;
  }
}

/**
 * Helper to extract all product images
 */
function extractImages(shopifyProduct: ShopifyProduct): string[] {
  const images = new Set<string>();
  
  // Add featured image first
  if (shopifyProduct.featuredImage?.url) {
    images.add(shopifyProduct.featuredImage.url);
  }
  
  // Add other images
  shopifyProduct.images.edges.forEach(edge => {
    if (edge.node.url) {
      images.add(edge.node.url);
    }
  });
  
  return Array.from(images);
}

/**
 * Helper to calculate price information
 */
function calculatePrices(shopifyProduct: ShopifyProduct): {
  price: number;
  originalPrice?: number;
} {
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  
  let originalPrice: number | undefined;
  if (shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount) {
    const comparePrice = parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount);
    if (comparePrice > price) {
      originalPrice = comparePrice;
    }
  }
  
  return { price, originalPrice };
}

/**
 * Main transformer function - converts ShopifyProduct to your Product type
 */
export function transformShopifyProduct(shopifyProduct: ShopifyProduct): Product {
  const baseId = shopifyProduct.id.split('/').pop() || shopifyProduct.handle;
  
  // Extract metafield values with fallbacks
  const categoryMeta = getMetafieldValue<string | null>(
    shopifyProduct.metafields, 'custom', 'category', null
  );
  
  const features = getMetafieldValue<string[]>(
    shopifyProduct.metafields, 'custom', 'features',
    ['Premium Quality', 'Ships Worldwide', 'Customer Favorite'],
    (value) => parseJSON(value, ['Premium Quality', 'Ships Worldwide', 'Customer Favorite'])
  );
  
  const specifications = getMetafieldValue<Record<string, string>>(
    shopifyProduct.metafields, 'custom', 'specifications',
    { Material: 'High Quality', Origin: 'Imported' },
    (value) => parseJSON(value, { Material: 'High Quality', Origin: 'Imported' })
  );
  
  const rating = getMetafieldValue<number>(
    shopifyProduct.metafields, 'custom', 'rating',
    4.0 + Math.random() * 1.5,
    (value) => parseNumber(value, 4.0 + Math.random() * 1.5)
  );
  
  const reviewCount = getMetafieldValue<number>(
    shopifyProduct.metafields, 'custom', 'review_count',
    Math.floor(Math.random() * 200) + 50,
    (value) => Math.floor(parseNumber(value, Math.floor(Math.random() * 200) + 50))
  );
  
  // Determine category using your metafield-first strategy
  const category = determineCategory(shopifyProduct, categoryMeta);
  
  // Transform other data
  const variants = transformVariants(shopifyProduct.variants, baseId);
  const images = extractImages(shopifyProduct);
  const { price, originalPrice } = calculatePrices(shopifyProduct);
  
  // Calculate stock status (consider variants if they exist)
  let inStock = shopifyProduct.totalInventory > 0;
  if (variants && variants.length > 0) {
    inStock = variants.some(v => v.inStock);
  }
  
  // Return the final transformed product
  return {
    id: baseId,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    price,
    originalPrice,
    images,
    category,
    tags: shopifyProduct.tags,
    inStock,
    rating: Math.min(5, Math.max(1, rating)), // Clamp between 1-5
    reviewCount: Math.max(1, reviewCount), // Ensure non-negative
    features,
    variants,
    specifications,
    currencyCode: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    handle: shopifyProduct.handle,
  };
}

/**
 * Batch transform multiple Shopify products
 */
export function transformShopifyProducts(shopifyProducts: ShopifyProduct[]): Product[] {
  return shopifyProducts.map(transformShopifyProduct);
}