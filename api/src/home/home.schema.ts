import * as v from "valibot"

export const AddEntitySchema = v.object({
    name: v.string()
})

export type AddEntityData = v.InferInput<typeof AddEntitySchema> 