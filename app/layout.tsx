import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import Link from 'next/link';
import { CategoriesFooter } from '@/components/categories-footer';
import { CategoryProvider } from '@/components/category-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pulsify - Modern E-commerce Store',
  description: 'A modern e-commerce store built with Next.js and shadcn/ui',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="mb-4 text-lg font-bold">Pulsify</h3>
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
              
              {/* Dynamic Categories Section */}
              <CategoriesFooter />
              
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
              <p>&copy; {new Date().getFullYear()} Pulsify. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </body>
    </html>
  );
} 