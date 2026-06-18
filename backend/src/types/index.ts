export interface Unit {
  id: number
  name: string
  description?: string
  price: string
  bedrooms: number
  bathrooms: number
  maxGuests: number
  location: string
  image?: string
  amenities?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: number
  referenceNumber: string
  unitId: number
  guestEmail: string
  guestName: string
  guestPhone?: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalPrice?: string
  specialRequests?: string
  paymentStatus: 'unpaid' | 'paid'
  createdAt: Date
}

export interface Review {
  id: number
  bookingId: number
  unitId: number
  guestEmail: string
  guestName: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}
