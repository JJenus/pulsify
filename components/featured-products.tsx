"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { demoProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export function FeaturedProducts() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");

  const handleAddToCart = (product: any) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleQuickView = (product: any) => {
    toast({
      title: "Quick View",
      description: `Viewing ${product.name}`,
    });
  };

  const categories = ["all", "clothing", "electronics", "accessories"];

  // Filter products based on active category
  const filteredProducts = activeCategory === "all" 
    ? demoProducts 
    : demoProducts.filter(product => 
        product.category.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">
              Discover our most popular items
            </p>
          </div>
          
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
