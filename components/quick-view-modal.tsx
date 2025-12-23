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
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Quick View: {product.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="absolute left-3 top-3 bg-red-500">
                  Sale
                </Badge>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h3 className="text-2xl font-bold">{product.name}</h3>
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
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <p className="text-muted-foreground">{product.description}</p>
              
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">Key Features:</h4>
                  <ul className="list-inside list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    onAddToCart(product);
                    onOpenChange(false);
                  }}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <Link href={`/products/${product.id}`} className="block">
                <Button variant="secondary" className="w-full">
                  View Full Details
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between border-t pt-4">
                <span>Availability:</span>
                <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
