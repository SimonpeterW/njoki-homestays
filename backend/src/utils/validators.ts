import { z } from 'zod'

export const createBookingSchema = z.object({
  unit_id: z.number().positive('Unit ID must be positive'),
  guest_name: z.string().min(2, 'Name must be at least 2 characters'),
  guest_email: z.string().email('Invalid email'),
  guest_phone: z.string().optional(),
  check_in_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Invalid check-in date'
  ),
  check_out_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Invalid check-out date'
  ),
  number_of_guests: z
    .number()
    .min(1, 'At least 1 guest')
    .max(10, 'Maximum 10 guests'),
  special_requests: z.string().optional(),
})

export const createReviewSchema = z.object({
  reference_number: z.string(),
  guest_email: z.string().email('Invalid email'),
  guest_name: z.string().min(2),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
})

export const createUnitSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.string(),
  bedrooms: z.number().positive(),
  bathrooms: z.number().positive(),
  maxGuests: z.number().positive(),
  location: z.enum(['Nyahururu', 'Rumuruti', 'Nanyuki']),
  image: z.string().optional(),
  amenities: z.string().optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type CreateUnitInput = z.infer<typeof createUnitSchema>
