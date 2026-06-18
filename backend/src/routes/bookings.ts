import { Hono } from 'hono'
import { db } from '@/db'
import { bookingsTable, unitsTable } from '@/db/schema'
import { createBookingSchema, CreateBookingInput } from '@/utils/validators'
import { sendBookingConfirmation } from '@/services/emailService'

const router = new Hono()

// Helper to generate reference number
function generateReferenceNumber(id: number): string {
  return \`BOOK#\${id}\`
}

// Helper to calculate nights
function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

// POST /api/bookings - Create booking
router.post('/', async (c) => {
  try {
    const body = await c.req.json()

    // Validate input
    const validation = createBookingSchema.safeParse(body)
    if (!validation.success) {
      return c.json({ errors: validation.error.errors }, 400)
    }

    const data = validation.data

    // Check if unit exists
    const units = await db.select().from(unitsTable)
    const unit = units.find((u) => u.id === data.unit_id)

    if (!unit) {
      return c.json({ error: 'Unit not found' }, 404)
    }

    // Calculate price
    const nights = calculateNights(data.check_in_date, data.check_out_date)
    const totalPrice = (parseFloat(unit.price) * nights).toFixed(2)

    // Create booking record (in real app, insert to DB)
    const bookingId = Math.floor(Math.random() * 10000) + 1000
    const referenceNumber = generateReferenceNumber(bookingId)

    // Send confirmation email
    await sendBookingConfirmation({
      referenceNumber,
      guestName: data.guest_name,
      guestEmail: data.guest_email,
      unitName: unit.name,
      checkInDate: data.check_in_date,
      checkOutDate: data.check_out_date,
      totalPrice,
      nights,
    })

    return c.json(
      {
        success: true,
        booking_id: bookingId,
        reference_number: referenceNumber,
        message: 'Booking submitted. Check your email for confirmation.',
        confirmation_sent_to: data.guest_email,
      },
      201
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return c.json({ error: 'Failed to create booking' }, 500)
  }
})

// GET /api/bookings/:reference - Get booking status
router.get('/:reference', async (c) => {
  try {
    const reference = c.req.param('reference')
    const email = c.req.query('email')

    // In real app, fetch from DB
    // For now, return mock data
    if (!reference.startsWith('BOOK#')) {
      return c.json({ error: 'Invalid reference number' }, 400)
    }

    return c.json({
      reference_number: reference,
      guest_email: email || 'guest@example.com',
      status: 'pending',
      message: 'Your booking is under review',
    })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return c.json({ error: 'Failed to fetch booking' }, 500)
  }
})

export default router
