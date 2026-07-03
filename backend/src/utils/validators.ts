import { z } from 'zod'

/**
 * Zod validation schemas for request validation
 * These schemas ensure data integrity and provide type-safe validation
 */

// ============================================================================
// UNIT VALIDATION SCHEMAS
// ============================================================================

export const createUnitSchema = z.object({
    name: z.string().min(3, 'Unit name must be at least 3 characters').max(100),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    bedrooms: z.number().int().min(1, 'Must have at least 1 bedroom'),
    bathrooms: z.number().int().min(1, 'Must have at least 1 bathroom'),
    max_guests: z.number().int().min(1, 'Must accommodate at least 1 guest'),
    location: z.enum(['Nyahururu', 'Rumuruti', 'Nanyuki'], {
        errorMap: () => ({ message: 'Invalid location. Must be Nyahururu, Rumuruti, or Nanyuki' }),
    }),
    image: z.string().url().optional(),
    amenities: z.string().optional(),
})

export const updateUnitSchema = createUnitSchema.partial()

export const unitFilterSchema = z.object({
    location: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    bedrooms: z.coerce.number().int().min(1).optional(),
    minGuests: z.coerce.number().int().min(1).optional(),
})

// ============================================================================
// BOOKING VALIDATION SCHEMAS
// ============================================================================

export const createBookingSchema = z
    .object({
        unit_id: z.number().int().positive('Unit ID must be a positive number'),
        guest_name: z
            .string()
            .min(2, 'Guest name must be at least 2 characters')
            .max(100, 'Guest name must be less than 100 characters')
            .regex(/^[a-zA-Z\s'-]+$/, 'Guest name can only contain letters, spaces, hyphens, and apostrophes'),
        guest_email: z
            .string()
            .email('Invalid email address')
            .toLowerCase(),
        guest_phone: z
            .string()
            .regex(/^(\+254|0)[0-9]{9}$/, 'Invalid Kenya phone number (format: +254... or 0...)')
            .optional(),
        check_in_date: z
            .string()
            .refine((date) => {
                const d = new Date(date)
                return d instanceof Date && !isNaN(d.getTime())
            }, 'Invalid check-in date'),
        check_out_date: z
            .string()
            .refine((date) => {
                const d = new Date(date)
                return d instanceof Date && !isNaN(d.getTime())
            }, 'Invalid check-out date'),
        number_of_guests: z
            .number()
            .int()
            .min(1, 'Must have at least 1 guest')
            .max(20, 'Maximum 20 guests allowed'),
        special_requests: z
            .string()
            .max(500, 'Special requests must be less than 500 characters')
            .optional(),
    })
    .refine(
        (data) => {
            const checkIn = new Date(data.check_in_date)
            const checkOut = new Date(data.check_out_date)
            return checkOut > checkIn
        },
        {
            message: 'Check-out date must be after check-in date',
            path: ['check_out_date'],
        }
    )
    .refine(
        (data) => {
            const checkIn = new Date(data.check_in_date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return checkIn >= today
        },
        {
            message: 'Check-in date cannot be in the past',
            path: ['check_in_date'],
        }
    )

export const updateBookingStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
    payment_status: z.enum(['paid', 'unpaid']).optional(),
})

export const bookingReferenceSchema = z.object({
    reference: z.string().regex(/^BOOK#\d+$/, 'Invalid reference number format'),
    email: z.string().email('Invalid email').optional(),
})

// ============================================================================
// REVIEW VALIDATION SCHEMAS
// ============================================================================

export const createReviewSchema = z
    .object({
        reference_number: z
            .string()
            .regex(/^BOOK#\d+$/, 'Invalid reference number format'),
        guest_email: z
            .string()
            .email('Invalid email address')
            .toLowerCase(),
        guest_name: z
            .string()
            .min(2, 'Guest name must be at least 2 characters')
            .max(100),
        rating: z
            .number()
            .int()
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5'),
        comment: z
            .string()
            .min(10, 'Comment must be at least 10 characters')
            .max(1000, 'Comment must be less than 1000 characters')
            .optional(),
    })
    .refine(
        (data) => {
            // Rating 1-2 might not require a comment, but 3+ should have some detail
            if (data.rating >= 3 && !data.comment) {
                return true // Allow without comment for now
            }
            return true
        },
        {
            message: 'Comment recommended for rating 3 or above',
            path: ['comment'],
        }
    )

export const updateReviewStatusSchema = z.object({
    status: z.enum(['approved', 'rejected']),
    rejectReason: z.string().optional(),
})

// ============================================================================
// PAGINATION VALIDATION SCHEMA
// ============================================================================

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
})

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validate and parse input with error handling
 */
export async function validateInput<T>(schema: z.ZodSchema, data: unknown): Promise<T> {
    try {
        return await schema.parseAsync(data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            throw new Error(JSON.stringify(fieldErrors))
        }
        throw error
    }
}

/**
 * Safely validate input and return validation result
 */
export function safeValidate<T>(schema: z.ZodSchema, data: unknown) {
    return schema.safeParse(data)
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: string, endDate: string): boolean {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return false
    }

    return end > start
}

/**
 * Validate email format (additional to Zod)
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number (Kenya format)
 */
export function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+254|0)[0-9]{9}$/
    return phoneRegex.test(phone)
}

/**
 * Validate price (must be positive number)
 */
export function isValidPrice(price: number | string): boolean {
    const num = typeof price === 'string' ? parseFloat(price) : price
    return !isNaN(num) && num > 0
}

/**
 * Validate rating (1-5)
 */
export function isValidRating(rating: number): boolean {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5
}

/**
 * Validate guest count
 */
export function isValidGuestCount(count: number): boolean {
    return Number.isInteger(count) && count >= 1 && count <= 20
}

/**
 * Validate location
 */
export function isValidLocation(location: string): boolean {
    return ['Nyahururu', 'Rumuruti', 'Nanyuki'].includes(location)
}

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .substring(0, 1000) // Limit length
}

/**
 * Validate booking status
 */
export function isValidBookingStatus(status: string): boolean {
    return ['pending', 'confirmed', 'cancelled', 'completed'].includes(status)
}

/**
 * Validate payment status
 */
export function isValidPaymentStatus(status: string): boolean {
    return ['paid', 'unpaid'].includes(status)
}

/**
 * Validate review status
 */
export function isValidReviewStatus(status: string): boolean {
    return ['pending', 'approved', 'rejected'].includes(status)
}

// ============================================================================
// EXPORT SCHEMAS
// ============================================================================

export const schemas = {
    // Units
    createUnit: createUnitSchema,
    updateUnit: updateUnitSchema,
    unitFilter: unitFilterSchema,

    // Bookings
    createBooking: createBookingSchema,
    updateBookingStatus: updateBookingStatusSchema,
    bookingReference: bookingReferenceSchema,

    // Reviews
    createReview: createReviewSchema,
    updateReviewStatus: updateReviewStatusSchema,

    // Pagination
    pagination: paginationSchema,
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateUnitInput = z.infer<typeof createUnitSchema>
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>
export type UnitFilterInput = z.infer<typeof unitFilterSchema>

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>
export type BookingReferenceInput = z.infer<typeof bookingReferenceSchema>

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>

export type PaginationInput = z.infer<typeof paginationSchema>