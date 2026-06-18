'use client'

import { useState } from 'react'
import { fetchUnits } from '@/lib/api'
import UnitCard from '@/components/UnitCard'

export default function Home() {
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('')

  const handleSearch = async () => {
    setLoading(true)
    try {
      const data = await fetchUnits({ location })
      setUnits(data)
    } catch (error) {
      console.error('Error fetching units:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 mb-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Njoki Homestays</h1>
        <p className="text-lg mb-8">
          Discover beautiful, affordable homestays in Kenya's best locations
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-6 shadow-lg text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input"
              >
                <option value="">All Locations</option>
                <option value="Nyahururu">Nyahururu</option>
                <option value="Rumuruti">Rumuruti</option>
                <option value="Nanyuki">Nanyuki</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Check-in</label>
              <input type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Check-out</label>
              <input type="date" className="input" />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="btn-primary w-full"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Units Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Units</h2>
        {units.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {loading
                ? 'Loading units...'
                : 'Click "Search" or browse all available units'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
