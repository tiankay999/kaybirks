'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Truck, RefreshCw, Shield, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const trustItems = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: '100% protected checkout',
  },
  {
    icon: Star,
    title: 'Quality Guarantee',
    description: 'Authentic Birkenstock',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.products) {
          setFeaturedProducts(data.products.filter((p: Product) => p.featured).slice(0, 4));
          setNewArrivals(data.products.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, newArrivals.length - 3));
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.max(1, newArrivals.length - 3)) % Math.max(1, newArrivals.length - 3));
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[var(--primary-50)] via-white to-[var(--primary-100)]"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary-200)] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--primary-300)] rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block px-4 py-1.5 bg-[var(--primary-100)] text-[var(--primary-700)] rounded-full text-sm font-medium mb-6"
              >
                Premium Men&apos;s Collection
              </motion.span>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--gray-900)] leading-tight mb-6"
              >
                Step Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-700)]">
                  Premium Comfort
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-[var(--gray-600)] max-w-lg mx-auto lg:mx-0 mb-8"
              >
                Discover our curated collection of authentic Birkenstock footwear.
                Where timeless German craftsmanship meets modern style.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/shop">
                  <Button size="lg" className="group">
                    Shop Collection
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/shop?featured=true">
                  <Button variant="outline" size="lg">
                    Explore Featured
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center lg:justify-start gap-8 mt-12"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--gray-900)]">10K+</p>
                  <p className="text-sm text-[var(--gray-500)]">Happy Customers</p>
                </div>
                <div className="w-px h-12 bg-[var(--gray-300)]" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--gray-900)]">4.9</p>
                  <p className="text-sm text-[var(--gray-500)]">Average Rating</p>
                </div>
                <div className="w-px h-12 bg-[var(--gray-300)]" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--gray-900)]">50+</p>
                  <p className="text-sm text-[var(--gray-500)]">Styles Available</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] rounded-[2rem] transform rotate-3" />
                <div className="absolute inset-4 bg-white rounded-[1.5rem] shadow-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800"
                    alt="Premium Birkenstock Sandals"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 px-6 py-4 bg-white rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[var(--primary-100)] rounded-full flex items-center justify-center">
                      <Star className="text-[var(--primary-500)] fill-current" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--gray-900)]">Best Seller</p>
                      <p className="text-sm text-[var(--gray-500)]">Arizona Sandal</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[var(--gray-400)] rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[var(--gray-400)] rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-y border-[var(--gray-200)]">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-14 h-14 bg-[var(--primary-100)] rounded-2xl flex items-center justify-center mb-4">
                  <item.icon className="text-[var(--primary-600)]" size={28} />
                </div>
                <h3 className="font-semibold text-[var(--gray-900)] mb-1">{item.title}</h3>
                <p className="text-sm text-[var(--gray-500)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[var(--gray-50)]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[var(--primary-500)] font-medium text-sm uppercase tracking-wider">
              Handpicked for You
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--gray-900)] mt-2">
              Featured Collection
            </h2>
            <p className="text-[var(--gray-600)] mt-3 max-w-lg mx-auto">
              Our most popular styles, chosen for their exceptional quality and timeless design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[400px] skeleton rounded-[var(--radius-xl)]" />
              ))
              : featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Carousel */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--primary-500)] font-medium text-sm uppercase tracking-wider">
                Just Landed
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--gray-900)] mt-2">
                New Arrivals
              </h2>
            </motion.div>

            <div className="hidden sm:flex gap-2">
              <button
                onClick={prevSlide}
                className="p-3 border border-[var(--gray-300)] rounded-full hover:bg-[var(--gray-100)] transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 border border-[var(--gray-300)] rounded-full hover:bg-[var(--gray-100)] transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${carouselIndex * (100 / 4)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex gap-6"
            >
              {newArrivals.map((product) => (
                <div key={product.id} className="min-w-[280px] sm:min-w-[320px] lg:min-w-[calc(25%-18px)]">
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[var(--primary-600)] to-[var(--primary-800)] text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Experience Premium Comfort
            </h2>
            <p className="text-lg text-[var(--primary-100)] mb-8">
              Join thousands of satisfied customers who have discovered the perfect blend of style and comfort with KayBirks.
            </p>
            <Link href="/shop">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[var(--primary-700)] hover:bg-[var(--gray-100)]"
              >
                Shop Now
                <ArrowRight size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[var(--gray-50)]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--gray-900)] mb-4">
              Stay in the Loop
            </h2>
            <p className="text-[var(--gray-600)] mb-6">
              Subscribe to our newsletter for exclusive offers, new arrivals, and style tips.
            </p>
            <form className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 border border-[var(--gray-300)] rounded-[var(--radius-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
