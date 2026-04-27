import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/lib/db/schema'

const rawDatabaseUrl =
  process.env.DATABASE_URL
  ?? process.env.POSTGRES_URL
  ?? process.env.DATABASE_URI

const databaseUrl = rawDatabaseUrl?.replace(/^['\"]|['\"]$/g, '')

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL for database connection')
}

const client = postgres(databaseUrl, {
  prepare: false,
})

export const db = drizzle(client, { schema })
