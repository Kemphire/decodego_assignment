import { DatabaseError, HomeNoMember, NotFoundError } from '../exceptions'
import type { AddBillData } from './bill.schema'

interface Bill {
  id: number
  title: string
  homeId: number
  amount: number
}

interface Member {
  id: number
  homeId: number
  name: string
  createdAt: number
}

interface Share {
  id: number
  memberId: number
  billId: number
  amount: number
  paidAt: number | null
}

export async function addBill(db: D1Database, data: AddBillData, homeId: number) {
  try {
    const hasMembers = await db
      .prepare('SELECT id FROM members WHERE homeId = ?')
      .bind(homeId)
      .first<{ id: string }>()

    if (!hasMembers) {
      throw new HomeNoMember()
    }

    const created = await db
      .prepare(
        'INSERT INTO bills (title, homeId, amount) VALUES (?,?,?) RETURNING id, title, homeId, amount',
      )
      .bind(data.title, homeId, data.totalCents)
      .first<Bill>()

    if (!created) {
      throw new DatabaseError('Bill cannot be created')
    }

    return created
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      throw new NotFoundError('Home not found')
    }

    throw error
  }
}

export async function divideBill(db: D1Database, bill: Bill, totalCents: number) {
  const { results: members } = await db
    .prepare(
      'SELECT id, homeId, name, createdAt FROM members WHERE homeId = ? ORDER BY createdAt ASC',
    )
    .bind(bill.homeId)
    .all<Member>()

  if (members.length < 1) {
    throw new HomeNoMember()
  }

  const residual = totalCents % members.length

  if (members.length > totalCents) {
    const shares = await createShares(db, members.slice(0, residual), bill, 1)
    return shares
  } else {
    const amtPerShare = Math.trunc(totalCents / members.length)
    const shares = await createShares(db, members, bill, amtPerShare)
    const updatedShares = await updateShares(db, shares.splice(0, residual), 1)

    shares.splice(0, residual, ...updatedShares)
    return shares
  }
}

async function createShares(db: D1Database, members: Member[], bill: Bill, amount: number) {
  const stmts: D1PreparedStatement[] = []

  for (const mem of members) {
    stmts.push(
      db
        .prepare(
          'INSERT INTO shares (memberId, billId, amount) VALUES (?,?,?) RETURNING id, billId, amount, memberId, paidAt',
        )
        .bind(mem.id, bill.id, amount),
    )
  }

  const shares = (await db.batch<Share>(stmts)).map((r) => r.results[0] as Share)

  return shares
}

async function updateShares(db: D1Database, shares: Share[], incrementAmount: number) {
  const stmts: D1PreparedStatement[] = []

  for (const share of shares) {
    share.amount += incrementAmount
    stmts.push(db.prepare('UPDATE shares SET amount = ? WHERE id = ?').bind(share.amount, share.id))
  }

  if (stmts.length > 0) await db.batch(stmts)

  return shares
}

export async function getOutStandingBalances(db: D1Database, homeId: number) {
  const homeExists = await db
    .prepare('SELECT id FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ id: string }>()

  if (!homeExists) {
    throw new NotFoundError('Home not Found')
  }

  const { results } = await db
    .prepare(`
    SELECT m.id, m.name, SUM(s.amount) as outstandingCents
    FROM members as m
    JOIN shares AS s ON s.memberId = m.id
    WHERE m.homeId = ? AND s.paidAt IS NULL
    GROUP BY s.memberId
    `)
    .bind(homeId)
    .all<{ name: string; outStandingCents: number }>()

  return results
}
