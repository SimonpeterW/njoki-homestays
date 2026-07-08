'use client'

import { useState, useEffect } from 'react'
import { fetchUnit, getReviews, createBooking } from '@/lib/api'
import { useParams } from 'next/navigation'

export default function UnitDetail() {
    const params = useParams()
    const id = parseInt(params.id as string)

    const [unit, setUnit] = useState<any>(null)
    const [reviews, setReviews] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        specialRequests: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function load() {
            const unitData = await fetchUnit(id)
            const reviewsData = await getReviews(id)
            setUnit(unitData)
            setReviews(reviewsData)
            setLoading(false)
        }
        load()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage('')

        try {
            const result = await createBooking({
                unit_id: id,
                guest_name: booking.guestName,
                guest_email: booking.guestEmail,
                guest_phone: booking.guestPhone,
                check_in_date: booking.checkInDate,
                check_out_date: booking.checkOutDate,
                number_of_guests: parseInt(booking.numberOfGuests.toString()),
                special_requests: booking.specialRequests,
            })

            if (result.success) {
                setMessage(`✅ Booking created! Reference: ${result.data.reference_number}. Check your email.`)
                setBooking({
                    guestName: '',
                    guestEmail: '',
                    guestPhone: '',
                    checkInDate: '',
                    checkOutDate: '',
                    numberOfGuests: 1,
                    specialRequests: '',
                })
            }
        } catch (error: any) {
            setMessage(`❌ ${error.error || 'Booking failed'}`)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    if (!unit) {
        return <div className="text-center py-12">Unit not found</div>
    }

    return (
        <div>
            <div className="bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg h-96 mb-8 flex items-center justify-center">
                <span className="text-8xl">🏠</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h1 className="text-4xl font-bold mb-4">{unit.name}</h1>
                    <p className="text-gray-600 mb-6">{unit.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="card">
                            <p className="text-3xl font-bold text-amber-700">{unit.bedrooms}</p>
                            <p className="text-gray-600">Bedrooms</p>
                        </div>
                        <div className="card">
                            <p className="text-3xl font-bold text-amber-700">{unit.bathrooms}</p>
                            <p className="text-gray-600">Bathrooms</p>
                        </div>
                        <div className="card">
                            <p className="text-3xl font-bold text-amber-700">{unit.maxGuests}</p>
                            <p className="text-gray-600">Guests</p>
                        </div>
                    </div>

                    <div className="card mb-6">
                        <p className="text-gray-600 mb-2">Amenities:</p>
                        <div className="flex flex-wrap gap-2">
                            {(unit.amenities || '').split(',').map((amenity: string, i: number) => (
                                <span key={i} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                                    {amenity.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    {reviews && (
                        <div className="card">
                            <h3 className="text-xl font-bold mb-4">Reviews ({reviews.total_reviews})</h3>
                            <p className="text-amber-700 font-bold mb-4">⭐ {reviews.average_rating}/5</p>
                            <div className="space-y-4">
                                {reviews.reviews?.map((review: any) => (
                                    <div key={review.id} className="border-b pb-4">
                                        <p className="font-bold">{review.guest_name}</p>
                                        <p className="text-amber-700">{'⭐'.repeat(review.rating)}</p>
                                        <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Booking Form */}
                <div className="card h-fit sticky top-24">
                    <h2 className="text-2xl font-bold mb-4">Book Now</h2>
                    <p className="text-3xl font-bold text-amber-700 mb-4">KES {parseFloat(unit.price).toLocaleString()}/night</p>

                    {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                            <input
                                type="text"
                                required
                                value={booking.guestName}
                                onChange={(e) => setBooking({ ...booking, guestName: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                type="email"
                                required
                                value={booking.guestEmail}
                                onChange={(e) => setBooking({ ...booking, guestEmail: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                value={booking.guestPhone}
                                onChange={(e) => setBooking({ ...booking, guestPhone: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Check-in *</label>
                                <input
                                    type="date"
                                    required
                                    value={booking.checkInDate}
                                    onChange={(e) => setBooking({ ...booking, checkInDate: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Check-out *</label>
                                <input
                                    type="date"
                                    required
                                    value={booking.checkOutDate}
                                    onChange={(e) => setBooking({ ...booking, checkOutDate: e.target.value })}
                                    className="input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Guests *</label>
                            <select
                                value={booking.numberOfGuests}
                                onChange={(e) => setBooking({ ...booking, numberOfGuests: parseInt(e.target.value) })}
                                className="input"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Special Requests</label>
                            <textarea
                                value={booking.specialRequests}
                                onChange={(e) => setBooking({ ...booking, specialRequests: e.target.value })}
                                className="input h-20"
                            ></textarea>
                        </div>

                        <button type="submit" disabled={submitting} className="btn-primary w-full">
                            {submitting ? 'Booking...' : 'Complete Booking'}
                        </button>
                    </form>

                    <p className="text-xs text-gray-600 mt-4">No account needed. We will send confirmation to your email.</p>
                </div>
            </div>
        </div>
    )
}
