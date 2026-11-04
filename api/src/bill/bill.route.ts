import { sValidator } from '@hono/standard-validator'
import { Hono } from 'hono'
import * as v from 'valibot'
import { AddBillSchema } from './bill.schema'
import { addBill, divideBill, getBills, getOutStandingBalances, payShare } from './bill.service'

const app = new Hono<{ Bindings: Env }>()

app.post(
  '/homes/:homeId/bills',
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
  sValidator('json', AddBillSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'schema is invalid' }, 422)
    }
  }),
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
    (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Idempotency-Key must be string of length 0 to 255' }, 400)
      }
    },
  ),
  sValidator(
    'param',
    v.object({
      billId: v.pipe(v.string(), v.nonEmpty()),
      shareId: v.pipe(v.string(), v.nonEmpty()),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: 'homeId or shareId cannot be empty' }, 422)
      }
    },
  ),
  async (c) => {
    const header = c.req.valid('header')
    const { billId, shareId } = c.req.valid('param')

    const share = await payShare(c.env.DB, shareId, billId, header['idempotency-key'])

    return c.json(
      {
        id: share.id,
        memberId: share.memberId,
        amountCents: share.amount,
        paidAt: share.paidAt ? new Date(share.paidAt * 1000) : null,
      },
      200,
    )
  },
)

app.get(
  '/homes/:homeId/balances',
  sValidator(
    'param',
    v.object({
      homeId: v.pipe(v.string(), v.nonEmpty()),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: 'homeId cannot empty' }, 422)
      }
    },
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

app.get(
  '/homes/:homeId/bills',
  sValidator(
    'param',
    v.object({
      homeId: v.pipe(v.string(), v.nonEmpty()),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: 'homeId cannot empty' }, 422)
      }
    },
  ),
  async (c) => {
    const { homeId } = c.req.valid('param')
    const { bills } = await getBills(c.env.DB, homeId)

    return c.json({ bills }, 200)
  },
)

export default app
