'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/store/cart'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCart()
  const cartTotal = total()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[95] w-full max-w-md bg-[#0A0A0A] border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-[#D4A853]" />
                <h2 className="text-white font-medium tracking-wider uppercase text-sm">
                  Your Cart ({items.length})
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center"
                  >
                    <ShoppingBag size={40} className="text-white/10" />
                    <p className="text-white/30 tracking-wider text-sm uppercase">
                      Your cart is empty
                    </p>
                    <button
                      onClick={toggleCart}
                      className="text-[#D4A853] text-sm tracking-wider uppercase hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 bg-white/5 rounded-xl p-3 border border-white/5"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#111]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#D4A853] text-[10px] tracking-widest uppercase mb-0.5">
                          {item.category}
                        </p>
                        <p className="text-white text-sm font-medium truncate">{item.name}</p>
                        <p className="text-white/50 text-sm mt-1">${item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                          >
                            <Minus size={10} />
                          </motion.button>
                          <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                          >
                            <Plus size={10} />
                          </motion.button>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="text-white/20 hover:text-rose-400 transition-colors self-start mt-1"
                      >
                        <X size={14} />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm tracking-wider uppercase">Total</span>
                  <motion.span
                    key={cartTotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-white font-semibold text-lg"
                  >
                    ${cartTotal.toFixed(2)}
                  </motion.span>
                </div>
                <Link href="/checkout" onClick={toggleCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 bg-[#D4A853] hover:bg-[#C4943F] text-black font-semibold tracking-wider uppercase py-4 rounded-xl transition-colors duration-200"
                  >
                    Checkout
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>
                <Link href="/products" onClick={toggleCart}>
                  <button className="w-full text-white/40 hover:text-white/70 text-sm tracking-wider uppercase transition-colors text-center">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}