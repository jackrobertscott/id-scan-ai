import {z} from "zod"
import {idSchema} from "../zodSchema"

const __baseStorePrefixSet = new Set<string>()

export const createBaseStorePrefix = (prefix: string) => {
  if (__baseStorePrefixSet.has(prefix))
    throw new Error("Duplicate prefix: " + prefix)
  return z.string().length(3).parse(prefix)
}

export type BaseStoreSchemaType = z.infer<
  ReturnType<typeof createBaseStoreSchema>
>

export const createBaseStoreSchema = (prefix: string) => {
  return z.object({
    id: idSchema(prefix),
    createdDate: z.coerce.date(),
    archivedDate: z.coerce.date().nullish(),
  })
}
