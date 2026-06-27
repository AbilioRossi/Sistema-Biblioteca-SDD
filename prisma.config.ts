import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrate: {
    adapter: async () => {
      const { PrismaNeon } = await import('@prisma/adapter-neon')
      const { neon } = await import('@neondatabase/serverless')
      const connectionString = process.env.DATABASE_URL!
      const neonPool = neon(connectionString)
      return new PrismaNeon(neonPool)
    },
  },
})
