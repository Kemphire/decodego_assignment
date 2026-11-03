import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import * as v from "valibot"
import { AddEntitySchema } from './home.schema'

const app = new Hono<{ Bindings: Env }>()


app.post("/homes", sValidator("json", AddEntitySchema), (c) => {
    return c.json({})
})

app.post("/homes/:homeId/members", sValidator("json", AddEntitySchema), (c) => {
    return c.json({ "success": true })
})

export default app