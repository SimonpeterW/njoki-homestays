import { Hono } from 'hono'
import { db } from '@/db'
import { unitsTable } from '@/db/schema'

const router = new Hono()

// GET /api/units - List all units
router.get('/', async (c) => {
  try {
    const location = c.req.query('location')
    const minPrice = c.req.query('minPrice')
    const maxPrice = c.req.query('maxPrice')
    const bedrooms = c.req.query('bedrooms')

    let query = db.select().from(unitsTable)

    if (location) {
      // Build query with filters
      const units = await query
      const filtered = units.filter((unit) => {
        if (location && unit.location !== location) return false
        if (minPrice && parseFloat(unit.price) < parseFloat(minPrice))
          return false
        if (maxPrice && parseFloat(unit.price) > parseFloat(maxPrice))
          return false
        if (bedrooms && unit.bedrooms !== parseInt(bedrooms)) return false
        return true
      })
      return c.json(filtered)
    }

    const units = await query
    return c.json(units)
  } catch (error) {
    console.error('Error fetching units:', error)
    return c.json({ error: 'Failed to fetch units' }, 500)
  }
})

// GET /api/units/:id - Get single unit
router.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const units = await db.select().from(unitsTable)
    const unit = units.find((u) => u.id === id)

    if (!unit) {
      return c.json({ error: 'Unit not found' }, 404)
    }

    return c.json(unit)
  } catch (error) {
    console.error('Error fetching unit:', error)
    return c.json({ error: 'Failed to fetch unit' }, 500)
  }
})

export default router
