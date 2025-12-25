// Create a test file: app/test-shopify/page.tsx
"use client";
import { useEffect } from "react";
import { shopifyClient } from "@/lib/shopify/client";

export default function TestPage() {
  useEffect(() => {
    async function test() {
      try {
        const products = await shopifyClient.getTransformedProducts({ first: 3 });
        console.log("✅ Shopify products:", products);
        
        if (products[0]) {
          const single = await shopifyClient.getTransformedProductByHandle(products[0].handle || '');
          console.log("✅ Single product:", single);
        }
      } catch (error) {
        console.error("❌ Shopify error:", error);
      }
    }
    test();
  }, []);

  return <div>Check console for Shopify test results</div>;
}