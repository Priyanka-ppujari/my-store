'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/products/product-card'
import { products } from '@/lib/data'

const marqueeItems = ['New Collection', 'Free Shipping', 'Luxury Fashion', 'Limited Edition', 'Premium Quality', 'Handcrafted']

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const featured = products.slice(0, 4)

  return (
    <main className="min-h-screen bg-[#080808]">
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#080808] to-[#0A0A0A]" />
          {/* Floating orbs */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4A853]/5 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#D4A853]/8 rounded-full blur-[100px]"
          />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[#D4A853] text-xs tracking-[0.4em] uppercase mb-6"
          >
            New Collection 2026
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl text-white leading-none mb-8"
          >
            Wear the
            <br />
            <span className="italic text-[#D4A853]">Darkness.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-white/40 text-lg max-w-md mx-auto mb-12 leading-relaxed"
          >
            Luxury fashion for those who move in shadows. Premium materials, timeless silhouettes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex items-center justify-center gap-4"
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: '#C4943F' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 bg-[#D4A853] text-black font-semibold tracking-wider uppercase px-8 py-4 rounded-full transition-colors duration-200"
              >
                Shop Now
                <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link href="/products?category=new">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 border border-white/20 text-white font-medium tracking-wider uppercase px-8 py-4 rounded-full hover:border-white/50 transition-colors duration-200"
              >
                New Arrivals
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-transparent via-[#D4A853]/60 to-transparent"
          />
          <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="py-5 border-y border-white/5 overflow-hidden bg-[#0D0D0D]">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex whitespace-nowrap"
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-8">
              <span className="text-white/20 text-xs tracking-[0.3em] uppercase">{item}</span>
              <span className="text-[#D4A853]">✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[#D4A853] text-xs tracking-[0.4em] uppercase mb-3"
            >
              Curated Selection
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl text-white"
            >
              Featured Pieces
            </motion.h2>
          </div>
          <Link href="/products">
            <motion.div
              whileHover={{ x: 4 }}
              className="hidden md:flex items-center gap-2 text-white/40 hover:text-white text-sm tracking-wider uppercase transition-colors"
            >
              View All <ArrowRight size={14} />
            </motion.div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="mx-6 mb-24 rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#0D0D0D] to-[#111] border border-white/5 p-16 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-[#D4A853]/5 rounded-3xl blur-3xl"
        />
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl text-white mb-4"
          >
            Free shipping on orders<br />
            <span className="text-[#D4A853]">over $150</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 mb-8"
          >
            Worldwide express delivery. No minimum on returns.
          </motion.p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-black font-semibold tracking-wider uppercase px-8 py-4 rounded-full"
            >
              Shop the Collection
            </motion.button>
          </Link>
        </div>
      </section>
    </main>
  )
}