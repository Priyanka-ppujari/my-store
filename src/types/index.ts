export type Category = 'All' | 'Clothing' | 'Accessories' | 'Footwear' | 'Bags'

export type Product = {
  id: string
  name: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  badge: string | null        // ← was badge?: string | null
  colors?: string[]
  sizes?: string[]
  stock: number
  createdAt: Date
}