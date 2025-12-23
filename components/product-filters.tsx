"use client";

import { useState } from "react";
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
import {
  categoryOptions,
  ratingOptions,
  tagOptions,
  type ProductFilters,
  type PriceRange,
} from "@/lib/filters";

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
            <div className="mt-6">
              <FiltersContent
                filters={filters}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                onToggleCategory={toggleCategory}
                onToggleTag={toggleTag}
                onToggleRating={toggleRating}
                onInStockChange={(checked) => updateFilter("inStock", checked)}
                onReset={onReset}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
        
        <FiltersContent
          filters={filters}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          onToggleCategory={toggleCategory}
          onToggleTag={toggleTag}
          onToggleRating={toggleRating}
          onInStockChange={(checked) => updateFilter("inStock", checked)}
          onReset={onReset}
        />
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1">
                {category}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleCategory(category)}
                />
              </Badge>
            ))}
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
            {filters.ratings.map((rating) => (
              <Badge key={rating} variant="secondary" className="gap-1">
                {rating}★ & up
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleRating(rating)}
                />
              </Badge>
            ))}
            {filters.inStock && (
              <Badge variant="secondary" className="gap-1">
                In Stock
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilter("inStock", false)}
                />
              </Badge>
            )}
            {(filters.priceRange.min > 0 || filters.priceRange.max < 1000) && (
              <Badge variant="secondary" className="gap-1">
                ${filters.priceRange.min} - ${filters.priceRange.max}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    updateFilter("priceRange", { min: 0, max: 1000 });
                    setPriceRange([0, 1000]);
                  }}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface FiltersContentProps {
  filters: ProductFilters;
  priceRange: [number, number];
  onPriceChange: (value: number[]) => void;
  onToggleCategory: (category: string) => void;
  onToggleTag: (tag: string) => void;
  onToggleRating: (rating: number) => void;
  onInStockChange: (checked: boolean) => void;
  onReset: () => void;
}

function FiltersContent({
  filters,
  priceRange,
  onPriceChange,
  onToggleCategory,
  onToggleTag,
  onToggleRating,
  onInStockChange,
  onReset,
}: FiltersContentProps) {
  return (
    <Accordion type="multiple" defaultValue={["price", "categories", "ratings"]}>
      {/* Price Range */}
      <AccordionItem value="price">
        <AccordionTrigger>Price Range</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 1000]}
              value={priceRange}
              max={1000}
              step={10}
              onValueChange={onPriceChange}
              className="my-6"
            />
            <div className="flex items-center justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Categories */}
      <AccordionItem value="categories">
        <AccordionTrigger>Categories</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {categoryOptions.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.value)}
                    onCheckedChange={() => onToggleCategory(category.value)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="cursor-pointer"
                  >
                    {category.label}
                  </Label>
                </div>
                {category.count && (
                  <span className="text-sm text-muted-foreground">
                    {category.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Ratings */}
      <AccordionItem value="ratings">
        <AccordionTrigger>Customer Ratings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {ratingOptions.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating.id}`}
                    checked={filters.ratings.includes(Number(rating.value))}
                    onCheckedChange={() => onToggleRating(Number(rating.value))}
                  />
                  <Label
                    htmlFor={`rating-${rating.id}`}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    <span className="text-yellow-500">{rating.label}</span>
                  </Label>
                </div>
                {rating.count && (
                  <span className="text-sm text-muted-foreground">
                    {rating.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Tags */}
      <AccordionItem value="tags">
        <AccordionTrigger>Tags</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {tagOptions.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={filters.tags.includes(tag.value)}
                    onCheckedChange={() => onToggleTag(tag.value)}
                  />
                  <Label
                    htmlFor={`tag-${tag.id}`}
                    className="cursor-pointer"
                  >
                    {tag.label}
                  </Label>
                </div>
                {tag.count && (
                  <span className="text-sm text-muted-foreground">
                    {tag.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Availability */}
      <AccordionItem value="availability">
        <AccordionTrigger>Availability</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={onInStockChange}
            />
            <Label htmlFor="in-stock" className="cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      <Separator className="my-4" />
      
      <Button
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        Reset All Filters
      </Button>
    </Accordion>
  );
}
