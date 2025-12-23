export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  features: string[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  color?: string;
  size?: string;
  inStock: boolean;
}

export const demoProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description: "Ultra-soft 100% cotton t-shirt with premium finish. Perfect for everyday comfort and style.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523381140794-a1eef18a37c9?w=800&auto=format&fit=crop",
    ],
    category: "Clothing",
    tags: ["best-seller", "summer", "casual", "cotton"],
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    features: ["100% Organic Cotton", "Machine Wash Safe", "Premium Fit", "Breathable Fabric"],
    variants: [
      { id: "1-1", name: "Small", price: 29.99, size: "S", inStock: true },
      { id: "1-2", name: "Medium", price: 29.99, size: "M", inStock: true },
      { id: "1-3", name: "Large", price: 29.99, size: "L", inStock: false },
      { id: "1-4", name: "XL", price: 32.99, size: "XL", inStock: true },
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine Wash",
      "Origin": "Made in USA"
    }
  },
  {
    id: "2",
    name: "Designer Denim Jeans",
    description: "Classic straight-leg jeans with premium denim and comfortable stretch.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
    ],
    category: "Clothing",
    tags: ["denim", "pants", "casual", "fashion"],
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    features: ["Premium Denim", "Comfort Stretch", "Classic Fit", "Durable"],
    variants: [
      { id: "2-1", name: "30x32", price: 89.99, size: "30x32", inStock: true },
      { id: "2-2", name: "32x32", price: 89.99, size: "32x32", inStock: true },
      { id: "2-3", name: "34x32", price: 89.99, size: "34x32", inStock: true },
      { id: "2-4", name: "36x32", price: 89.99, size: "36x32", inStock: false },
    ],
    specifications: {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Straight Leg",
      "Closure": "Button Fly",
      "Origin": "Made in Italy"
    }
  },
  {
    id: "3",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop",
    ],
    category: "Electronics",
    tags: ["audio", "wireless", "tech", "premium", "noise-cancelling"],
    inStock: true,
    rating: 4.9,
    reviewCount: 256,
    features: ["Active Noise Cancelling", "30hr Battery", "Bluetooth 5.0", "Voice Assistant"],
    variants: [
      { id: "3-1", name: "Black", price: 199.99, color: "#000000", inStock: true },
      { id: "3-2", name: "White", price: 199.99, color: "#FFFFFF", inStock: true },
      { id: "3-3", name: "Silver", price: 209.99, color: "#C0C0C0", inStock: true },
    ],
    specifications: {
      "Battery": "30 hours",
      "Connectivity": "Bluetooth 5.0",
      "Weight": "265g",
      "Warranty": "2 years"
    }
  },
  {
    id: "4",
    name: "Genuine Leather Backpack",
    description: "Handcrafted genuine leather backpack with multiple compartments and laptop sleeve.",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
    ],
    category: "Accessories",
    tags: ["leather", "bag", "travel", "premium"],
    inStock: false,
    rating: 4.3,
    reviewCount: 67,
    features: ["Genuine Leather", "Water Resistant", "Laptop Compartment", "Multiple Pockets"],
    specifications: {
      "Material": "Full Grain Leather",
      "Dimensions": "12x18x6 inches",
      "Weight": "1.2kg",
      "Origin": "Handcrafted in Spain"
    }
  },
  {
    id: "5",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitor and GPS tracking.",
    price: 149.99,
    originalPrice: 199.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3f4ab6e9c51b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop",
    ],
    category: "Electronics",
    tags: ["fitness", "wearable", "tech", "sale"],
    inStock: true,
    rating: 4.6,
    reviewCount: 189,
    features: ["Heart Rate Monitor", "GPS Tracking", "7-day Battery", "Water Resistant"],
    variants: [
      { id: "5-1", name: "Black/Black", price: 149.99, color: "#000000", inStock: true },
      { id: "5-2", name: "White/Silver", price: 149.99, color: "#FFFFFF", inStock: true },
      { id: "5-3", name: "Blue/Black", price: 149.99, color: "#0000FF", inStock: false },
    ],
    specifications: {
      "Battery": "7 days",
      "Water Resistance": "50m",
      "Display": "AMOLED",
      "Connectivity": "Bluetooth, Wi-Fi"
    }
  },
  {
    id: "6",
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handmade ceramic coffee mugs with unique designs.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577937927131-5cef6c8f7c7a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    ],
    category: "Home",
    tags: ["home", "kitchen", "ceramic", "handmade"],
    inStock: true,
    rating: 4.8,
    reviewCount: 94,
    features: ["Handmade", "Microwave Safe", "Dishwasher Safe", "Unique Designs"],
    specifications: {
      "Material": "Ceramic",
      "Capacity": "12oz each",
      "Set": "4 pieces",
      "Origin": "Handmade in Portugal"
    }
  },
];
