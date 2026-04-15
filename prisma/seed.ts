import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  await db.product.deleteMany()

  await db.product.createMany({
    data: [
      {
        name: 'Obsidian Leather Jacket',
        price: 289,
        originalPrice: 389,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
        category: 'Clothing',
        description: 'Premium full-grain leather jacket with a sleek obsidian finish.',
        rating: 4.9,
        reviews: 128,
        badge: 'Sale',
        stock: 10,
      },
      {
        name: 'Aureate Watch',
        price: 549,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
        category: 'Accessories',
        description: 'Swiss-movement timepiece with a brushed gold case and sapphire crystal glass.',
        rating: 5.0,
        reviews: 64,
        badge: 'Limited',
        stock: 5,
      },
      {
        name: 'Noir Suede Boots',
        price: 199,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        category: 'Footwear',
        description: 'Italian suede Chelsea boots with a stacked leather heel.',
        rating: 4.7,
        reviews: 213,
        badge: 'Hot',
        stock: 15,
      },
      {
        name: 'Cashmere Turtleneck',
        price: 149,
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80',
        category: 'Clothing',
        description: '100% Grade-A Mongolian cashmere. Ribbed collar, cuffs and hem.',
        rating: 4.8,
        reviews: 89,
        badge: 'New',
        stock: 20,
      },
      {
        name: 'Structured Tote Bag',
        price: 319,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
        category: 'Bags',
        description: 'Full-grain pebbled leather tote with gold hardware.',
        rating: 4.9,
        reviews: 156,
        stock: 8,
      },
      {
        name: 'Silk Scarf',
        price: 89,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80',
        category: 'Accessories',
        description: 'Hand-rolled edges on 100% mulberry silk. 90cm x 90cm.',
        rating: 4.6,
        reviews: 47,
        badge: 'New',
        stock: 25,
      },
      {
        name: 'Wool Overcoat',
        price: 449,
        originalPrice: 599,
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
        category: 'Clothing',
        description: 'Double-breasted wool-cashmere blend overcoat. Fully lined.',
        rating: 4.8,
        reviews: 72,
        badge: 'Sale',
        stock: 6,
      },
      {
        name: 'Minimalist Sneakers',
        price: 159,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
        category: 'Footwear',
        description: 'Premium leather uppers with a vulcanized rubber sole.',
        rating: 4.7,
        reviews: 198,
        badge: 'Hot',
        stock: 30,
      },
    ],
  })

  console.log('✅ Seeded 8 products!')
  await db.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})