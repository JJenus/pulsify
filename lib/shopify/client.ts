import { createStorefrontApiClient, StorefrontApiClient } from '@shopify/storefront-api-client';
import { shopifyConfig } from './config';
import { 
  GET_PRODUCTS_QUERY, 
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY 
} from './queries';
import { 
  transformShopifyProduct, 
  transformShopifyProducts, 
  type ShopifyProduct 
} from './transformers';

// Types for GraphQL responses
interface ProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

interface ProductResponse {
  product: ShopifyProduct | null;
}

interface CollectionsResponse {
  collections: {
    edges: Array<{ node: any }>;
  };
}

export class ShopifyClient {
  private client?: StorefrontApiClient; // Optional: only for real stores
  private isMock: boolean;

  constructor() {
    // Normalize domain for detection (mock.shop is https://mock.shop)
    this.isMock = shopifyConfig.storeDomain.includes('mock.shop');

    if (!this.isMock && shopifyConfig.storefrontToken) {
      // Initialize official client only for real stores with a token
      this.client = createStorefrontApiClient({
        storeDomain: shopifyConfig.storeDomain,
        apiVersion: shopifyConfig.apiVersion,
        publicAccessToken: shopifyConfig.storefrontToken, // Or privateAccessToken if server-side
      });
    } else if (this.isMock) {
      console.log('🟢 Using mock.shop (no token required)');
    } else {
      console.warn('⚠️ No storefront token provided for real store – some queries may fail');
    }
  }

  /**
   * Generic GraphQL request method
   */
  async requestGraphQL<T = any>(
    query: string, 
    variables?: Record<string, any>
  ): Promise<T> {
    const endpoint = `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;

    try {
      if (!this.isMock && this.client) {
        // Use official client for real stores
        const { data, errors } = await this.client.request(query, {
          variables: variables || {}
        });

        if (errors && errors.length > 0) {
          console.error('GraphQL Errors:', errors);
          const errorMessage = errors.map(e => e.message).join(', ');
          throw new Error(`GraphQL query failed: ${errorMessage}`);
        }

        if (!data) {
          throw new Error('No data returned from Shopify API');
        }

        return data;
      }

      // For mock.shop (or fallback): Use plain fetch – no token header
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Intentionally NO X-Shopify-Storefront-Access-Token header for mock.shop
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} – ${text}`);
      }

      const { data, errors } = await response.json();

      if (errors && errors.length > 0) {
        console.error('GraphQL Errors:', errors);
        const errorMessage = errors.map(e => e.message).join(', ');
        throw new Error(`GraphQL query failed: ${errorMessage}`);
      }

      if (!data) {
        throw new Error('No data returned from API');
      }

      return data;
    } catch (error) {
      console.error('Shopify API request error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error: Could not connect to Shopify. Check your store domain and internet connection.');
        }
        if (error.message.includes('401') || error.message.includes('403')) {
          throw new Error('Authentication error: Invalid or missing storefront access token.');
        }
      }
      
      throw error;
    }
  }

  // Your existing methods remain unchanged
  async getProducts(options?: {
    first?: number;
    query?: string;
    sortKey?: string;
    reverse?: boolean;
  }): Promise<ShopifyProduct[]> {
    const variables = {
      first: options?.first || 50,
      query: options?.query || null,
      sortKey: options?.sortKey || 'BEST_SELLING',
      reverse: options?.reverse || false
    };

    const data = await this.requestGraphQL<ProductsResponse>(
      GET_PRODUCTS_QUERY, 
      variables
    );

    return data.products.edges.map(edge => edge.node);
  }

  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const data = await this.requestGraphQL<ProductResponse>(
      GET_PRODUCT_BY_HANDLE_QUERY, 
      { handle }
    );

    return data.product;
  }

  async getCollections(first: number = 10) {
    const data = await this.requestGraphQL<CollectionsResponse>(
      GET_COLLECTIONS_QUERY, 
      { first }
    );

    return data.collections.edges.map(edge => edge.node);
  }

  async getTransformedProducts(options?: {
    first?: number;
    query?: string;
    sortKey?: string;
    reverse?: boolean;
  }) {
    const shopifyProducts = await this.getProducts(options);
    return transformShopifyProducts(shopifyProducts);
  }

  async getTransformedProductByHandle(handle: string) {
    const shopifyProduct = await this.getProductByHandle(handle);
    return shopifyProduct ? transformShopifyProduct(shopifyProduct) : null;
  }

  /**
   * Check connection to Shopify API
   */
  async testConnection(): Promise<boolean> {
    try {
      const testQuery = `query TestConnection { shop { name } }`;
      const result = await this.requestGraphQL<{ shop: { name: string } }>(testQuery);
      console.log(`✅ Connected to store: ${result.shop.name}`);
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const shopifyClient = new ShopifyClient();

// Optional: Test connection on startup (development only)
if (process.env.NODE_ENV === 'development') {
  shopifyClient.testConnection().catch(console.error);
}