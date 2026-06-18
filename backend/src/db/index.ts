import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from './schema'

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(client, { schema })

export async function initDatabase() {
  try {
    await client.connect()
    console.log('✓ Database connected')
  } catch (error) {
    console.error('✗ Database connection failed:', error)
    throw error
  }
}

export async function closeDatabase() {
  await client.end()
}

export { schema }
