"use client";

import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductVariants } from "@/components/product-variants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RefreshCw, 
  Star, 
  ChevronRight,
  Package,
  CreditCard,
  Clock,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shopifyClient } from "@/lib/shopify/client";
import { Product, ProductVariant } from "@/lib/products";

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productHandle = params.id as string;
    fetchProduct(productHandle);
  }, [params.id]);

  const fetchProduct = async (handle: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const shopifyProduct = await shopifyClient.getTransformedProductByHandle(handle);
      
      if (!shopifyProduct) {
        notFound();
      }
      
      setProduct(shopifyProduct);
      if (shopifyProduct.variants && shopifyProduct.variants.length > 0) {
        setSelectedVariant(shopifyProduct.variants[0]);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load product from Shopify",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const itemToAdd = selectedVariant 
      ? { ...product, variant: selectedVariant, quantity }
      : { ...product, quantity };
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} added to cart`,
    });
    
    // TODO: Implement Shopify cart integration
    console.log('Add to Shopify cart:', itemToAdd);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product?.name} ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-red-500 mb-4 flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
        <Button onClick={() => fetchProduct(params.id as string)} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-muted-foreground">
        <a href="/" className="hover:text-foreground">Home</a>
        <ChevronRight className="mx-2 inline h-3 w-3" />
        <a href="/products" className="hover:text-foreground">Products</a>
        <ChevronRight className="mx-2 inline h-3 w-3" />
        <a href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-foreground">
          {product.category}
        </a>
        <ChevronRight className="mx-2 inline h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Column - Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column - Product Info */}
        <div>
          {/* Category and Tags */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge className="bg-red-500 text-xs">
                Sale
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center">
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
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
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
            <p className="mt-1 text-sm text-muted-foreground">
              {product.inStock ? "In stock" : "Out of stock"}
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <ProductVariants
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantSelect={setSelectedVariant}
              />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="quantity" className="mb-2 block text-sm">
                  Quantity
                </Label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="mx-2 w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleWishlist}
              >
                <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {isWishlisted ? "Remove" : "Wishlist"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Features & Shipping */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">Over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">2-Year Warranty</p>
                <p className="text-sm text-muted-foreground">Guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Easy Returns</p>
                <p className="text-sm text-muted-foreground">30 Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-sm text-muted-foreground">SSL Protected</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-muted-foreground">{product.description}</p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="list-inside list-disc space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-muted-foreground">
                    {feature}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="specs" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{key}</AccordionTrigger>
                    <AccordionContent>{value}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}