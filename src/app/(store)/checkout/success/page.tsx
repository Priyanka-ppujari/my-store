'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCart } from '@/store/cart'

export default function SuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6"
        >
          <Check size={32} className="text-emerald-400" />
        </motion.div>
        <h1 className="font-serif text-4xl text-white mb-4">Order Confirmed!</h1>
        <p className="text-white/40 mb-8">
          Thank you for your purchase. Youll receive a confirmation email shortly.
        </p>
        <Link href="/products">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-[#D4A853] text-black font-semibold tracking-wider uppercase px-8 py-4 rounded-full"
          >
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </main>
  )
}