import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
})

export async function fetchUnits(filters?: {
    location?: string
    minPrice?: number
    maxPrice?: number
}) {
    try {
        const params = new URLSearchParams()
        if (filters?.location) params.append('location', filters.location)
        if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
        if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())

        const response = await api.get(`/api/units?${params.toString()}`)
        return response.data.data || []
    } catch (error) {
        console.error('Error:', error)
        return []
    }
}

export async function fetchUnit(id: number) {
    try {
        const response = await api.get(`/api/units/${id}`)
        return response.data.data
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

export async function createBooking(data: any) {
    try {
        const response = await api.post('/api/bookings', data)
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed' }
    }
}

export async function getBooking(reference: string, email: string) {
    try {
        const response = await api.get(`/api/bookings/${reference}?email=${email}`)
        return response.data.data
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

export async function submitReview(data: any) {
    try {
        const response = await api.post('/api/reviews', data)
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed' }
    }
}

export async function getReviews(unitId: number) {
    try {
        const response = await api.get(`/api/reviews/${unitId}`)
        return response.data.data
    } catch (error) {
        console.error('Error:', error)
        return { reviews: [], average_rating: 0, total_reviews: 0 }
    }
}