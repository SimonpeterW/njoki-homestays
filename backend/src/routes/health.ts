import { Hono } from 'hono'
import { getDb } from '@/db'

const router = new Hono()

router.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

router.get('/api/status', async (c) => {
  try {
    await getDb()
    return c.json({
      status: 'operational',
      api: 'Njoki Homestays API',
      version: '1.0.0',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return c.json(
      {
        status: 'degraded',
        database: 'disconnected',
        error: 'Database connection failed',
      },
      503
    )
  }
})

export default router