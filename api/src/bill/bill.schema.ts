import * as v from 'valibot'

export const AddBillSchema = v.object({
  title: v.pipe(v.string(), v.nonEmpty()),
  totalCents: v.pipe(v.number(), v.integer(), v.minValue(1)),
})

export type AddBillData = v.InferInput<typeof AddBillSchema>
