'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '@/store/cart'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const cartTotal = total()
  const shipping = cartTotal >= 150 ? 0 : 15
  const finalTotal = cartTotal + shipping

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4A853] text-xs tracking-[0.4em] uppercase mb-3"
          >
            {items.length} items
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl text-white"
          >
            Your Cart
          </motion.h1>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ShoppingBag size={64} className="text-white/5" />
            </motion.div>
            <p className="text-white/20 tracking-widest uppercase text-sm">Your cart is empty</p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-[#D4A853] text-black font-semibold tracking-wider uppercase px-8 py-4 rounded-full"
              >
                <ArrowLeft size={16} />
                Browse Collection
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    className="flex gap-5 bg-[#0D0D0D] border border-white/5 rounded-2xl p-4"
                  >
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-[#111]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#D4A853] text-[10px] tracking-widest uppercase mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-white font-medium mb-1">{item.name}</h3>
                      <p className="text-white/40 text-sm mb-4">${item.price}</p>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-colors"
                        >
                          <Minus size={12} />
                        </motion.button>
                        <span className="text-white w-6 text-center">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.8 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-colors"
                        >
                          <Plus size={12} />
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="text-white/20 hover:text-rose-400 transition-colors"
                      >
                        <X size={16} />
                      </motion.button>
                      <span className="text-white font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCart}
                className="text-white/20 hover:text-rose-400 text-xs tracking-wider uppercase transition-colors"
              >
                Clear all items
              </motion.button>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-6 h-fit sticky top-28"
            >
              <h2 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
                    {shipping === 0 ? 'Free' : `$${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[#D4A853] text-xs">
                    Add ${(150 - cartTotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-medium">Total</span>
                  <motion.span
                    key={finalTotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-white font-semibold text-lg"
                  >
                    ${finalTotal.toFixed(2)}
                  </motion.span>
                </div>
              </div>
              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 bg-[#D4A853] hover:bg-[#C4943F] text-black font-semibold tracking-wider uppercase py-4 rounded-xl transition-colors duration-200 mb-3"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </motion.button>
              </Link>
              <Link href="/products">
                <button className="w-full flex items-center justify-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-wider uppercase transition-colors">
                  <ArrowLeft size={12} />
                  Continue Shopping
                </button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}