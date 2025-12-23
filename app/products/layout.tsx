import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - ShopPro',
  description: 'Browse our collection of premium products',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
