export const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int = 50, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          id
          title
          description
          handle
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          tags
          totalInventory
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          # ✅ ADDED: Essential metafields for product listings
          metafields(identifiers: [
            {namespace: "custom", key: "category"},
            {namespace: "custom", key: "rating"}
          ]) {
            value
            key
            namespace
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      tags
      totalInventory
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            title
            handle
          }
        }
      }
      # ✅ UPDATED: Added category metafield and namespace field
      metafields(identifiers: [
        {namespace: "custom", key: "category"},
        {namespace: "custom", key: "rating"},
        {namespace: "custom", key: "review_count"},
        {namespace: "custom", key: "features"},
        {namespace: "custom", key: "specifications"}
      ]) {
        value
        key
        namespace  # ✅ ADDED: Required for transformer to work
      }
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int = 10) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 5) {
            edges {
              node {
                id
                title
                featuredImage {
                  url
                }
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;