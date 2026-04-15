import { router, publicProcedure } from '../trpc'
import { db } from '../db'
import { z } from 'zod'

export const productRouter = router({
  getAll: publicProcedure.query(async () => {
    return db.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.product.findUnique({
        where: { id: input.id },
      })
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return db.product.findMany({
        where: { category: input.category },
        orderBy: { createdAt: 'desc' },
      })
    }),
})