import {FindOptions} from "mongodb"
import {z} from "zod"

export type ListOptionValue = z.infer<ReturnType<typeof listOptionsSchema>>

export const listOptionsSchema = () =>
  z.object({
    search: z.string().nullish(),
    createdAfterDate: z.coerce.date().nullish(),
    createdBeforeDate: z.coerce.date().nullish(),
    limit: z.number().int().gt(0).lte(200).default(50),
    page: z.coerce.number().int().gte(0).default(0),
    sortKey: z.string().nullish(),
    sortDir: z.string().nullish(),
  })

export const createListOptions = (
  body: z.infer<ReturnType<typeof listOptionsSchema>>
): FindOptions<any> => {
  return {
    limit: body.limit,
    skip: body.page * body.limit,
    sort: {
      [body.sortKey ?? "createdDate"]: body.sortDir === "asc" ? 1 : -1,
    },
  }
}
