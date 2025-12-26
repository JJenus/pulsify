"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { ProductSorting } from "@/components/product-sorting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shopifyClient } from "@/lib/shopify/client";
import { Product } from "@/lib/products";
import { initialFilters, type ProductFilters } from "@/lib/filters";
import { categoryStore } from "@/lib/categories";
import { useToast } from "@/hooks/use-toast";
import { Search, Grid3x3, List, RefreshCw } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { QuickViewModal } from "@/components/quick-view-modal";


export default function ProductsPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const productsPerPage = 12;

  // Fetch products from Shopify
  useEffect(() => {
    fetchProducts();
  }, []);

  // Update categories when products change
  useEffect(() => {
    if (products.length > 0) {
      categoryStore.updateFromProducts(products);
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const sortMap: Record<string, { sortKey: string; reverse?: boolean }> = {
        'featured': { sortKey: 'BEST_SELLING' },
        'newest': { sortKey: 'CREATED_AT', reverse: true },
        'price-asc': { sortKey: 'PRICE' },
        'price-desc': { sortKey: 'PRICE', reverse: true },
        'rating-desc': { sortKey: 'RELEVANCE' },
        'name-asc': { sortKey: 'TITLE' },
        'name-desc': { sortKey: 'TITLE', reverse: true },
      };

      const sortOptions = sortMap[sortBy] || { sortKey: 'BEST_SELLING' };
      
      const shopifyProducts = await shopifyClient.getTransformedProducts({
        first: 100,
        query: searchQuery || undefined,
        ...sortOptions,
      });

      setProducts(shopifyProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load products from Shopify",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    if (filters.tags.length > 0) {
      result = result.filter((product) =>
        product.tags.some((tag) => filters.tags.includes(tag))
      );
    }

    if (filters.inStock) {
      result = result.filter((product) => product.inStock);
    }

    if (filters.ratings.length > 0) {
      result = result.filter((product) =>
        filters.ratings.some((rating) => product.rating >= rating)
      );
    }

    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
      result = result.filter(
        (product) =>
          product.price >= filters.priceRange.min &&
          product.price <= filters.priceRange.max
      );
    }

    return result;
  }, [products, filters, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchQuery]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchProducts} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Products</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of premium products from Shopify
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <ProductSorting value={sortBy} onValueChange={setSortBy} />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {isLoading ? (
              "Loading products..."
            ) : (
              `Showing ${startIndex + 1}-${Math.min(startIndex + productsPerPage, filteredProducts.length)} of ${filteredProducts.length} products`
            )}
          </div>
          {filteredProducts.length < products.length && (
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={handleResetFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="mb-2 text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((p) => Math.max(1, p - 1));
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNum);
                              }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    
    {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}