import {z, ZodRawShape} from "zod"
import {idSchema} from "../zodSchema"

const _storePrefixSet = new Set<string>()

export type StoreBaseSchemaType = ReturnType<typeof createStoreBaseSchema>
export const createStoreBaseSchema = (prefix: string) => {
  return z.object({
    id: idSchema(prefix),
    createdDate: z.coerce.date(),
    archivedDate: z.coerce.date().nullish(),
  })
}

export type StoreValueType<T extends StoreDefType<any>> = z.infer<T["schema"]>
export type StoreDefType<T extends ZodRawShape> = ReturnType<
  typeof createStoreDef<T>
>
export const createStoreDef = <T extends ZodRawShape>(data: {
  prefix: string
  colname: string
  schema: T
  indexes: ["id", "createdDate", ...string[]]
}) => {
  z.string().length(3).parse(data.prefix)
  if (_storePrefixSet.has(data.prefix))
    throw new Error("Duplicate prefix: " + data.prefix)
  return {
    ...data,
    schema: createStoreBaseSchema(data.prefix).extend(data.schema),
  }
}
