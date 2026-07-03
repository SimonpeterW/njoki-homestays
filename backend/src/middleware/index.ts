import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

/**
 * Setup all middleware for the application
 * This includes CORS, logging, error handling, and request parsing
 */
export function setupMiddleware(app: Hono) {
    // CORS Middleware - Allow requests from frontend
    app.use(
        '*',
        cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
            credentials: true,
        })
    )

    // Built-in logger middleware
    app.use('*', logger())

    // Request logging middleware with custom formatting
    app.use('*', async (c, next) => {
        const start = Date.now()
        const method = c.req.method
        const path = c.req.path

        console.log(`→ ${method} ${path}`)

        await next()

        const duration = Date.now() - start
        const status = c.res.status

        // Color code status
        let statusColor = ''
        if (status >= 200 && status < 300) {
            statusColor = '✅' // Green
        } else if (status >= 300 && status < 400) {
            statusColor = '🔄' // Redirect
        } else if (status >= 400 && status < 500) {
            statusColor = '⚠️' // Warning
        } else {
            statusColor = '❌' // Error
        }

        console.log(`${statusColor} ${method} ${path} ${status} (${duration}ms)`)
    })

    // Error handler middleware
    app.onError((err, c) => {
        console.error('Application Error:', {
            message: err.message,
            stack: err.stack,
            path: c.req.path,
            method: c.req.method,
        })

        // Don't expose internal errors to client in production
        const isProduction = process.env.NODE_ENV === 'production'
        const errorMessage = isProduction ? 'Internal server error' : err.message

        return c.json(
            {
                success: false,
                error: errorMessage,
                timestamp: new Date().toISOString(),
            },
            500
        )
    })

    // 404 Not Found handler
    app.notFound((c) => {
        return c.json(
            {
                success: false,
                error: 'Endpoint not found',
                path: c.req.path,
                method: c.req.method,
            },
            404
        )
    })

    // Health check endpoint for load balancers
    app.get('/health', (c) => {
        return c.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        })
    })

    console.log('✅ Middleware setup complete')
}