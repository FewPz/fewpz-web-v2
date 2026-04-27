import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env', quiet: true })
config({ path: '.env.local', override: true, quiet: true })

const databaseUrl =
  process.env.DATABASE_URL
  ?? process.env.POSTGRES_URL
  ?? process.env.DATABASE_URI

const normalizedDatabaseUrl = databaseUrl?.replace(/^['\"]|['\"]$/g, '')

if (!normalizedDatabaseUrl) {
  throw new Error(
    'Missing database URL. Set DATABASE_URL in .env or .env.local before running drizzle-kit commands.',
  )
}

try {
  new URL(normalizedDatabaseUrl)
} catch {
  throw new Error(
    'Invalid DATABASE_URL format. If your password contains special characters (for example @, #, !, :), percent-encode them in the URL (for example @ -> %40, # -> %23, ! -> %21).',
  )
}

export default defineConfig({
  out: './drizzle',
  schema: './lib/db/schema/**/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: normalizedDatabaseUrl,
  },
  strict: true,
  verbose: true,
})
