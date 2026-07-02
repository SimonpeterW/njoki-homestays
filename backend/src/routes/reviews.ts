import { Hono } from 'hono'
import { getDb } from '@/db'
import { reviewsTable, bookingsTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { createReviewSchema } from '@/utils/validators'

const router = new Hono()

router.post('/', async (c) => {
  try {
    const db = await getDb()
    const body = await c.req.json()

    const validation = createReviewSchema.safeParse(body)
    if (!validation.success) {
      return c.json({ success: false, error: 'Invalid data' }, 400)
    }

    const data = validation.data

    const booking = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.referenceNumber, data.reference_number))
      .limit(1)

    if (booking.length === 0) {
      return c.json({ success: false, error: 'Booking not found' }, 404)
    }

    if (booking[0].guestEmail !== data.guest_email) {
      return c.json({ success: false, error: 'Email mismatch' }, 401)
    }

    const result = await db
      .insert(reviewsTable)
      .values({
        bookingId: booking[0].id,
        unitId: booking[0].unitId,
        guestEmail: data.guest_email,
        guestName: data.guest_name,
        rating: data.rating,
        comment: data.comment,
        status: 'pending',
      })
      .returning()

    return c.json({ success: true, data: { review_id: result[0].id, status: 'pending' } }, 201)
  } catch (error) {
    console.error('Error:', error)
    return c.json({ success: false, error: 'Failed to submit review' }, 500)
  }
})

router.get('/:unitId', async (c) => {
  try {
    const db = await getDb()
    const unitId = parseInt(c.req.param('unitId'))

    if (isNaN(unitId)) {
      return c.json({ success: false, error: 'Invalid unit ID' }, 400)
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(and(eq(reviewsTable.unitId, unitId), eq(reviewsTable.status, 'approved')))

    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

    return c.json({
      success: true,
      data: {
        unit_id: unitId,
        average_rating: avgRating,
        total_reviews: reviews.length,
        reviews: reviews.map((r) => ({
          id: r.id,
          guest_name: r.guestName,
          rating: r.rating,
          comment: r.comment,
          created_at: r.createdAt,
        })),
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return c.json({ success: false, error: 'Failed to fetch reviews' }, 500)
  }
})

export default router