import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { CartProvider } from '@/hooks/useCart';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KayBirks | Premium Men\'s Birkenstock Footwear',
  description: 'Discover premium men\'s Birkenstock footwear. Quality craftsmanship meets timeless style for the modern gentleman.',
  keywords: 'Birkenstock, men\'s sandals, premium footwear, clogs, slides',
  openGraph: {
    title: 'KayBirks | Premium Men\'s Birkenstock Footwear',
    description: 'Discover premium men\'s Birkenstock footwear.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pt-16 lg:pt-20">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
