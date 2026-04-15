import { router, publicProcedure } from '../trpc'
import { db } from '../db'
import { z } from 'zod'

export const adminRouter = router({
  getProducts: publicProcedure.query(async () => {
    return db.product.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  createProduct: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      originalPrice: z.number().optional(),
      image: z.string(),
      category: z.string(),
      badge: z.string().optional(),
      stock: z.number(),
    }))
    .mutation(async ({ input }) => {
      return db.product.create({ data: input })
    }),

  updateProduct: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
      originalPrice: z.number().optional(),
      image: z.string(),
      category: z.string(),
      badge: z.string().optional(),
      stock: z.number(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return db.product.update({ where: { id }, data })
    }),

  deleteProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.product.delete({ where: { id: input.id } })
    }),

  getStats: publicProcedure.query(async () => {
    const [products, users, orders] = await Promise.all([
      db.product.count(),
      db.user.count(),
      db.order.count(),
    ])
    return { products, users, orders }
  }),
})