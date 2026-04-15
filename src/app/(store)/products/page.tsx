'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import ProductCard from '@/components/products/product-card'

const categories = ['All', 'Clothing', 'Accessories', 'Footwear', 'Bags']

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  const { data: rawProducts = [], isLoading } = trpc.product.getAll.useQuery()

  const filtered = useMemo(() => {
    // Normalize createdAt from string → Date (JSON serialization strips Date type)
    const products = rawProducts.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
    }))

    let result = activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [rawProducts, activeCategory, sortBy])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#080808] pt-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full"
          />
          <p className="text-white/30 text-xs tracking-widest uppercase">Loading</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4A853] text-xs tracking-[0.4em] uppercase mb-3"
          >
            {filtered.length} pieces
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl text-white"
          >
            {activeCategory === 'All' ? 'The Collection' : activeCategory}
          </motion.h1>
        </div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-10 pb-6 border-b border-white/10"
        >
          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative px-5 py-2 text-xs tracking-widest uppercase rounded-full transition-all duration-200 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'text-black font-semibold'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-[#D4A853] rounded-full"
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hidden md:block bg-transparent border border-white/10 text-white/50 text-xs tracking-wider uppercase rounded-lg px-4 py-2 outline-none focus:border-[#D4A853]/50 cursor-pointer"
            >
              <option value="featured" className="bg-[#111]">Featured</option>
              <option value="price-asc" className="bg-[#111]">Price: Low → High</option>
              <option value="price-desc" className="bg-[#111]">Price: High → Low</option>
              <option value="rating" className="bg-[#111]">Top Rated</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden flex items-center gap-2 border border-white/10 text-white/50 text-xs tracking-wider uppercase rounded-lg px-4 py-2"
            >
              <SlidersHorizontal size={14} />
              Filter
            </motion.button>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-white/20 text-sm tracking-widest uppercase"
          >
            No products found
          </motion.div>
        )}
      </div>
    </main>
  )
}