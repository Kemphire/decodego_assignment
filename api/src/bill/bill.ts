import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import * as v from "valibot"

const app = new Hono<{ Bindings: Env }>()

const AddBillSchema = v.object({
    title: v.pipe(v.string(), v.nonEmpty()),
    totalCents: v.pipe(v.number(), v.integer(), v.minValue(1))
})

const IdempotencyHeaderSchema = v.object({
    "idempotency-key": v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(255)
    )
})

app.post("/homes/:homeId/bills",sValidator("json",AddBillSchema))

app.post("/bills/:billId/shares/:shareId/pay",sValidator("header",IdempotencyHeaderSchema))

app.get("/homes/:homeId/balances")

export default app