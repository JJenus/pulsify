"use client";

import { useEffect } from 'react';
import { useCategoryStore } from '@/store/category-store';

export function CategoryProvider() {
  const { categories, isLoading, fetchCategories } = useCategoryStore();
  
  // Fetch once on mount if empty
  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      fetchCategories();
    }
  }, [categories.length, isLoading, fetchCategories]);
}