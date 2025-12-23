"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Plus, Minus, Truck, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export function CartDrawer() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "1", name: "Premium Cotton T-Shirt", price: 29.99, quantity: 2, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop", category: "Clothing" },
    { id: "2", name: "Designer Denim Jeans", price: 89.99, quantity: 1, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&auto=format&fit=crop", category: "Clothing" },
    { id: "3", name: "Wireless Headphones", price: 199.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop", category: "Electronics" },
    { id: "4", name: "Leather Backpack", price: 129.99, quantity: 1, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop", category: "Accessories" },
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = total >= 50 ? 0 : 4.99;
  const tax = total * 0.08;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <div className="mx-auto w-full max-w-2xl flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-center justify-between px-6 py-4 border-b shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <div>
                <DrawerTitle className="text-xl">Your Cart</DrawerTitle>
                <p className="text-sm text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </DrawerHeader>
          
          {/* Cart Items with proper scrolling */}
          <div className="flex-1 overflow-hidden min-h-0">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold">Your cart is empty</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Add some items to get started
                </p>
                <Button asChild>
                  <a href="/products">Browse Products</a>
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-full px-6">
                <div className="py-6 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Badge variant="outline" className="mb-1 text-xs">
                              {item.category}
                            </Badge>
                            <h4 className="truncate font-medium">{item.name}</h4>
                            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-red-500"
                            onClick={() => removeItem(item.id)}
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
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
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
              </ScrollArea>
            )}
          </div>
          
          {/* Summary - Fixed at bottom */}
          {cartItems.length > 0 && (
            <div className="border-t bg-background/95 backdrop-blur shrink-0">
              <div className="p-6">
                <div className="mb-6 space-y-3">
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
                    <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3 text-center text-sm">
                      <p className="font-medium text-green-700">
                        Add <span className="font-bold">${(50 - total).toFixed(2)}</span> more for free shipping!
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-3">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/products">Continue Shopping</a>
                  </Button>
                </div>
                
                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium">Free Shipping</p>
                      <p className="text-xs text-muted-foreground">Over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium">Secure Checkout</p>
                      <p className="text-xs text-muted-foreground">256-bit SSL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}