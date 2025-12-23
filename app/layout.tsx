"use client"; // Add this because we need client-side interactivity 
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { CartDrawer } from '@/components/cart-drawer';
import { Button } from '@/components/ui/button';
import { Search, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Categories data for both desktop and mobile
  const categories = [
    { name: 'Clothing', href: '/products?category=clothing', count: 12 },
    { name: 'Electronics', href: '/products?category=electronics', count: 8 },
    { name: 'Accessories', href: '/products?category=accessories', count: 15 },
    { name: 'Home Goods', href: '/products?category=home', count: 6 },
  ];

  // Sale items data
  const saleItems = [
    { name: 'All Sale Items', href: '/products?tag=sale' },
    { name: '50% Off & More', href: '/products?discount=50' },
    { name: 'Clearance', href: '/products?tag=clearance' },
    { name: 'Last Chance', href: '/products?tag=last-chance' },
  ];

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '#', hasDropdown: true },
    { name: 'Sale', href: '#', hasDropdown: true, badge: 'HOT' },
    { name: 'About', href: '/about' },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              {/* Mobile Menu Trigger */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>ShopPro Menu</SheetTitle>
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
                        {categories.map((category) => (
                          <li key={category.name}>
                            <Link
                              href={category.href}
                              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span>{category.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {category.count}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Mobile Sale Items */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-muted-foreground">
                        <span className="text-red-500">🔥 Sale</span>
                      </h3>
                      <ul className="space-y-2">
                        {saleItems.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="flex items-center rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span>{item.name}</span>
                              {item.name.includes('%') && (
                                <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                                  SALE
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              
              <Link href="/" className="text-2xl font-bold hover:opacity-80">
                ShopPro
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className="font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              
              <Link 
                href="/products" 
                className="font-medium hover:text-primary transition-colors"
              >
                Products
              </Link>
              
              {/* Categories Dropdown */}
              <div className="group relative">
                <button className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                  Categories
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-64 rounded-lg border bg-popover p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 invisible group-hover:visible">
                  <h4 className="mb-3 font-semibold">Shop by Category</h4>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <Link
                          href={category.href}
                          className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <span>{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Sale Dropdown */}
              <div className="group relative">
                <button className="font-medium hover:text-primary transition-colors flex items-center gap-1">
                  <span className="relative">
                    Sale
                    <span className="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                      HOT
                    </span>
                  </span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-64 rounded-lg border bg-popover p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 invisible group-hover:visible">
                  <h4 className="mb-3 font-semibold text-red-500">🔥 Limited Time Offers</h4>
                  <ul className="space-y-2">
                    {saleItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="flex items-center rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <span>{item.name}</span>
                          {item.name.includes('%') && (
                            <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                              SALE
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Link 
                href="/about" 
                className="font-medium hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              
              <CartDrawer />
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-lg font-bold">ShopPro</h3>
                <p className="text-sm text-muted-foreground">
                  Your one-stop shop for premium products and exceptional service.
                </p>
              </div>
              
              <div>
                <h4 className="mb-4 font-semibold">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/" className="hover:text-primary">Home</Link></li>
                  <li><Link href="/products" className="hover:text-primary">Shop</Link></li>
                  <li><Link href="/about" className="hover:text-primary">About</Link></li>
                  <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 font-semibold">Categories</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <Link 
                        href={category.href} 
                        className="hover:text-primary flex justify-between"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs">{category.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 font-semibold">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                  <li><Link href="/shipping" className="hover:text-primary">Shipping</Link></li>
                  <li><Link href="/returns" className="hover:text-primary">Returns</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} ShopPro. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </body>
    </html>
  );
}