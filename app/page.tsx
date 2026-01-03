"use client";

import { useState } from "react";
import { HeroCarousel } from "@/components/hero-carousel";
import { FeaturedProducts } from "@/components/featured-products";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Truck, CreditCard, Headphones } from "lucide-react";
import { Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { useCartStore, createCartItem } from "@/store/cart-store";

export default function Home() {
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleAddToCart = (product: Product) => {
    const cartItem = createCartItem(product);
    addItem(cartItem);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroCarousel />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hidden">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Truck className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On all orders over $50
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Shield className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                100% secure transactions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <CreditCard className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Headphones className="mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated customer service
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <FeaturedProducts />

      {/* Newsletter Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
          <p className="mb-8 text-muted-foreground">
            Subscribe to our newsletter for the latest updates and exclusive offers
          </p>
          <div className="mx-auto flex max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}