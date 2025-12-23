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
    description: "Ultra-soft 100% cotton t-shirt with premium finish",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop",
    ],
    category: "Clothing",
    tags: ["best-seller", "summer", "casual"],
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    features: ["100% Cotton", "Machine Wash", "Premium Fit"],
    variants: [
      { id: "1-1", name: "Small", price: 29.99, size: "S", inStock: true },
      { id: "1-2", name: "Medium", price: 29.99, size: "M", inStock: true },
      { id: "1-3", name: "Large", price: 29.99, size: "L", inStock: false },
    ],
  },
  {
    id: "2",
    name: "Designer Denim Jeans",
    description: "Classic straight-leg jeans with premium denim",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop",
    ],
    category: "Clothing",
    tags: ["denim", "pants", "casual"],
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    features: ["100% Cotton Denim", "Machine Wash", "Classic Fit"],
  },
  {
    id: "3",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones with premium sound",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop",
    ],
    category: "Electronics",
    tags: ["audio", "wireless", "tech"],
    inStock: true,
    rating: 4.9,
    reviewCount: 256,
    features: ["Noise Cancelling", "30hr Battery", "Bluetooth 5.0"],
  },
  {
    id: "4",
    name: "Leather Backpack",
    description: "Genuine leather backpack with multiple compartments",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop",
    ],
    category: "Accessories",
    tags: ["leather", "bag", "travel"],
    inStock: false,
    rating: 4.3,
    reviewCount: 67,
    features: ["Genuine Leather", "Water Resistant", "Laptop Compartment"],
  },
];
