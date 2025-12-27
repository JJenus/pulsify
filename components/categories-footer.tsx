"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCategoryStore } from '@/store/category-store';

export function CategoriesFooter() {
  const { categories, isLoading } = useCategoryStore();

  if (isLoading || categories.length === 0) {
    return (
      <div>
        <h4 className="mb-4 font-semibold">Categories</h4>
        <p className="text-sm text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4 font-semibold">Categories</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {categories.slice(0, 6).map((category) => (
          <li key={category.name}>
            <Link 
              href={`/products?category=${category.name}`}
              className="hover:text-primary flex items-center justify-between group"
            >
              <span className="group-hover:underline">{category.name}</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                {category.productCount}
              </span>
            </Link>
          </li>
        ))}
        {categories.length > 6 && (
          <li>
            <Link 
              href="/products"
              className="hover:text-primary text-primary font-medium"
            >
              View all categories →
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}