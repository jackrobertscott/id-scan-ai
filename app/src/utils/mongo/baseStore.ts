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
export const createStoreDef = <T extends ZodRawShape>(
  prefix: string,
  colname: string,
  extraSchema: T
) => {
  z.string().length(3).parse(prefix)
  if (_storePrefixSet.has(prefix))
    throw new Error("Duplicate prefix: " + prefix)
  return {
    prefix,
    colname,
    schema: createStoreBaseSchema(prefix).extend(extraSchema),
  }
}
