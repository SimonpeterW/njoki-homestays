import Link from 'next/link'
import Image from 'next/image'

interface Unit {
  id: number
  name: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  image?: string
  maxGuests: number
}

export default function UnitCard({ unit }: { unit: Unit }) {
  return (
    <div className="card hover:shadow-lg transition overflow-hidden">
      <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
        {unit.image ? (
          <Image
            src={unit.image}
            alt={unit.name}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{unit.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{unit.location}</p>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div>
          <span className="font-semibold">{unit.bedrooms}</span> Bedrooms
        </div>
        <div>
          <span className="font-semibold">{unit.bathrooms}</span> Bathrooms
        </div>
        <div>
          <span className="font-semibold">{unit.maxGuests}</span> Guests
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          KES {parseFloat(unit.price).toLocaleString()}
          <span className="text-sm text-gray-600">/night</span>
        </div>
        <Link href={`/units/${unit.id}`}>
          <button className="btn-primary">View Details</button>
        </Link>
      </div>
    </div>
  )
}
