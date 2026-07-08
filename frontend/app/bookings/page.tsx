'use client'

import { useState } from 'react'
import { getBooking } from '@/lib/api'

export default function MyBookings() {
    const [reference, setReference] = useState('')
    const [email, setEmail] = useState('')
    const [booking, setBooking] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setBooking(null)

        try {
            const data = await getBooking(reference, email)
            if (data) {
                setBooking(data)
            } else {
                setError('Booking not found')
            }
        } catch (err) {
            setError('Failed to fetch booking')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Check Your Booking</h1>

            <div className="card mb-8">
                <form onSubmit={handleCheck} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Booking Reference *</label>
                        <input
                            type="text"
                            placeholder="BOOK#1001"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Checking...' : 'Check Booking'}
                    </button>
                </form>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-4">{error}</div>}

            {booking && (
                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">{booking.reference_number}</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-gray-600 text-sm">Guest</p>
                            <p className="font-bold">{booking.guest_name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Email</p>
                            <p className="font-bold">{booking.guest_email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Check-in</p>
                            <p className="font-bold">{booking.check_in_date}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Check-out</p>
                            <p className="font-bold">{booking.check_out_date}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Guests</p>
                            <p className="font-bold">{booking.number_of_guests}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Price</p>
                            <p className="font-bold">KES {parseFloat(booking.total_price).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm">Status</p>
                            <p className={`font-bold text-lg ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {booking.status.toUpperCase()}
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-600 text-sm">Payment Status</p>
                            <p className={`font-bold text-lg ${booking.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                                {booking.payment_status.toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
