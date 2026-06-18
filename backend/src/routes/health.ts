import { Hono } from 'hono'

const router = new Hono()

router.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

router.get('/api/status', (c) => {
  return c.json({
    api: 'Njoki Homestays API',
    version: '1.0.0',
    status: 'operational',
  })
})

export default router
