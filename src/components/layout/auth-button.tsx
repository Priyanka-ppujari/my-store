'use client'

import { motion } from 'framer-motion'
import { User, LogOut } from 'lucide-react'
import Image from 'next/image'

interface AuthButtonProps {
  user?: {
    name?: string | null
    image?: string | null
    email?: string | null
  } | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  return user ? (
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
      <form action={async () => {
        'use server'
        const { signOut } = await import('@/server/auth')
        await signOut({ redirectTo: '/' })
      }}>
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
    <form action={async () => {
      'use server'
      const { signIn } = await import('@/server/auth')
      await signIn('google', { redirectTo: '/' })
    }}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="text-xs tracking-widest uppercase border border-white/20 text-white/60 hover:text-white hover:border-white/50 px-4 py-2 rounded-full transition-colors"
      >
        Sign In
      </motion.button>
    </form>
  )
}