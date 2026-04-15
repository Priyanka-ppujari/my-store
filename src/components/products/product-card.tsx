'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Product as PrismaProduct } from '@prisma/client'

type Product = PrismaProduct & {
  colors?: string[]
  sizes?: string[]
}

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const badgeColors: Record<string, string> = {
    New: 'bg-emerald-500',
    Sale: 'bg-[#D4A853]',
    Hot: 'bg-rose-500',
    Limited: 'bg-purple-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
    >
      <Link href={`/products/${product.id}`}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="group relative bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
        >
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
            <motion.div
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Dark overlay on hover */}
            <motion.div
              animate={{ opacity: hovered ? 0.4 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black"
            />

            {/* Badge */}
            {product.badge && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`absolute top-4 left-4 ${badgeColors[product.badge]} text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full`}
              >
                {product.badge}
              </motion.div>
            )}

            {/* Action Buttons */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 flex flex-col gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
                    className="w-9 h-9 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center"
                  >
                    <Heart
                      size={14}
                      className={liked ? 'fill-rose-500 text-rose-500' : 'text-white'}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.preventDefault()}
                    className="w-9 h-9 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center"
                  >
                    <Eye size={14} className="text-white" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add to Cart Button */}
            <AnimatePresence>
              {hovered && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#C4943F] text-black font-semibold text-sm tracking-wider uppercase py-3 rounded-xl transition-colors duration-200"
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        ✓ Added!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={14} />
                        Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-[#D4A853] text-xs tracking-widest uppercase mb-1">
              {product.category}
            </p>
            <h3 className="text-white font-medium text-sm mb-2 line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-white/30 text-sm line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-[#D4A853] text-[#D4A853]" />
                <span className="text-white/50 text-xs">{product.rating}</span>
              </div>
            </div>

            {/* Color swatches */}
            {product.colors && (
              <div className="flex items-center gap-1.5 mt-3">
                {product.colors.slice(0, 4).map((color) => (
                  <motion.div
                    key={color}
                    whileHover={{ scale: 1.3 }}
                    className="w-3 h-3 rounded-full border border-white/20 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}