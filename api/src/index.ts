import { Hono } from 'hono'
import billRoutes from './bill/bill.route'
import { AppError } from './exceptions'
import homeRoutes from './home/home.route'

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api', homeRoutes)
app.route('/api', billRoutes)

app.onError((error, c) => {
  const status = error instanceof AppError ? error.statusCode : 500

  if (status >= 500) {
    console.error(error)
  }

  return c.json(
    {
      error: status >= 500 ? 'Internal Server Error' : error.message,
    },
    status,
  )
})

export default app
