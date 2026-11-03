import { AppError, DatabaseError, NotFoundError } from "../exceptions";
import type { AddEntityData } from "./home.schema";

interface createHomeResponse {
    id: string,
    name: string
}

interface createMemberResponse {
    id: string,
    homeId: string,
    name: string
}

export async function createHome(
    db: D1Database,
    data: AddEntityData,
): Promise<createHomeResponse> {
    try {
        const created = await db
            .prepare('INSERT INTO homes (name) VALUES (?) RETURNING id, name')
            .bind(data.name)
            .first<createHomeResponse>()

        if (!created) {
            throw new DatabaseError('Failed to create home')
        }

        return created
    } catch {
        throw new DatabaseError('Failed to create home')
    }
}

export async function createMember(db: D1Database, data: AddEntityData, homeId: number) {
    try {
        const created = await db.prepare("INSERT INTO members (name, homeId) VALUES (?,?) RETURNING id, name, homeId")
            .bind(data.name, homeId)
            .first<createMemberResponse>()

        if (!created) {
            throw new Error("Failled To create home")
        }

        return created
    } catch (error: unknown) {

        if (
            error instanceof Error &&
            error.message.includes('FOREIGN KEY constraint failed')
        ) {
            throw new NotFoundError('Home not found')
        }

        throw error
    }


}