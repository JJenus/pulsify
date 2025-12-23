"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ProductVariant } from "@/lib/products";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
}

export function ProductVariants({ variants, selectedVariant, onVariantSelect }: ProductVariantsProps) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Group variants by type (size, color, etc.)
  const sizeVariants = variants.filter(v => v.size);
  const colorVariants = variants.filter(v => v.color);
  
  const hasMultipleTypes = sizeVariants.length > 0 && colorVariants.length > 0;

  return (
    <div className="space-y-6">
      {/* Size Variants */}
      {sizeVariants.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <Label className="text-base font-medium">Size</Label>
            <Button
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={() => setShowSizeGuide(!showSizeGuide)}
            >
              Size Guide
            </Button>
          </div>
          
          {showSizeGuide && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Our sizes run true to size. If you're between sizes, we recommend sizing up.
              </AlertDescription>
            </Alert>
          )}
          
          <RadioGroup
            value={selectedVariant?.id}
            onValueChange={(value) => {
              const variant = variants.find(v => v.id === value);
              if (variant) onVariantSelect(variant);
            }}
            className="grid grid-cols-3 gap-2 sm:grid-cols-4"
          >
            {sizeVariants.map((variant) => (
              <div key={variant.id} className="relative">
                <RadioGroupItem
                  value={variant.id}
                  id={`size-${variant.id}`}
                  className="peer sr-only"
                  disabled={!variant.inStock}
                />
                <Label
                  htmlFor={`size-${variant.id}`}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-md border-2 text-center text-sm font-medium transition-all peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 ${
                    !variant.inStock
                      ? "border-destructive/20 bg-destructive/5"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  {variant.size}
                  {!variant.inStock && (
                    <span className="absolute -top-1 -right-1">
                      <Badge variant="destructive" className="h-5 px-1 text-[10px]">
                        Out
                      </Badge>
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Color Variants */}
      {colorVariants.length > 0 && (
        <div>
          <Label className="mb-3 text-base font-medium">Color</Label>
          <RadioGroup
            value={selectedVariant?.id}
            onValueChange={(value) => {
              const variant = variants.find(v => v.id === value);
              if (variant) onVariantSelect(variant);
            }}
            className="grid grid-cols-3 gap-2 sm:grid-cols-4"
          >
            {colorVariants.map((variant) => (
              <div key={variant.id} className="relative">
                <RadioGroupItem
                  value={variant.id}
                  id={`color-${variant.id}`}
                  className="peer sr-only"
                  disabled={!variant.inStock}
                />
                <Label
                  htmlFor={`color-${variant.id}`}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-md border-2 transition-all peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[state=checked]:border-primary ${
                    !variant.inStock
                      ? "border-destructive/20 bg-destructive/5"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {variant.color && (
                      <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: variant.color.toLowerCase() }}
                      />
                    )}
                    <span>{variant.name}</span>
                  </div>
                  {!variant.inStock && (
                    <span className="absolute -top-1 -right-1">
                      <Badge variant="destructive" className="h-5 px-1 text-[10px]">
                        Out
                      </Badge>
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Simple Variants (if no size/color) */}
      {variants.length > 0 && !hasMultipleTypes && !sizeVariants.length && !colorVariants.length && (
        <div>
          <Label className="mb-3 text-base font-medium">Options</Label>
          <div className="grid grid-cols-2 gap-2">
            {variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                className="h-auto py-3"
                onClick={() => onVariantSelect(variant)}
                disabled={!variant.inStock}
              >
                <div className="flex flex-col items-center">
                  <span>{variant.name}</span>
                  {selectedVariant?.id === variant.id && (
                    <Check className="mt-1 h-4 w-4" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      {selectedVariant && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {selectedVariant.name}
                {selectedVariant.size && ` - ${selectedVariant.size}`}
                {selectedVariant.color && ` (${selectedVariant.color})`}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedVariant.inStock ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    In Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-destructive">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
            <div className="text-lg font-bold">
              ${selectedVariant.price.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
