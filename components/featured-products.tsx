"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { demoProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = `/products/${product.id}`}
        >
          View Details
        </Button>
      ),
    });
  };

  const categories = ["all", "clothing", "electronics", "accessories", "home"];

  // Filter products based on active category
  const filteredProducts = activeCategory === "all" 
    ? demoProducts 
    : demoProducts.filter(product => 
        product.category.toLowerCase().includes(activeCategory.toLowerCase())
      );

  return (
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
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 md:flex">
                {categories.slice(0, 3).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    onClick={() => setActiveCategory(category)}
                    className="capitalize"
                  >
                    {category === "all" ? "All" : category}
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
        
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
  );
}
