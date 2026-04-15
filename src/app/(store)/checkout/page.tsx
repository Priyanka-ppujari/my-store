'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Check, Lock, ChevronRight } from 'lucide-react'
import { useCart } from '@/store/cart'

const steps = ['Shipping', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const { items, total, clearCart } = useCart()
  const cartTotal = total()
  const shipping = cartTotal >= 150 ? 0 : 15

  const handleNext = async () => {
  if (currentStep < 2) {
    setCurrentStep(currentStep + 1)
  } else {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setIsProcessing(false)
    }
  }
}

  if (isDone) {
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
          <h1 className="font-serif text-4xl text-white mb-4">Order Confirmed</h1>
          <p className="text-white/40 mb-8">
            Thank you for your purchase. Youll receive a confirmation email shortly.
          </p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-[#D4A853] text-black font-semibold tracking-wider uppercase px-8 py-4 rounded-full"
          >
            Back to Home
          </motion.a>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl text-white mb-8"
          >
            Checkout
          </motion.h1>

          {/* Step Indicators */}
          <div className="flex items-center gap-0">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center">
                <motion.button
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{
                      backgroundColor: i <= currentStep ? '#D4A853' : 'transparent',
                      borderColor: i <= currentStep ? '#D4A853' : 'rgba(255,255,255,0.1)',
                    }}
                    className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold"
                  >
                    {i < currentStep ? (
                      <Check size={12} className="text-black" />
                    ) : (
                      <span className={i === currentStep ? 'text-black' : 'text-white/30'}>
                        {i + 1}
                      </span>
                    )}
                  </motion.div>
                  <span className={`text-xs tracking-widest uppercase ${i === currentStep ? 'text-white' : 'text-white/30'}`}>
                    {step}
                  </span>
                </motion.button>
                {i < steps.length - 1 && (
                  <div className="w-12 h-px bg-white/10 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {['First Name', 'Last Name'].map((label) => (
                      <div key={label}>
                        <label className="text-white/30 text-xs tracking-wider uppercase block mb-2">{label}</label>
                        <input
                          type="text"
                          className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4A853]/50 transition-colors"
                          placeholder={label}
                        />
                      </div>
                    ))}
                  </div>
                  {[['Email', 'email', 'your@email.com'], ['Address', 'text', '123 Main Street'], ['City', 'text', 'New York']].map(([label, type, placeholder]) => (
                    <div key={label}>
                      <label className="text-white/30 text-xs tracking-wider uppercase block mb-2">{label}</label>
                      <input
                        type={type}
                        className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4A853]/50 transition-colors"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-medium tracking-wider uppercase text-sm">
                      Payment Details
                    </h2>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Lock size={10} />
                      <span>Secured</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/30 text-xs tracking-wider uppercase block mb-2">Card Number</label>
                    <input
                      type="text"
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4A853]/50 transition-colors"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['Expiry', 'MM / YY'], ['CVV', '•••']].map(([label, placeholder]) => (
                      <div key={label}>
                        <label className="text-white/30 text-xs tracking-wider uppercase block mb-2">{label}</label>
                        <input
                          type="text"
                          className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4A853]/50 transition-colors"
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                    Review Order
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center bg-[#0D0D0D] rounded-xl p-3 border border-white/5">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <p className="text-white/30 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-white text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={isProcessing}
              className="mt-8 w-full flex items-center justify-center gap-3 bg-[#D4A853] hover:bg-[#C4943F] disabled:opacity-70 text-black font-semibold tracking-wider uppercase py-4 rounded-xl transition-colors duration-200"
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                />
              ) : (
                <>
                  {currentStep === 2 ? 'Place Order' : 'Continue'}
                  <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-6 sticky top-28">
              <h3 className="text-white/50 text-xs tracking-widest uppercase mb-4">Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-white/40">Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
                    {shipping === 0 ? 'Free' : `$${shipping}`}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-medium">
                  <span className="text-white">Total</span>
                  <span className="text-white text-lg">${(cartTotal + shipping).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}