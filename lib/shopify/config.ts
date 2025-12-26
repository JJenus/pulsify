// Update the apiVersion in your config
export const shopifyConfig = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_MOCK_STORE_DOMAIN!,
  storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
  apiVersion: '2025-10', // Changed from '2024-01'
  locale: 'en-US',
};

console.log("Domain: "+ shopifyConfig.storeDomain, "Key: "+shopifyConfig.storefrontToken)

const isValidKey = shopifyConfig.storeDomain.includes('mock') || shopifyConfig.storefrontToken

if (!shopifyConfig.storeDomain || !isValidKey) {
  throw new Error('Shopify credentials are missing. Check your environment variables.');
}

export const shopifyHeaders = {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontToken,
};