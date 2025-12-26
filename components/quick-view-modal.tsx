"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart, X } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/products";
import Link from "next/link";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (product: Product) => void;
}

export function QuickViewModal({ product, open, onOpenChange, onAddToCart }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl p-0 overflow-hidden sm:w-full">
        <div className="flex h-full flex-col">
          {/* Header - Sticky at top */}
          <DialogHeader className="sticky top-0 z-10 flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold sm:text-xl">
                Quick View: <span className="truncate max-w-[200px] sm:max-w-none">{product.name}</span>
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-6 p-4 sm:gap-8 sm:p-6 md:grid-cols-2">
              {/* Images */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    priority
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="absolute left-3 top-3 bg-red-500">
                      Sale
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="outline" className="absolute right-3 top-3 bg-background/90 backdrop-blur-sm">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                {/* Thumbnails - Horizontal scroll on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-x-visible">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 sm:h-auto sm:w-auto ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      {product.category}
                    </Badge>
                    {product.tags.includes("new") && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        New
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold sm:text-2xl">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl font-bold sm:text-3xl">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <Badge className="bg-red-500">
                          Save ${(product.originalPrice - product.price).toFixed(2)}
                        </Badge>
                      </>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground">{product.description}</p>
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="pt-2">
                      <h4 className="mb-2 font-semibold">Key Features:</h4>
                      <ul className="space-y-1 pl-4 text-sm text-muted-foreground">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        onAddToCart(product);
                        onOpenChange(false);
                      }}
                      disabled={!product.inStock}
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="outline" size="icon" className="h-11 w-11">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Link href={`/products/${product.id}`} className="block" onClick={() => onOpenChange(false)}>
                    <Button variant="secondary" className="w-full">
                      View Full Details
                    </Button>
                  </Link>
                </div>
                
                {/* Availability & Tags */}
                <div className="space-y-4 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-sm">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  {product.tags.length > 0 && (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.slice(0, 5).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with Trust Badges - Optional, can remove if not needed */}
          <div className="sticky bottom-0 z-10 flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}