'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, User, LogOut } from 'lucide-react'
import { useCart } from '@/store/cart'

interface NavbarClientProps {
  user?: {
    name?: string | null
    image?: string | null
    email?: string | null
  } | null
}

// Returns false on server, true on client — no useEffect or setState needed
function subscribe() { return () => {} }
function useIsMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const mounted = useIsMounted()
  const { count, toggleCart } = useCart()
  const cartCount = count()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/products', label: 'Shop' },
    { href: '/products?category=Clothing', label: 'Clothing' },
    { href: '/products?category=Accessories', label: 'Accessories' },
    { href: '/products?category=Footwear', label: 'Footwear' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-[#D4A853]/20 py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="font-serif text-2xl tracking-[0.2em] text-white uppercase"
            >
              Noir<span className="text-[#D4A853]">.</span>
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <Link
                  href={link.href}
                  className="relative text-sm tracking-widest text-white/70 uppercase hover:text-white transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4A853] transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Search size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative text-white/70 hover:text-white transition-colors"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {mounted && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-[#D4A853] text-black text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? 'User'}
                    width={28}
                    height={28}
                    className="rounded-full border border-[#D4A853]/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#D4A853]/20 flex items-center justify-center">
                    <User size={14} className="text-[#D4A853]" />
                  </div>
                )}
                <form action="/api/auth/signout" method="POST">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <LogOut size={16} />
                  </motion.button>
                </form>
              </div>
            ) : (
              <Link href="/api/auth/signin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs tracking-widest uppercase border border-white/20 text-white/60 hover:text-white hover:border-white/50 px-4 py-2 rounded-full transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(true)}
              className="md:hidden text-white/70 hover:text-white transition-colors"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-2xl tracking-[0.2em] text-white uppercase">
                Noir<span className="text-[#D4A853]">.</span>
              </span>
              <button onClick={() => setMenuOpen(false)} className="text-white/70">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-serif text-white hover:text-[#D4A853] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
              >
                {user ? (
                  <form action="/api/auth/signout" method="POST">
                    <button className="text-3xl font-serif text-white/40 hover:text-rose-400 transition-colors">
                      Sign Out
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-serif text-white hover:text-[#D4A853] transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}