"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  ArrowLeft,
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { toast } = useToast();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getItemCount, 
    getTotalPrice 
  } = useCartStore();
  
  const itemCount = getItemCount();
  const total = getTotalPrice();
  const shippingCost = total >= 50 ? 0 : 4.99;
  const tax = total * 0.08;

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity < 1) {
        removeItem(id);
        toast({
          title: "Removed from cart",
          description: `${item.name} has been removed from your cart`,
        });
      } else {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      removeItem(id);
      toast({
        title: "Removed from cart",
        description: `${item.name} has been removed from your cart`,
      });
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Products
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
        <p className="text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                  <Link 
                    href={`/products/${item.productHandle || item.productId}`}
                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Badge variant="outline" className="mb-1 text-xs">
                          {item.category}
                        </Badge>
                        <Link 
                          href={`/products/${item.productHandle || item.productId}`}
                          className="block"
                        >
                          <h4 className="truncate font-medium hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                        </Link>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            {item.variant.size && `Size: ${item.variant.size}`}
                            {item.variant.color && `${item.variant.size ? ', ' : ''}Color: ${item.variant.color}`}
                          </p>
                        )}
                        <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${(total + shippingCost + tax).toFixed(2)}</span>
              </div>
              
              {total < 50 && (
                <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center">
                  <p className="font-medium text-green-700">
                    Add <span className="font-bold">${(50 - total).toFixed(2)}</span> more for free shipping!
                  </p>
                </div>
              )}
            </div>
            
            <Button className="w-full" size="lg">
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
            
            {/* Trust Badges */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Secure Checkout</p>
                  <p className="text-sm text-muted-foreground">256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}