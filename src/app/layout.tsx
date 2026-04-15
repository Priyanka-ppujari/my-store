import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/navbar'
import CartDrawer from '@/components/cart/cart-drawer'
import TrpcProvider from '@/lib/trpc-provider'

export const dynamic = 'force-dynamic'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir — Premium Fashion',
  description: 'Luxury fashion and accessories',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-[#080808] text-white antialiased font-sans">
        <TrpcProvider>
          <Navbar />
          <CartDrawer />
          {children}
        </TrpcProvider>
      </body>
    </html>
  )
}