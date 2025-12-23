export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductFilters {
  categories: string[];
  priceRange: PriceRange;
  tags: string[];
  inStock: boolean;
  ratings: number[];
}

export const initialFilters: ProductFilters = {
  categories: [],
  priceRange: { min: 0, max: 1000 },
  tags: [],
  inStock: false,
  ratings: [],
};

export const categoryOptions: FilterOption[] = [
  { id: "clothing", label: "Clothing", value: "Clothing", count: 12 },
  { id: "electronics", label: "Electronics", value: "Electronics", count: 8 },
  { id: "accessories", label: "Accessories", value: "Accessories", count: 15 },
  { id: "home", label: "Home Goods", value: "Home Goods", count: 6 },
];

export const ratingOptions: FilterOption[] = [
  { id: "5", label: "★★★★★", value: "5", count: 23 },
  { id: "4", label: "★★★★☆ & up", value: "4", count: 45 },
  { id: "3", label: "★★★☆☆ & up", value: "3", count: 67 },
  { id: "2", label: "★★☆☆☆ & up", value: "2", count: 89 },
  { id: "1", label: "★☆☆☆☆ & up", value: "1", count: 102 },
];

export const tagOptions: FilterOption[] = [
  { id: "best-seller", label: "Best Seller", value: "best-seller", count: 18 },
  { id: "new", label: "New Arrival", value: "new", count: 12 },
  { id: "sale", label: "On Sale", value: "sale", count: 25 },
  { id: "eco-friendly", label: "Eco Friendly", value: "eco-friendly", count: 8 },
  { id: "premium", label: "Premium", value: "premium", count: 15 },
];

export const sortOptions = [
  { id: "featured", label: "Featured", value: "featured" },
  { id: "newest", label: "Newest", value: "newest" },
  { id: "price-low", label: "Price: Low to High", value: "price-asc" },
  { id: "price-high", label: "Price: High to Low", value: "price-desc" },
  { id: "rating", label: "Highest Rated", value: "rating-desc" },
  { id: "name-asc", label: "Name: A to Z", value: "name-asc" },
  { id: "name-desc", label: "Name: Z to A", value: "name-desc" },
];
