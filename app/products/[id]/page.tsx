"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductVariants } from "@/components/product-variants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { demoProducts, type Product, type ProductVariant } from "@/lib/products";

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const productId = params.id as string;
    const foundProduct = demoProducts.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      }
    }
    
    setIsLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const itemToAdd = selectedVariant 
      ? { ...product, variant: selectedVariant, quantity }
      : { ...product, quantity };
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} added to cart`,
    });
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
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-muted-foreground">Loading product...</div>
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
          {/* Product Header */}
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
              {!product.inStock && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
            
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                ${selectedVariant?.price.toFixed(2) || product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>
            {selectedVariant && selectedVariant.price !== product.price && (
              <p className="mt-1 text-sm text-muted-foreground">
                Base price: ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="mb-6 text-muted-foreground">{product.description}</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <ProductVariants
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantSelect={setSelectedVariant}
              />
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="quantity" className="mb-2 block">
                  Quantity
                </Label>
                <div className="flex items-center gap-2">
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
                    max="99"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 99}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <Label className="mb-2 block opacity-0">Actions</Label>
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || (selectedVariant && !selectedVariant.inStock)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlist}
                    className="h-12 w-12"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-12 w-12"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Stock Status */}
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-destructive"}`} />
                <span className={product.inStock ? "text-green-600" : "text-destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
                {product.inStock && (
                  <span className="text-sm text-muted-foreground">
                    • Usually ships within 24 hours
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Features & Benefits */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Free Shipping</div>
                <div className="text-sm text-muted-foreground">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">2-Year Warranty</div>
                <div className="text-sm text-muted-foreground">Guaranteed quality</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">30-Day Returns</div>
                <div className="text-sm text-muted-foreground">Easy returns</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Secure Payment</div>
                <div className="text-sm text-muted-foreground">100% secure</div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4 pt-4">
              <p>{product.description}</p>
              
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">Key Features:</h4>
                  <ul className="list-inside list-disc space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="specs" className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium">Premium Quality</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">Various sizes available</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">Lightweight</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Care Instructions</span>
                  <span className="font-medium">Machine washable</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-4">
              <div className="text-center text-muted-foreground">
                Reviews functionality coming soon
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="pt-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="delivery">
                  <AccordionTrigger>Delivery Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Standard Shipping</div>
                            <div className="text-sm text-muted-foreground">3-5 business days</div>
                          </div>
                        </div>
                        <div className="font-medium">$4.99</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5" />
                          <div>
                            <div className="font-medium">Express Shipping</div>
                            <div className="text-sm text-muted-foreground">1-2 business days</div>
                          </div>
                        </div>
                        <div className="font-medium">$9.99</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="returns">
                  <AccordionTrigger>Returns & Exchanges</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      We offer a 30-day return policy. Items must be in original condition with tags attached.
                      Return shipping is free for defective items.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>

          {/* Payment Methods */}
          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm font-medium">Payment Methods</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                We accept: Visa, MasterCard, American Express, PayPal, Apple Pay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <Separator className="my-12" />
      
      <div>
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demoProducts
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50"
                onClick={() => window.location.href = `/products/${relatedProduct.id}`}
              >
                <div className="mb-3 aspect-square overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="font-medium">{relatedProduct.name}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-bold">${relatedProduct.price.toFixed(2)}</span>
                  {relatedProduct.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${relatedProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
