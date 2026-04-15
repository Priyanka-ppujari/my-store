import { router } from '../trpc'
import { productRouter } from './product'
import { adminRouter } from './admin'

export const appRouter = router({
  product: productRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter