import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Njoki Homestays - Book Your Stay',
  description: 'Discover beautiful homestays in Kenya',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="container-max py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-amber-700">
              🏡 Njoki Homestays
            </a>
            <div className="space-x-6">
              <a href="/" className="text-gray-600 hover:text-amber-700">
                Browse
              </a>
              <a href="/bookings" className="text-gray-600 hover:text-amber-700">
                My Bookings
              </a>
            </div>
          </nav>
        </header>

        <main className="container-max py-8">
          {children}
        </main>

        <footer className="bg-gray-900 text-white mt-16">
          <div className="container-max py-8">
            <p>&copy; 2024 Njoki Homestays. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}