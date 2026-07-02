import { Hono } from 'hono'
import { getDb } from '@/db'
import { bookingsTable, unitsTable } from '@/db/schema'
import { eq, and, lt, gt } from 'drizzle-orm'
import { createBookingSchema } from '@/utils/validators'

const router = new Hono()

function generateRef(id: number) {
  return `BOOK#${id}`
}

function calcNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

router.post('/', async (c) => {
  try {
    const db = await getDb()
    const body = await c.req.json()

    const validation = createBookingSchema.safeParse(body)
    if (!validation.success) {
      return c.json({ success: false, error: 'Invalid data', details: validation.error.errors }, 400)
    }

    const data = validation.data

    const unit = await db.select().from(unitsTable).where(eq(unitsTable.id, data.unit_id)).limit(1)
    if (unit.length === 0) {
      return c.json({ success: false, error: 'Unit not found' }, 404)
    }

    const overlapping = await db
      .select()
      .from(bookingsTable)
      .where(
        and(
          eq(bookingsTable.unitId, data.unit_id),
          eq(bookingsTable.status, 'confirmed'),
          lt(bookingsTable.checkInDate, data.check_out_date),
          gt(bookingsTable.checkOutDate, data.check_in_date)
        )
      )

    if (overlapping.length > 0) {
      return c.json({ success: false, error: 'Unit not available for dates' }, 409)
    }

    const nights = calcNights(data.check_in_date, data.check_out_date)
    if (nights <= 0) {
      return c.json({ success: false, error: 'Check-out must be after check-in' }, 400)
    }

    const unitPrice = parseFloat(unit[0].price)
    const totalPrice = (unitPrice * nights).toFixed(2)

    const result = await db
      .insert(bookingsTable)
      .values({
        unitId: data.unit_id,
        guestEmail: data.guest_email,
        guestName: data.guest_name,
        guestPhone: data.guest_phone,
        checkInDate: data.check_in_date,
        checkOutDate: data.check_out_date,
        numberOfGuests: data.number_of_guests,
        totalPrice: totalPrice,
        specialRequests: data.special_requests,
        status: 'pending',
        paymentStatus: 'unpaid',
      })
      .returning()

    const booking = result[0]
    const refNum = generateRef(booking.id)

    await db.update(bookingsTable).set({ referenceNumber: refNum }).where(eq(bookingsTable.id, booking.id))

    return c.json(
      {
        success: true,
        data: {
          booking_id: booking.id,
          reference_number: refNum,
          status: 'pending',
          total_price: totalPrice,
          message: 'Booking created. Check email for confirmation.',
        },
      },
      201
    )
  } catch (error) {
    console.error('Error:', error)
    return c.json({ success: false, error: 'Failed to create booking' }, 500)
  }
})

router.get('/:reference', async (c) => {
  try {
    const db = await getDb()
    const reference = c.req.param('reference')
    const email = c.req.query('email')

    if (!reference.startsWith('BOOK#')) {
      return c.json({ success: false, error: 'Invalid reference' }, 400)
    }

    const booking = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.referenceNumber, reference))
      .limit(1)

    if (booking.length === 0) {
      return c.json({ success: false, error: 'Booking not found' }, 404)
    }

    const data = booking[0]

    if (email && data.guestEmail !== email) {
      return c.json({ success: false, error: 'Email mismatch' }, 401)
    }

    return c.json({
      success: true,
      data: {
        reference_number: data.referenceNumber,
        guest_name: data.guestName,
        guest_email: data.guestEmail,
        check_in_date: data.checkInDate,
        check_out_date: data.checkOutDate,
        number_of_guests: data.numberOfGuests,
        status: data.status,
        payment_status: data.paymentStatus,
        total_price: data.totalPrice,
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return c.json({ success: false, error: 'Failed to fetch booking' }, 500)
  }
})

export default router