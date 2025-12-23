"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Product } from "@/lib/products";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {/* Sale Badge */}
      {product.originalPrice && product.originalPrice > product.price && (
        <Badge className="absolute left-2 top-2 z-10 bg-red-500 hover:bg-red-600">
          Sale
        </Badge>
      )}

      {/* Out of Stock Badge */}
      {!product.inStock && (
        <Badge variant="outline" className="absolute left-2 top-2 z-10 bg-background">
          Out of Stock
        </Badge>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="secondary"
            onClick={() => onQuickView?.(product)}
            className="scale-90 transform opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
          >
            Quick View
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <p className="text-sm text-muted-foreground">{product.category}</p>
        
        {/* Product Name */}
        <h3 className="mt-1 font-semibold line-clamp-1">{product.name}</h3>
        
        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
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
          <span className="ml-2 text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        
        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
