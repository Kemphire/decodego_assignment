import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import * as v from 'valibot'
import { AddBillSchema } from './bill.schema'
import { addBill, divideBill, getOutStandingBalances } from './bill.service'

const app = new Hono<{ Bindings: Env }>()

app.post(
  '/homes/:homeId/bills',
  sValidator(
    'param',
    v.object({
      homeId: v.pipe(v.string(), v.toNumber(), v.safeInteger(), v.minValue(1)),
    }),
  ),
  sValidator('json', AddBillSchema),
  async (c) => {
    const reqData = c.req.valid('json')
    const { homeId } = c.req.valid('param')

    const bill = await addBill(c.env.DB, reqData, homeId)
    const shares = await divideBill(c.env.DB, bill, bill.amount)

    const { amount: totalCents, ...billData } = bill
    return c.json(
      {
        ...billData,
        totalCents,
        shares: shares.map(({ amount: amountCents, ...share }) => ({
          ...share,
          amountCents,
        })),
      },
      201,
    )
  },
)

app.post(
  '/bills/:billId/shares/:shareId/pay',
  sValidator(
    'header',
    v.object({
      'idempotency-key': v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
    }),
  ),
)

app.get(
  '/homes/:homeId/balances',
  sValidator(
    'param',
    v.object({
      homeId: v.pipe(v.string(), v.toNumber(), v.safeInteger(), v.minValue(1)),
    }),
  ),
  async (c) => {
    const { homeId } = c.req.valid('param')
    const balances = await getOutStandingBalances(c.env.DB, homeId)
    return c.json(
      {
        balances: balances,
      },
      200,
    )
  },
)

export default app
