"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CartDrawer } from '@/components/cart-drawer';
import { Button } from '@/components/ui/button';
import { Search, User, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCategoryStore } from '@/store/category-store';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { categories, isLoading } = useCategoryStore();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '#', hasDropdown: true },
    { name: 'Sale', href: '/products?tag=sale', badge: 'HOT' },
    { name: 'About', href: '/about' },
  ];

  const saleItems = [
    { name: 'All Sale Items', href: '/products?tag=sale' },
    { name: '50% Off & More', href: '/products?discount=50' },
    { name: 'Clearance', href: '/products?tag=clearance' },
    { name: 'Last Chance', href: '/products?tag=last-chance' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Pulsify Menu</SheetTitle>
              </SheetHeader>
              
              {/* Mobile Navigation */}
              <nav className="mt-6 flex flex-col space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground">Main Menu</h3>
                  <ul className="space-y-3">
                    {navItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-muted-foreground">Categories</h3>
                  <ul className="space-y-2">
                    {categories.length === 0 ? (
                      <li className="text-sm text-muted-foreground">No categories</li>
                    ) : (
                      categories.slice(0, 6).map((category) => (
                        <li key={category.value}>
                          <Link
                            href={`/products?category=${category.value}`}
                            className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span>{category.name}</span>
                            <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                              {category.count}
                            </span>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            Pulsify
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              >
                {item.name}
                {item.badge && (
                  <span className="absolute -top-2 -right-3 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
              
              {/* Categories Dropdown */}
              {item.name === 'Categories' && categories.length > 0 && (
                <div className="absolute left-0 top-full mt-2 hidden w-64 rounded-md border bg-popover p-4 shadow-lg group-hover:block">
                  <div className="space-y-2">
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category.value}
                        href={`/products?category=${category.value}`}
                        className="flex items-center justify-between rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {category.count}
                        </span>
                      </Link>
                    ))}
                    {categories.length > 8 && (
                      <Link
                        href="/products"
                        className="block text-center text-sm font-medium text-primary hover:underline pt-2 border-t"
                      >
                        View All Categories
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search and User Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}