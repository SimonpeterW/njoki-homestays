import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from './schema'

let client: Client
let db: ReturnType<typeof drizzle> | null = null

export async function initDatabase() {
    if (db) return db

    try {
        client = new Client({
            connectionString: process.env.DATABASE_URL,
        })

        await client.connect()
        db = drizzle(client, { schema })

        console.log('✅ Database connected')
        return db
    } catch (error) {
        console.error('❌ Database error:', error)
        throw error
    }
}

export async function getDb() {
    if (!db) return initDatabase()
    return db
}
