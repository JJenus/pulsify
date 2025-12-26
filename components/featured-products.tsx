"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { shopifyClient } from "@/lib/shopify/client";
import { Product } from "@/lib/products";
import { useCategoryStore } from "@/store/category-store";
import { useCartStore, createCartItem } from "@/store/cart-store";
import { QuickViewModal } from "@/components/quick-view-modal";

export function FeaturedProducts() {
  const { toast } = useToast();
  const { categories } = useCategoryStore();
  const { addItem } = useCartStore();
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fetch featured products from Shopify
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const shopifyProducts = await shopifyClient.getTransformedProducts({
        first: 12,
        sortKey: 'BEST_SELLING',
      });
      setProducts(shopifyProducts);
     
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast({
        title: "Error",
        description: "Failed to load featured products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = createCartItem(product);
    addItem(cartItem);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = "/cart"}
        >
          View Cart
        </Button>
      ),
    });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  // Get top 3 categories for tabs
  const topCategories = categories.slice(0, 3);
  const categoryTabs = [
    { value: "all", label: "All" },
    ...topCategories.map(cat => ({
      value: cat.value,
      label: cat.name
    }))
  ];

  // Filter products based on active category
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => 
        product.category.toLowerCase().includes(activeCategory.toLowerCase())
      );

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Featured Products</h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Discover our most popular items
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Tabs value={activeCategory} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-2 md:flex">
                  {categoryTabs.map((category) => (
                    <TabsTrigger
                      key={category.value}
                      value={category.value}
                      onClick={() => setActiveCategory(category.value)}
                      className="capitalize"
                    >
                      {category.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No featured products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onQuickView={() => handleQuickView(product)}
                />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Browse All Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}