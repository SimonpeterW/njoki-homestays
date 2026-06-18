import { Hono } from 'hono'
import { setupMiddleware } from '@/middleware'
import healthRoutes from '@/routes/health'
import unitsRoutes from '@/routes/units'
import bookingsRoutes from '@/routes/bookings'
import reviewsRoutes from '@/routes/reviews'

// Initialize app
const app = new Hono()

// Setup middleware
setupMiddleware(app)

// Health check routes
app.route('/', healthRoutes)

// API routes
app.route('/api/units', unitsRoutes)
app.route('/api/bookings', bookingsRoutes)
app.route('/api/reviews', reviewsRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Start server
const port = parseInt(process.env.PORT || '3001')
const host = process.env.HOST || '0.0.0.0'

console.log(`🚀 Njoki Homestays API`)
console.log(`📍 Starting server on http://\${host}:\${port}`)
console.log(`📚 API Base: http://\${host}:\${port}/api`)

export default app
