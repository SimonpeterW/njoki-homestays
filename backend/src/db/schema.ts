import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  timestamp,
  varchar,
  date,
} from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'

export const unitsTable = pgTable('units', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  maxGuests: integer('max_guests').notNull(),
  location: text('location').notNull(),
  image: text('image'),
  amenities: text('amenities'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const bookingsTable = pgTable('bookings', {
  id: serial('id').primaryKey(),
  referenceNumber: varchar('reference_number', { length: 20 }).unique(),
  unitId: integer('unit_id')
    .references(() => unitsTable.id)
    .notNull(),
  guestEmail: text('guest_email').notNull(),
  guestName: text('guest_name').notNull(),
  guestPhone: text('guest_phone'),
  checkInDate: date('check_in_date').notNull(),
  checkOutDate: date('check_out_date').notNull(),
  numberOfGuests: integer('number_of_guests').notNull(),
  status: text('status').default('pending').notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }),
  specialRequests: text('special_requests'),
  paymentStatus: text('payment_status').default('unpaid').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const reviewsTable = pgTable('reviews', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id')
    .references(() => bookingsTable.id)
    .notNull(),
  unitId: integer('unit_id')
    .references(() => unitsTable.id)
    .notNull(),
  guestEmail: text('guest_email').notNull(),
  guestName: text('guest_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
