import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    adapter: () => adapter,
  },
})