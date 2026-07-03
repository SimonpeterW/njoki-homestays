import {
    pgTable,
    serial,
    text,
    numeric,
    integer,
    timestamp,
    varchar,
    date,
    check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Units Table - Stores all rental units
export const unitsTable = pgTable('units', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    bedrooms: integer('bedrooms').notNull(),
    bathrooms: integer('bathrooms').notNull(),
    maxGuests: integer('max_guests').notNull(),
    location: text('location').notNull(), // Nyahururu, Rumuruti, Nanyuki
    image: text('image'),
    amenities: text('amenities'), // CSV: WiFi,Parking,Kitchen,etc
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

// Bookings Table - Stores all booking requests
export const bookingsTable = pgTable(
    'bookings',
    {
        id: serial('id').primaryKey(),
        referenceNumber: varchar('reference_number', { length: 20 }).unique(),
        unitId: integer('unit_id')
            .notNull()
            .references(() => unitsTable.id, { onDelete: 'cascade' }),
        guestEmail: text('guest_email').notNull(),
        guestName: text('guest_name').notNull(),
        guestPhone: text('guest_phone'),
        checkInDate: date('check_in_date', { mode: 'string' }).notNull(),
        checkOutDate: date('check_out_date', { mode: 'string' }).notNull(),
        numberOfGuests: integer('number_of_guests').notNull(),
        status: text('status').default('pending').notNull(), // pending, confirmed, cancelled, completed
        totalPrice: numeric('total_price', { precision: 10, scale: 2 }),
        specialRequests: text('special_requests'),
        paymentStatus: text('payment_status').default('unpaid').notNull(), // paid, unpaid
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        // Constraint: Check that checkout is after checkin
        checkDateOrder: check(
            'check_date_order',
            sql`${table.checkOutDate} > ${table.checkInDate}`
        ),
        // Constraint: Prevent double bookings for confirmed bookings
        uniqueBookingPeriod: sql`UNIQUE(unit_id, check_in_date, check_out_date) WHERE status = 'confirmed'`,
    })
)

// Reviews Table - Stores guest reviews
export const reviewsTable = pgTable(
    'reviews',
    {
        id: serial('id').primaryKey(),
        bookingId: integer('booking_id')
            .notNull()
            .references(() => bookingsTable.id, { onDelete: 'cascade' }),
        unitId: integer('unit_id')
            .notNull()
            .references(() => unitsTable.id, { onDelete: 'cascade' }),
        guestEmail: text('guest_email').notNull(),
        guestName: text('guest_name').notNull(),
        rating: integer('rating').notNull(), // 1-5 stars
        comment: text('comment'),
        status: text('status').default('pending').notNull(), // pending, approved, rejected
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => ({
        // Constraint: Rating must be between 1 and 5
        ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
    })
)

// Export types for TypeScript
export type Unit = typeof unitsTable.$inferSelect
export type NewUnit = typeof unitsTable.$inferInsert

export type Booking = typeof bookingsTable.$inferSelect
export type NewBooking = typeof bookingsTable.$inferInsert

export type Review = typeof reviewsTable.$inferSelect
export type NewReview = typeof reviewsTable.$inferInsert