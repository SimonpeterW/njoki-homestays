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
  bedrooms?: number
}) {
  try {
    const params = new URLSearchParams()
    if (filters?.location) params.append('location', filters.location)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms.toString())

    const response = await api.get(`/api/units?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error('Error fetching units:', error)
    return []
  }
}

export async function fetchUnit(id: number) {
  try {
    const response = await api.get(`/api/units/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching unit:', error)
    return null
  }
}

export async function submitBooking(bookingData: any) {
  try {
    const response = await api.post('/api/bookings', bookingData)
    return response.data
  } catch (error: any) {
    throw error.response?.data || { error: 'Failed to submit booking' }
  }
}

export async function submitReview(reviewData: any) {
  try {
    const response = await api.post('/api/reviews', reviewData)
    return response.data
  } catch (error: any) {
    throw error.response?.data || { error: 'Failed to submit review' }
  }
}

export async function fetchReviews(unitId: number) {
  try {
    const response = await api.get(`/api/reviews/${unitId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { reviews: [] }
  }
}

export default api
