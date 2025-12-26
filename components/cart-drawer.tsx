"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Plus, Minus, Truck, Shield, ArrowRight, ChevronUp, ChevronDown, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

export function CartDrawer() {
  const { toast } = useToast();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getItemCount, 
    getTotalPrice 
  } = useCartStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const itemCount = getItemCount();
  const total = getTotalPrice();
  const shippingCost = total >= 50 ? 0 : 4.99;
  const tax = total * 0.08;
  const finalTotal = total + shippingCost + tax;

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

  const handleProceedToCheckout = () => {
    toast({
      title: "Proceeding to checkout",
      description: "Redirecting to checkout...",
    });
    setIsOpen(false);
  };

  const CartContent = () => (
    <div className="flex flex-col h-full">
      <DrawerHeader className="flex flex-row items-center justify-between px-4 sm:px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-6 w-6" />
          <div>
            <DrawerTitle className="text-xl">Your Cart</DrawerTitle>
            <p className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
          {!isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </DrawerHeader>
      
      {/* Cart Items with proper scrolling */}
      <div className="flex-1 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Your cart is empty</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Add some items to get started
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="px-4 sm:px-6">
              <div className="py-4 sm:py-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                    <Link 
                      href={`/products/${item.productHandle || item.productId}`}
                      className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
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
                            onClick={() => setIsOpen(false)}
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
          </ScrollArea>
        )}
      </div>
      
      {/* Summary - Collapsible on BOTH mobile and desktop */}
      {items.length > 0 && (
        <div className="border-t bg-background shrink-0">
          {/* Collapsible Summary */}
          <Collapsible open={isSummaryExpanded} onOpenChange={setIsSummaryExpanded}>
            <div className="px-4 py-3 md:px-6 md:py-4">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-auto py-2 hover:bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-left">
                      <div className="font-medium text-base md:text-lg">
                        Total: ${finalTotal.toFixed(2)}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} • {shippingCost === 0 ? 'Free shipping' : '+ $4.99 shipping'}
                      </div>
                    </div>
                  </div>
                  {isSummaryExpanded ? (
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <ChevronUp className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="px-4 pb-4 md:px-6 md:pb-6 border-t">
                <div className="pt-4 space-y-3 md:space-y-4">
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm md:text-base">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-base md:text-xl font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                  
                  {total < 50 && (
                    <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3 text-center text-sm md:text-base">
                      <p className="font-medium text-green-700">
                        Add <span className="font-bold">${(50 - total).toFixed(2)}</span> more for free shipping!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* CTA Buttons */}
          <div className="px-4 pb-4 md:px-6 md:pb-6 border-t">
            <div className="pt-4 grid gap-3">
              <Button 
                className="w-full" 
                size={isDesktop ? "default" : "lg"}
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size={isDesktop ? "default" : "lg"}
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-4 md:mt-6 grid grid-cols-2 gap-3 md:hidden">
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs md:text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs md:text-sm font-medium">Secure Checkout</p>
                  <p className="text-xs text-muted-foreground">256-bit SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent 
        className={`h-[90vh] max-h-[90vh] ${
          isDesktop ? "ml-auto mt-0 w-[420px] rounded-l-xl border-l" : ""
        }`}
      >
        <CartContent />
      </DrawerContent>
    </Drawer>
  );
}