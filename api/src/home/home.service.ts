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

export async function createHome(db: D1Database,home: AddEntityData) {
    
}