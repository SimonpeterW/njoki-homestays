import { Hono } from 'hono'
import { getDb } from '@/db'
import { unitsTable } from '@/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'

const router = new Hono()

router.get('/', async (c) => {
  try {
    const db = await getDb()
    const location = c.req.query('location')
    const minPrice = c.req.query('minPrice')
    const maxPrice = c.req.query('maxPrice')

    const conditions = []
    if (location) conditions.push(eq(unitsTable.location, location))
    if (minPrice) conditions.push(gte(unitsTable.price, minPrice))
    if (maxPrice) conditions.push(lte(unitsTable.price, maxPrice))

    let query = db.select().from(unitsTable)
    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const units = await query
    return c.json({ success: true, count: units.length, data: units })
  } catch (error) {
    console.error('Error:', error)
    return c.json({ success: false, error: 'Failed to fetch units' }, 500)
  }
})

router.get('/:id', async (c) => {
  try {
    const db = await getDb()
    const id = parseInt(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({ success: false, error: 'Invalid ID' }, 400)
    }

    const unit = await db.select().from(unitsTable).where(eq(unitsTable.id, id)).limit(1)

    if (unit.length === 0) {
      return c.json({ success: false, error: 'Unit not found' }, 404)
    }

    return c.json({ success: true, data: unit[0] })
  } catch (error) {
    console.error('Error:', error)
    return c.json({ success: false, error: 'Failed to fetch unit' }, 500)
  }
})

export default router