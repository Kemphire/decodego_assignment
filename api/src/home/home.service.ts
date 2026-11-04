import { randomUUID } from 'node:crypto'
import { DatabaseError, NotFoundError } from '../exceptions'
import type { AddEntityData } from './home.schema'

interface createHomeResponse {
  id: string
  name: string
}

interface createMemberResponse {
  id: string
  homeId: string
  name: string
}

export async function createHome(db: D1Database, data: AddEntityData): Promise<createHomeResponse> {
  try {
    const created = await db
      .prepare('INSERT INTO homes (name, id) VALUES (?,?) RETURNING id, name')
      .bind(data.name, randomUUID())
      .first<createHomeResponse>()

    if (!created) {
      throw new DatabaseError('Failed to create home')
    }

    return created
  } catch {
    throw new DatabaseError('Failed to create home')
  }
}

export async function createMember(db: D1Database, data: AddEntityData, homeId: string) {
  try {
    const created = await db
      .prepare('INSERT INTO members (name, homeId, id) VALUES (?,?,?) RETURNING id, name, homeId')
      .bind(data.name, homeId, randomUUID())
      .first<createMemberResponse>()

    if (!created) {
      throw new Error('Failled To create home')
    }

    return created
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      throw new NotFoundError('Home not found')
    }

    throw error
  }
}
