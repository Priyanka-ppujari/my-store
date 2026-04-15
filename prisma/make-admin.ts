import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  const result = await db.user.updateMany({
    where: {},
    data: { isAdmin: true },
  })
  console.log('Updated:', result)
  await db.$disconnect()
}

main()