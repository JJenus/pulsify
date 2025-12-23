"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Eye, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <Card className="group relative overflow-hidden transition-all hover:shadow-xl duration-300">
        {/* Badges */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
          {/* Sale Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="bg-red-500 hover:bg-red-600 shadow-lg">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </Badge>
          )}

          {/* Out of Stock Badge */}
          {!product.inStock && (
            <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
              Out of Stock
            </Badge>
          )}

          {/* New Arrival Badge */}
          {product.tags.includes("new") && (
            <Badge className="bg-green-500 hover:bg-green-600 shadow-lg">
              New
            </Badge>
          )}
        </div>

        {/* Quick Actions - Using CSS group-hover instead of React state */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full shadow-lg scale-90 group-hover:scale-100"
            onClick={handleQuickView}
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9 rounded-full shadow-lg scale-90 group-hover:scale-100"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Main Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Second Image on Hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* View Details Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
            <Badge className="absolute bottom-4 scale-90 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <ExternalLink className="mr-1 h-3 w-3" />
              View Details
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Category */}
          <Link 
            href={`/products?category=${product.category.toLowerCase()}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-block"
          >
            <Badge variant="outline" className="mb-2 hover:bg-primary hover:text-primary-foreground transition-colors">
              {product.category}
            </Badge>
          </Link>
          
          {/* Product Name */}
          <h3 className="mb-2 font-semibold line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating */}
          <Link 
            href={`/products/${product.id}#reviews`}
            onClick={(e) => e.stopPropagation()}
            className="inline-block"
          >
            <div className="mb-3 flex items-center gap-1 hover:opacity-80 transition-opacity">
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
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          </Link>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-3">
              <ul className="space-y-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-center text-xs text-muted-foreground">
                    <div className="mr-2 h-1 w-1 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag}
                  href={`/products?tag=${tag}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block"
                >
                  <Badge
                    variant="secondary"
                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
              {product.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t p-5 pt-4">
          <div className="flex w-full gap-3">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="sm"
            >
              {product.inStock ? (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              ) : (
                "Notify Me"
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/products/${product.id}`;
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
} 