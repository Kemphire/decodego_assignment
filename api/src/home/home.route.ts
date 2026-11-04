import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import * as v from 'valibot'
import { AddEntitySchema } from './home.schema'
import { createHome, createMember } from './home.service'

const app = new Hono<{ Bindings: Env }>()

app.post(
  '/homes',
  sValidator('json', AddEntitySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid Data for adding home' }, 422)
    }
  }),
  async (c) => {
    const reqData = c.req.valid('json')

    const home = await createHome(c.env.DB, reqData)
    return c.json(home, 201)
  },
)

app.post(
  '/homes/:homeId/members',
  sValidator(
    'param',
    v.object({
      homeId: v.pipe(v.string(), v.nonEmpty()),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: 'homeId cannot be empty' }, 422)
      }
    },
  ),
  sValidator('json', AddEntitySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid Data for adding member' }, 422)
    }
  }),
  async (c) => {
    const { homeId } = c.req.valid('param')
    const reqData = c.req.valid('json')

    const member = await createMember(c.env.DB, reqData, homeId)

    return c.json(member, 201)
  },
)

export default app
