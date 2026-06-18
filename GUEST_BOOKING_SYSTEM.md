# Guest Booking System - No Authentication Required

## Overview

Njoki Homestays has chosen a **guest-first booking model** where customers can browse and book units **without creating accounts or signing in**.

This document explains:
- How the system works
- Why no authentication is needed
- How customers are identified
- How payments are tracked
- How confirmations are sent

---

## Why No Authentication?

### Business Requirements
1. **Lower friction** - No password creation = more bookings
2. **Simple workflow** - Browse → Book → Pay (3 steps)
3. **Mobile-friendly** - Perfect for users on slow networks (Kenya)
4. **Admin-controlled** - Njoki staff manages all interactions
5. **Email confirmation** - Single touchpoint for verification

### Technical Benefits
- Smaller codebase
- Fewer security concerns
- Simpler infrastructure
- Faster to develop
- Easier to maintain

---

## How It Works: Guest Booking Flow

```
┌─────────────────────────────────────────┐
│  1. BROWSE (Guest, No login needed)     │
│  - View units                           │
│  - Filter by location, price, bedrooms  │
│  - See reviews from other guests        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  2. INQUIRY (Provide basic info)        │
│  - Name (required)                      │
│  - Email (required)                     │
│  - Phone (optional but recommended)     │
│  - Check-in/out dates                   │
│  - Number of guests                     │
│  - Special requests (optional)          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  3. CONFIRMATION EMAIL                  │
│  - Booking details sent to email        │
│  - Unique reference number (e.g., #5847)│
│  - Payment instructions                 │
│  - WhatsApp contact link                │
│  - Cancel/modify instructions           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  4. ADMIN REVIEW (Njoki staff)          │
│  - Check availability                   │
│  - Verify no conflicts                  │
│  - Contact guest if questions           │
│  - Confirm or request more info         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  5. PAYMENT (Guest pays)                │
│  - PayPal, M-Pesa, bank transfer       │
│  - Reference number in payment notes    │
│  - Proof sent to WhatsApp/email        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  6. FINAL CONFIRMATION                  │
│  - Booking confirmed via email          │
│  - Payment confirmed via WhatsApp       │
│  - Unit owner contacted                 │
│  - Check-in instructions sent           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  7. POST-BOOKING                        │
│  - Guest stays at unit                  │
│  - Check-out on final day               │
│  - Review request email sent (1 week)   │
│  - Guest can review without logging in  │
└─────────────────────────────────────────┘
```

---

## Guest Identification Strategy

Since there's no user account, guests are identified by:

### Primary: Email Address
- Guests provide email on booking form
- Used for all communications
- Serves as unique identifier
- No password needed

### Secondary: Reference Number
```
Example: BOOK#5847

Advantages:
✓ Short, easy to remember
✓ Guests share in conversations
✓ Used in payment references
✓ Queryable in database

Generation:
- Format: BOOK#[booking_id]
- Example: BOOK#2457, BOOK#9034
- Display on confirmation email
- Printed on receipts
```

### Verification: Email Confirmation
```
When booking submitted:
→ Send confirmation email to guest email
→ Email contains unique reference number
→ Email proves ownership of email address
→ Guest responds to that email with questions
```

### Session-Based Tracking
```
Frontend approach:
- Guest's booking data stored in localStorage
- Session-specific (expires on browser close)
- Used for form persistence during booking
- Not used for authentication

Backend approach:
- All data tied to booking record
- Email as lookup key
- Reference number as secondary key
- No session management needed
```

---

## Database Schema for Guest Bookings

### Guests Table (No accounts, just records)

```sql
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

Note: Minimal data storage (no password, no personal details)
Guests can use any email, not verified in advance
```

### Bookings Table (Core transaction record)

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(20) UNIQUE, -- BOOK#5847
  unit_id INTEGER REFERENCES units(id),
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL,
  
  status VARCHAR(50) DEFAULT 'pending', 
  -- pending → confirmed → completed → cancelled
  
  total_price DECIMAL(10, 2),
  special_requests TEXT,
  
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  payment_method VARCHAR(50), -- mpesa, bank_transfer, paypal
  payment_confirmed_at TIMESTAMP,
  
  confirmation_sent_at TIMESTAMP,
  confirmation_token VARCHAR(100), -- Backup verification
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

Indexes needed:
- INDEX idx_guest_email ON bookings(guest_email)
- INDEX idx_reference_number ON bookings(reference_number)
- INDEX idx_status ON bookings(status)
- UNIQUE idx_unique_period ON bookings(unit_id, check_in_date, check_out_date)
```

### Reviews Table (No account needed to review)

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  unit_id INTEGER REFERENCES units(id),
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  status VARCHAR(50) DEFAULT 'pending',
  -- pending → approved → rejected

  created_at TIMESTAMP DEFAULT NOW(),
  admin_reviewed_at TIMESTAMP
);
```

---

## API Endpoints for Guest Bookings

### 1. Submit Booking Inquiry

```
POST /api/bookings
Content-Type: application/json

{
  "unit_id": 1,
  "guest_name": "John Kamau",
  "guest_email": "john@example.com",
  "guest_phone": "+254712345678",
  "check_in_date": "2024-07-15",
  "check_out_date": "2024-07-18",
  "number_of_guests": 2,
  "special_requests": "Late check-in OK"
}

Response (201 Created):
{
  "success": true,
  "booking_id": 5847,
  "reference_number": "BOOK#5847",
  "message": "Booking inquiry received. Check your email for details.",
  "confirmation_sent_to": "john@example.com"
}
```

### 2. Get Booking Status (Guest lookup)

```
GET /api/bookings/BOOK#5847
OR
GET /api/bookings?email=john@example.com&ref=BOOK#5847

Response (200):
{
  "reference_number": "BOOK#5847",
  "unit_name": "Cozy Nyahururu Cottage",
  "guest_name": "John Kamau",
  "check_in_date": "2024-07-15",
  "check_out_date": "2024-07-18",
  "status": "confirmed",
  "payment_status": "pending",
  "total_price": 18000,
  "created_at": "2024-06-16",
  "special_requests": "Late check-in OK"
}

Security: No authentication needed, but could add:
- Email verification (send code, verify before showing details)
- Rate limiting (prevent data harvesting)
```

### 3. Submit Review (No account needed)

```
POST /api/reviews
Content-Type: application/json

{
  "reference_number": "BOOK#5847",
  "guest_email": "john@example.com",
  "guest_name": "John Kamau",
  "rating": 5,
  "comment": "Amazing unit, great hospitality!"
}

Response (201):
{
  "success": true,
  "review_id": 342,
  "message": "Thank you for your review. It will be published after moderation."
}
```

### 4. List Units (No authentication)

```
GET /api/units?location=Nyahururu&min_price=5000&max_price=30000

Response (200):
{
  "units": [
    {
      "id": 1,
      "name": "Cozy Cottage",
      "location": "Nyahururu",
      "price_per_night": 8000,
      "rating": 4.8,
      "reviews_count": 12,
      "image": "...",
      "bedrooms": 2,
      "bathrooms": 1
    }
  ]
}
```

---

## Security Considerations (No Auth)

### 1. Data Validation
```typescript
// Backend validation with Zod
const bookingSchema = z.object({
  unit_id: z.number().positive(),
  guest_name: z.string().min(2).max(100),
  guest_email: z.string().email(),
  guest_phone: z.string().min(10).max(20).optional(),
  check_in_date: z.string().datetime(),
  check_out_date: z.string().datetime(),
  number_of_guests: z.number().min(1).max(10),
  special_requests: z.string().max(500).optional()
})

// Validate before processing
const result = bookingSchema.safeParse(body)
if (!result.success) {
  return c.json({ error: 'Invalid data' }, 400)
}
```

### 2. Rate Limiting
```typescript
// Prevent spam bookings from single IP
import { RateLimiter } from 'hono-rate-limiter'

app.use('/api/bookings', RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 bookings per IP per 15 min
}))
```

### 3. Email Verification (Optional Enhancement)
```typescript
// Send confirmation token to email
// Guest must click link to confirm booking

POST /api/bookings → Creates booking (unconfirmed)
                  → Sends email with verification link
                  → Link contains token

GET /api/bookings/verify/:token → Confirms booking
                                → Updates booking status
                                → Sends final confirmation
```

### 4. Double-Booking Prevention
```sql
-- Prevent overlapping bookings on same unit
CREATE UNIQUE INDEX unique_booking_period ON bookings (
  unit_id,
  check_in_date,
  check_out_date
) WHERE status = 'confirmed';

-- In application, before creating booking:
SELECT COUNT(*) FROM bookings
WHERE unit_id = ? 
  AND status = 'confirmed'
  AND check_in_date < ? 
  AND check_out_date > ?
  
If count > 0, reject booking (unit not available)
```

### 5. CSRF Protection
```typescript
// No forms that modify state without verification
// All POST requests go through email verification

app.use(csrf()) // Built into Hono

// Form includes CSRF token
<form method="POST">
  <input type="hidden" name="_csrf" value={csrfToken} />
  ...
</form>
```

### 6. Rate Limiting on Lookups
```typescript
// Prevent guests from discovering all bookings
// by trying different reference numbers

// Option 1: Rate limit lookup endpoint
GET /api/bookings/:ref → 5 attempts per 15 minutes

// Option 2: Require email to lookup
GET /api/bookings/:ref?email=john@example.com
// Return nothing if email doesn't match

// Option 3: Send unique token in confirmation email
// Guests use token to check status, not reference number
```

---

## Email Confirmation System

### 1. Booking Confirmation Email Template

```html
Subject: Booking Confirmation - Njoki Homestays #5847

Dear John,

Thank you for your booking inquiry with Njoki Homestays!

BOOKING DETAILS
Booking Reference: BOOK#5847
Unit: Cozy Nyahururu Cottage
Check-in: Monday, July 15, 2024
Check-out: Thursday, July 18, 2024
Guests: 2
Total Price: KES 18,000

NEXT STEPS
1. Our team is reviewing your booking
2. We'll confirm availability within 24 hours
3. Payment instructions will be sent via WhatsApp

PAYMENT
Once confirmed, you can pay via:
- M-Pesa: 0712 345 678 (send 18000 + ref BOOK#5847)
- Bank Transfer: Account details in next email
- PayPal: Link will be sent

QUESTIONS?
WhatsApp: +254712345678
Email: bookings@njoki-homestays.com

Best regards,
Njoki Homestays Team
```

### 2. Confirmation Email (After admin approval)

```html
Subject: Booking Confirmed! - Njoki Homestays #5847

Dear John,

Great news! Your booking is confirmed! 🎉

UNIT DETAILS
Unit: Cozy Nyahururu Cottage
Address: [Full address]
Check-in: Monday, July 15, 2024 (from 2 PM)
Check-out: Thursday, July 18, 2024 (by 11 AM)

UNIT AMENITIES
✓ 2 Bedrooms
✓ 1 Bathroom
✓ Full Kitchen
✓ WiFi
✓ Parking

PAYMENT REQUIRED
Amount: KES 18,000
Reference: BOOK#5847

Payment Methods:
1. M-Pesa: 0712 345 678
2. Bank Transfer: [Account details]
3. PayPal: [Link]

After payment, email proof to: payments@njoki-homestays.com

CHECK-IN INSTRUCTIONS
Will be sent 2 days before arrival

CONTACT INFO
Owner: [Name]
WhatsApp: [Number]
Email: [Email]

See you soon!
Njoki Homestays Team
```

---

## Frontend: Guest Booking Form Component

```typescript
// app/components/BookingForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { z } from 'zod'

const bookingSchema = z.object({
  guest_name: z.string().min(2, 'Name required'),
  guest_email: z.string().email('Valid email required'),
  guest_phone: z.string().optional(),
  check_in_date: z.string(),
  check_out_date: z.string(),
  number_of_guests: z.number().min(1).max(10),
})

interface BookingFormProps {
  unitId: number
  unitName: string
  pricePerNight: number
}

export function BookingForm({ unitId, unitName, pricePerNight }: BookingFormProps) {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number_of_guests' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate form
      const validated = bookingSchema.parse(formData)

      // Submit booking
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_id: unitId,
          ...validated
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Booking failed')
      }

      const data = await res.json()
      setSuccess(true)
      
      // Show confirmation
      setTimeout(() => {
        router.push(`/booking-confirmation/${data.reference_number}`)
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <p className="text-green-800">
          ✓ Booking submitted! Check your email for confirmation.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Book {unitName}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Your Name *</label>
          <Input
            name="guest_name"
            value={formData.guest_name}
            onChange={handleChange}
            placeholder="John Kamau"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email *</label>
          <Input
            name="guest_email"
            type="email"
            value={formData.guest_email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <Input
            name="guest_phone"
            value={formData.guest_phone}
            onChange={handleChange}
            placeholder="+254712345678"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Check-in *</label>
            <Input
              name="check_in_date"
              type="date"
              value={formData.check_in_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out *</label>
            <Input
              name="check_out_date"
              type="date"
              value={formData.check_out_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Guests *</label>
          <select
            name="number_of_guests"
            value={formData.number_of_guests}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm">
            Estimated total: <strong>KES {formData.number_of_guests * pricePerNight}</strong>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            This is an estimate. Final price confirmed after booking.
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Submitting...' : 'Complete Booking'}
        </Button>
      </form>

      <p className="text-xs text-gray-600 mt-4">
        No account needed. Check your email for next steps.
      </p>
    </Card>
  )
}
```

---

## Backend: Booking Submission Endpoint

```typescript
// backend/src/routes/bookings.ts
import { Hono } from 'hono'
import { db } from '@/db'
import { bookingsTable } from '@/db/schema'
import { z } from 'zod'
import { sendEmail } from '@/services/emailService'

const router = new Hono()

const bookingSchema = z.object({
  unit_id: z.number().positive(),
  guest_name: z.string().min(2).max(100),
  guest_email: z.string().email(),
  guest_phone: z.string().optional(),
  check_in_date: z.string(),
  check_out_date: z.string(),
  number_of_guests: z.number().min(1).max(10),
  special_requests: z.string().max(500).optional(),
})

// POST /api/bookings - Submit booking inquiry
router.post('/', async (c) => {
  try {
    const body = await c.req.json()
    
    // Validate input
    const result = bookingSchema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Invalid booking data' }, 400)
    }

    const data = result.data

    // Check availability
    const conflictingBookings = await db
      .select()
      .from(bookingsTable)
      .where(
        sql`
          unit_id = ${data.unit_id}
          AND status = 'confirmed'
          AND check_in_date < ${data.check_out_date}
          AND check_out_date > ${data.check_in_date}
        `
      )

    if (conflictingBookings.length > 0) {
      return c.json({ error: 'Unit not available for selected dates' }, 409)
    }

    // Calculate price
    const checkIn = new Date(data.check_in_date)
    const checkOut = new Date(data.check_out_date)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    
    const [unit] = await db.select().from(unitsTable).where(eq(unitsTable.id, data.unit_id))
    const totalPrice = nights * parseFloat(unit.price)

    // Create booking
    const [newBooking] = await db
      .insert(bookingsTable)
      .values({
        unit_id: data.unit_id,
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        guest_phone: data.guest_phone,
        check_in_date: data.check_in_date,
        check_out_date: data.check_out_date,
        number_of_guests: data.number_of_guests,
        total_price: totalPrice,
        status: 'pending',
        special_requests: data.special_requests,
      })
      .returning()

    const referenceNumber = `BOOK#${newBooking.id}`
    
    // Update with reference number
    await db
      .update(bookingsTable)
      .set({ reference_number: referenceNumber })
      .where(eq(bookingsTable.id, newBooking.id))

    // Send confirmation email
    await sendEmail({
      to: data.guest_email,
      subject: `Booking Confirmation - ${referenceNumber}`,
      template: 'booking-confirmation',
      data: {
        referenceNumber,
        unitName: unit.name,
        guestName: data.guest_name,
        checkIn: data.check_in_date,
        checkOut: data.check_out_date,
        totalPrice,
      }
    })

    return c.json({
      success: true,
      booking_id: newBooking.id,
      reference_number: referenceNumber,
      message: 'Booking inquiry received. Check your email for details.',
      confirmation_sent_to: data.guest_email
    }, 201)

  } catch (error) {
    console.error('Booking error:', error)
    return c.json({ error: 'Failed to create booking' }, 500)
  }
})

// GET /api/bookings/:reference - Get booking status (no auth needed)
router.get('/:reference', async (c) => {
  const reference = c.req.param('reference')
  const email = c.req.query('email')

  try {
    const [booking] = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.reference_number, reference))

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404)
    }

    // Optional: Verify email matches (prevents discovering all bookings)
    if (email && booking.guest_email !== email) {
      return c.json({ error: 'Email does not match booking' }, 401)
    }

    return c.json(booking)
  } catch (error) {
    return c.json({ error: 'Failed to fetch booking' }, 500)
  }
})

export default router
```

---

## Summary

### No Authentication = Simpler System

```
With Authentication:
├─ Sign up form
├─ Login form
├─ Password recovery
├─ Session management
├─ User accounts table
├─ Account security
├─ Password hashing
└─ Complex API

Without Authentication (Njoki Model):
├─ Simple booking form (name + email + dates)
├─ Email confirmation (no password)
├─ Reference number tracking
├─ Email for all communication
├─ No account management
├─ No password security issues
└─ Simpler API
```

### Key Benefits

✅ **Frictionless for guests** - Just fill form, get email confirmation
✅ **Simple for developers** - No auth code needed
✅ **Simple for admin** - Everything in admin dashboard
✅ **Email-driven** - All communication is email-based
✅ **Perfect for Kenya** - Works on any device with email
✅ **Lower cost** - No authentication service needed
✅ **Easy to scale** - Add features without auth complexity

### What Guests See

1. Browse units (no account needed)
2. Click "Book Now"
3. Fill form with name, email, dates
4. Submit
5. Check email for confirmation
6. Get payment details via email/WhatsApp
7. Pay offline
8. Get check-in instructions
9. Enjoy stay
10. Leave review (no account needed)

---

**This is the Njoki Homestays booking experience: simple, direct, and Kenya-optimized.**

