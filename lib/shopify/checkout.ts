import { shopifyClient } from './client';

export interface CheckoutLineItemInput {
  variantId: string;
  quantity: number;
}

export interface CheckoutCreateResponse {
  checkoutCreate: {
    checkout: {
      id: string;
      webUrl: string;
    } | null;
    checkoutUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
}

export interface CheckoutUpdateResponse {
  checkoutLineItemsReplace: {
    checkout: {
      id: string;
      webUrl: string;
    };
    checkoutUserErrors: Array<{
      code: string;
      field: string[];
      message: string;
    }>;
  };
}

const CHECKOUT_CREATE_MUTATION = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CHECKOUT_UPDATE_MUTATION = `
  mutation checkoutLineItemsReplace($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

const GET_PRODUCT_VARIANT_QUERY = `
  query getProductVariant($handle: String!, $selectedOptions: [SelectedOptionInput!]) {
    product(handle: $handle) {
      variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

export class ShopifyCheckoutService {
  /**
   * Get variant ID for a product with specific options
   */
  async getVariantId(
    productHandle: string, 
    selectedOptions?: Array<{ name: string; value: string }>
  ): Promise<string | null> {
    try {
      const variables = {
        handle: productHandle,
        selectedOptions: selectedOptions || []
      };

      const data = await shopifyClient.requestGraphQL<{
        product: {
          variantBySelectedOptions: {
            id: string;
            availableForSale: boolean;
            price: { amount: string; currencyCode: string };
          } | null;
        } | null;
      }>(GET_PRODUCT_VARIANT_QUERY, variables);

      return data.product?.variantBySelectedOptions?.id || null;
    } catch (error) {
      console.error('Error fetching variant ID:', error);
      return null;
    }
  }

  /**
   * Create a new checkout with line items
   */
  async createCheckout(lineItems: CheckoutLineItemInput[]): Promise<string | null> {
    try {
      const variables = {
        input: {
          lineItems,
          allowPartialAddresses: true
        }
      };

      const data = await shopifyClient.requestGraphQL<CheckoutCreateResponse>(
        CHECKOUT_CREATE_MUTATION, 
        variables
      );

      if (data.checkoutCreate.checkoutUserErrors?.length > 0) {
        console.error('Checkout creation errors:', data.checkoutCreate.checkoutUserErrors);
        return null;
      }

      return data.checkoutCreate.checkout?.webUrl || null;
    } catch (error) {
      console.error('Error creating checkout:', error);
      return null;
    }
  }

  /**
   * Update an existing checkout with new line items
   */
  async updateCheckout(checkoutId: string, lineItems: CheckoutLineItemInput[]): Promise<string | null> {
    try {
      const variables = {
        checkoutId,
        lineItems
      };

      const data = await shopifyClient.requestGraphQL<CheckoutUpdateResponse>(
        CHECKOUT_UPDATE_MUTATION, 
        variables
      );

      if (data.checkoutLineItemsReplace.checkoutUserErrors?.length > 0) {
        console.error('Checkout update errors:', data.checkoutLineItemsReplace.checkoutUserErrors);
        return null;
      }

      return data.checkoutLineItemsReplace.checkout.webUrl;
    } catch (error) {
      console.error('Error updating checkout:', error);
      return null;
    }
  }

  /**
   * Convert cart items to Shopify line items
   * This is where we need to map your cart items to Shopify variant IDs
   */
  async prepareLineItems(cartItems: Array<{
    productHandle?: string;
    variant?: { id: string; name: string; color?: string; size?: string };
    quantity: number;
  }>): Promise<CheckoutLineItemInput[]> {
    const lineItems: CheckoutLineItemInput[] = [];

    for (const item of cartItems) {
      if (!item.productHandle) continue;

      // Build selected options from variant data
      const selectedOptions: Array<{ name: string; value: string }> = [];
      
      if (item.variant?.color) {
        selectedOptions.push({ name: 'Color', value: item.variant.color });
      }
      
      if (item.variant?.size) {
        selectedOptions.push({ name: 'Size', value: item.variant.size });
      }

      // Get the actual Shopify variant ID
      const variantId = await this.getVariantId(item.productHandle, selectedOptions);
      
      if (variantId) {
        lineItems.push({
          variantId: this.stripGidPrefix(variantId),
          quantity: item.quantity
        });
      } else {
        console.warn(`Could not find variant for product: ${item.productHandle}`);
      }
    }

    return lineItems;
  }

  /**
   * Strip the 'gid://shopify/ProductVariant/' prefix from variant IDs
   */
  private stripGidPrefix(gid: string): string {
    return gid.replace('gid://shopify/ProductVariant/', '');
  }

  /**
   * Main method to initiate checkout
   * Takes your cart items and redirects to Shopify checkout
   */
  async initiateCheckout(
    cartItems: Array<{
      productHandle?: string;
      variant?: { id: string; name: string; color?: string; size?: string };
      quantity: number;
    }>,
    existingCheckoutId?: string
  ): Promise<string | null> {
    try {
      // Prepare line items for Shopify
      const lineItems = await this.prepareLineItems(cartItems);
      
      if (lineItems.length === 0) {
        console.error('No valid line items to checkout');
        return null;
      }

      // Either update existing checkout or create new one
      let checkoutUrl: string | null;
      
      if (existingCheckoutId) {
        checkoutUrl = await this.updateCheckout(existingCheckoutId, lineItems);
      } else {
        checkoutUrl = await this.createCheckout(lineItems);
      }

      return checkoutUrl;
    } catch (error) {
      console.error('Error initiating checkout:', error);
      return null;
    }
  }
}

// Singleton instance
export const shopifyCheckoutService = new ShopifyCheckoutService();