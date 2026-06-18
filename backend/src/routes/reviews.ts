import { Hono } from 'hono'
import { createReviewSchema } from '@/utils/validators'

const router = new Hono()

// POST /api/reviews - Submit review
router.post('/', async (c) => {
  try {
    const body = await c.req.json()

    // Validate input
    const validation = createReviewSchema.safeParse(body)
    if (!validation.success) {
      return c.json({ errors: validation.error.errors }, 400)
    }

    const data = validation.data

    // In real app, save to database
    return c.json(
      {
        success: true,
        message: 'Review submitted. It will be published after moderation.',
      },
      201
    )
  } catch (error) {
    console.error('Error submitting review:', error)
    return c.json({ error: 'Failed to submit review' }, 500)
  }
})

// GET /api/reviews/:unitId - Get unit reviews
router.get('/:unitId', async (c) => {
  try {
    const unitId = c.req.param('unitId')

    // In real app, fetch from database
    return c.json({
      unitId,
      reviews: [
        {
          id: 1,
          guestName: 'John Kamau',
          rating: 5,
          comment: 'Amazing place!',
          date: '2024-06-01',
        },
      ],
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return c.json({ error: 'Failed to fetch reviews' }, 500)
  }
})

export default router
