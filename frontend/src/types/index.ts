export interface Unit {
    id: number
    name: string
    description?: string
    price: string
    bedrooms: number
    bathrooms: number
    max_guests: number
    location: string
    image?: string
    amenities?: string
}

export interface Booking {
    id: number
    reference_number: string
    unit_id: number
    guest_email: string
    guest_name: string
    status: string
    payment_status: string
    total_price: string
}

export interface Review {
    id: number
    guest_name: string
    rating: number
    comment: string
}