'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useCart } from '@/store/cart'
import { useState } from 'react'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = trpc.product.getById.useQuery({ id })
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#080808] pt-28 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full"
        />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#080808] pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 tracking-widest uppercase mb-4">Product not found</p>
          <Link href="/products">
            <button className="text-[#D4A853] tracking-wider uppercase text-sm hover:underline">
              Back to Shop
            </button>
          </Link>
        </div>
      </main>
    )
  }

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/products">
          <motion.div
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-white/30 hover:text-white text-sm tracking-wider uppercase mb-10 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </motion.div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111]"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.badge && (
              <div className={`absolute top-4 left-4 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                product.badge === 'Sale' ? 'bg-[#D4A853]' :
                product.badge === 'New' ? 'bg-emerald-500' :
                product.badge === 'Hot' ? 'bg-rose-500' : 'bg-purple-500'
              }`}>
                {product.badge}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <p className="text-[#D4A853] text-xs tracking-[0.4em] uppercase mb-3">
              {product.category}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.floor(product.rating) ? 'fill-[#D4A853] text-[#D4A853]' : 'text-white/20'}
                  />
                ))}
              </div>
              <span className="text-white/40 text-sm">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-white text-3xl font-semibold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-white/30 text-xl line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-white/50 leading-relaxed mb-10">
              {product.description}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-[#D4A853] hover:bg-[#C4943F] text-black font-semibold tracking-wider uppercase py-4 rounded-xl transition-colors duration-200"
            >
              <ShoppingBag size={18} />
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </motion.button>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/30 text-sm">
                Stock: <span className="text-white/60">{product.stock} available</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
