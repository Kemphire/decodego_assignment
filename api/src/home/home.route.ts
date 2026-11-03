import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import * as v from "valibot"
import { AddEntitySchema } from './home.schema'
import { createHome, createMember } from './home.service'

const app = new Hono<{ Bindings: Env }>()


app.post("/homes", sValidator("json", AddEntitySchema), async (c) => {
    const reqData = c.req.valid("json")

    const home = await createHome(c.env.DB, reqData)
    return c.json(home, 201)
})

app.post("/homes/:homeId/members", sValidator("param", v.object({
    homeId: v.pipe(v.string(), v.toNumber(), v.safeInteger(), v.minValue(1))
})), sValidator("json", AddEntitySchema), async (c) => {
    const { homeId } = c.req.valid("param")
    const reqData = c.req.valid("json")

    const member = await createMember(c.env.DB, reqData, homeId)

    return c.json(member, 201)
})

export default app