"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Star } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCategoryStore } from "@/store/category-store";
import { ratingOptions } from "@/lib/filters";
import type { ProductFilters, PriceRange } from "@/lib/filters";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

export function ProductFilters({ filters, onFiltersChange, onReset }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceRange.min,
    filters.priceRange.max,
  ]);
  
  const { categories, tags, hasCategories, isLoading } = useCategoryStore();

  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilter("categories", newCategories);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    updateFilter("tags", newTags);
  };

  const toggleRating = (rating: number) => {
    const newRatings = filters.ratings.includes(rating)
      ? filters.ratings.filter((r) => r !== rating)
      : [...filters.ratings, rating];
    updateFilter("ratings", newRatings);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    updateFilter("priceRange", { min: value[0], max: value[1] });
  };

  const activeFilterCount = 
    filters.categories.length +
    filters.tags.length +
    filters.ratings.length +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange.min > 0 || filters.priceRange.max < 1000 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Mobile Filter Trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Mobile Filters */}
              <MobileFiltersContent
                filters={filters}
                categories={categories}
                tags={tags}
                hasCategories={hasCategories}
                priceRange={priceRange}
                onToggleCategory={toggleCategory}
                onToggleTag={toggleTag}
                onToggleRating={toggleRating}
                onPriceChange={handlePriceChange}
                onInStockChange={(checked: any) => updateFilter("inStock", checked)}
                onReset={onReset}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="mr-1 h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>

        <DesktopFiltersContent
          filters={filters}
          categories={categories}
          tags={tags}
          hasCategories={hasCategories}
          priceRange={priceRange}
          onToggleCategory={toggleCategory}
          onToggleTag={toggleTag}
          onToggleRating={toggleRating}
          onPriceChange={handlePriceChange}
          onInStockChange={(checked: any) => updateFilter("inStock", checked)}
          onReset={onReset}
        />
      </div>
    </div>
  );
}

// Mobile Filters Component
function MobileFiltersContent({
  filters,
  categories,
  tags,
  hasCategories,
  priceRange,
  onToggleCategory,
  onToggleTag,
  onToggleRating,
  onPriceChange,
  onInStockChange,
  onReset,
}: any) {
  return (
    <Accordion type="multiple" className="w-full">
      {/* Categories */}
      <AccordionItem value="categories">
        <AccordionTrigger>Categories</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {!hasCategories ? (
              <p className="text-sm text-muted-foreground">No categories available</p>
            ) : categories.length === 0 ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              categories.map((category: any) => (
                <div key={category.handle} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mobile-cat-${category.handle}`}
                    checked={filters.categories.includes(category.name)}
                    onCheckedChange={() => onToggleCategory(category.name)}
                  />
                  <Label
                    htmlFor={`mobile-cat-${category.handle}`}
                    className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({category.productCount})
                    </span>
                  </Label>
                </div>
              ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Price Range */}
      <AccordionItem value="price">
        <AccordionTrigger>Price Range</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">${priceRange[0]}</span>
              <span className="text-sm">${priceRange[1]}</span>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={onPriceChange}
              className="my-4"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Tags */}
      <AccordionItem value="tags">
        <AccordionTrigger>Tags</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags available</p>
            ) : (
              tags.map((tag: any) => (
                <div key={tag.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mobile-tag-${tag.value}`}
                    checked={filters.tags.includes(tag.name.toLowerCase())}
                    onCheckedChange={() => onToggleTag(tag.name.toLowerCase())}
                  />
                  <Label
                    htmlFor={`mobile-tag-${tag.value}`}
                    className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
                  >
                    <span>{tag.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({tag.count})
                    </span>
                  </Label>
                </div>
              ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* In Stock */}
      <AccordionItem value="stock">
        <AccordionTrigger>Availability</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mobile-stock"
              checked={filters.inStock}
              onCheckedChange={onInStockChange}
            />
            <Label htmlFor="mobile-stock" className="text-sm font-normal">
              In Stock Only
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Ratings */}
      <AccordionItem value="ratings">
        <AccordionTrigger>Rating</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {ratingOptions.map((rating) => (
              <div key={rating.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`mobile-rating-${rating.id}`}
                  checked={filters.ratings.includes(parseInt(rating.value))}
                  onCheckedChange={() => onToggleRating(parseInt(rating.value))}
                />
                <Label
                  htmlFor={`mobile-rating-${rating.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {rating.label}
                </Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// Desktop Filters Component
function DesktopFiltersContent({
  filters,
  categories,
  tags,
  hasCategories,
  priceRange,
  onToggleCategory,
  onToggleTag,
  onToggleRating,
  onPriceChange,
  onInStockChange,
  onReset,
}: any) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="mb-3 font-medium">Categories</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {!hasCategories ? (
            <p className="text-sm text-muted-foreground">No categories available</p>
          ) : categories.length === 0 ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            categories.map((category: any) => (
              <div key={category.handle} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category.handle}`}
                  checked={filters.categories.includes(category.name)}
                  onCheckedChange={() => onToggleCategory(category.name)}
                />
                <Label
                  htmlFor={`cat-${category.handle}`}
                  className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({category.productCount})
                  </span>
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="mb-3 font-medium">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">${priceRange[0]}</span>
            <span className="text-sm">${priceRange[1]}</span>
          </div>
          <Slider
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={onPriceChange}
          />
        </div>
      </div>

      <Separator />

      {/* Tags */}
      <div>
        <h4 className="mb-3 font-medium">Tags</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags available</p>
          ) : (
            tags.map((tag: any) => (
              <div key={tag.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.value}`}
                  checked={filters.tags.includes(tag.name.toLowerCase())}
                  onCheckedChange={() => onToggleTag(tag.name.toLowerCase())}
                />
                <Label
                  htmlFor={`tag-${tag.value}`}
                  className="text-sm font-normal cursor-pointer flex-1 flex justify-between"
                >
                  <span>{tag.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({tag.count})
                  </span>
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <Separator />

      {/* In Stock */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="stock"
          checked={filters.inStock}
          onCheckedChange={onInStockChange}
        />
        <Label htmlFor="stock" className="text-sm font-normal cursor-pointer">
          In Stock Only
        </Label>
      </div>

      <Separator />

      {/* Ratings */}
      <div>
        <h4 className="mb-3 font-medium">Rating</h4>
        <div className="space-y-2">
          {ratingOptions.map((rating) => (
            <div key={rating.id} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating.id}`}
                checked={filters.ratings.includes(parseInt(rating.value))}
                onCheckedChange={() => onToggleRating(parseInt(rating.value))}
              />
              <Label
                htmlFor={`rating-${rating.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {rating.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}