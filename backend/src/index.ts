import { Hono } from 'hono'
import { cors } from 'hono/cors'
import 'dotenv/config'
import { initDatabase } from '@/db'
import healthRoutes from '@/routes/health'
import unitsRoutes from '@/routes/units'
import bookingsRoutes from '@/routes/bookings'
import reviewsRoutes from '@/routes/reviews'

const app = new Hono()

app.use(
    '*',
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    })
)

app.use('*', async (c, next) => {
    const start = Date.now()
    console.log(`→ ${c.req.method} ${c.req.path}`)
    await next()
    const duration = Date.now() - start
    console.log(`✓ ${c.req.method} ${c.req.path} ${c.res.status} (${duration}ms)`)
})

app.route('/', healthRoutes)
app.route('/api/units', unitsRoutes)
app.route('/api/bookings', bookingsRoutes)
app.route('/api/reviews', reviewsRoutes)

app.notFound((c) => {
    return c.json({ success: false, error: 'Not found' }, 404)
})

app.onError((err, c) => {
    console.error('Error:', err)
    return c.json({ success: false, error: 'Internal error' }, 500)
})

async function start() {
    try {
        await initDatabase()

        const port = parseInt(process.env.PORT || '3001')
        const host = process.env.HOST || '0.0.0.0'

        console.log('')
        console.log('🚀 Njoki Homestays API')
        console.log(`📍 http://${host}:${port}`)
        console.log(`📊 Status: http://${host}:${port}/api/status`)
        console.log('')

        return {
            port,
            fetch: app.fetch,
        }
    } catch (error) {
        console.error('Failed to start:', error)
        process.exit(1)
    }
}

const server = await start()

if (server) {
    Bun.serve(server)
}