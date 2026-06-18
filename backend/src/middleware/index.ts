import { Hono } from 'hono'
import { cors } from 'hono/cors'

export function setupMiddleware(app: Hono) {
  // CORS
  app.use(
    '*',
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    })
  )

  // Request logging
  app.use('*', async (c, next) => {
    console.log(`${c.req.method} ${c.req.path}`)
    const start = Date.now()
    await next()
    const duration = Date.now() - start
    console.log(`${c.req.method} ${c.req.path} - ${c.res.status} (${duration}ms)`)
  })

  // Error handler
  app.onError((err, c) => {
    console.error('Error:', err)
    return c.json(
      {
        error: err.message || 'Internal Server Error',
      },
      500
    )
  })
}
