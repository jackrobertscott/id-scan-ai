import {Filter} from "mongodb"
import {NestedKeyOf} from "../sharedTypes"
import {StoreValueType} from "./baseStore"

export const createTextSearchQuery = <T extends StoreValueType<any>>({
  search,
  searchKeys = [],
  prefix = "",
}: {
  search?: string | null
  searchKeys?: NestedKeyOf<T>[]
  prefix?: string
}) => {
  const query = {$and: [] as Filter<T>[]}
  const terms = search?.split(" ").filter(Boolean)

  if (search && terms?.length) {
    for (const term of terms) {
      query.$and.push({
        $or: searchKeys.map((key) => ({
          [prefix + key]: {$regex: term, $options: "i"},
        })),
      } as Filter<T>)
    }
  }

  return query
}

export const createDateRangeQuery = ({
  createdAfterDate,
  createdBeforeDate,
  prefix = "",
}: {
  createdAfterDate?: Date | null
  createdBeforeDate?: Date | null
  prefix?: string
}) => {
  const createdDateQuery = {$and: [] as Filter<StoreValueType<any>>[]}

  if (createdAfterDate) {
    createdDateQuery.$and.push({
      [prefix + "createdDate"]: {$gte: createdAfterDate},
    })
  }

  if (createdBeforeDate) {
    createdDateQuery.$and.push({
      [prefix + "createdDate"]: {$lt: createdBeforeDate},
    })
  }

  return createdDateQuery
}

export const createListSearchQuery = <T extends StoreValueType<any>>({
  search,
  searchKeys = [],
  createdAfterDate,
  createdBeforeDate,
  prefix,
  filter = {},
}: {
  search?: string | null
  searchKeys?: NestedKeyOf<T>[]
  createdAfterDate?: Date | null
  createdBeforeDate?: Date | null
  prefix?: string
  filter?: Filter<T>
}) => {
  return {
    $and: [
      filter,
      ...createTextSearchQuery({search, searchKeys, prefix}).$and,
      ...createDateRangeQuery({createdAfterDate, createdBeforeDate, prefix})
        .$and,
    ].filter(Boolean) as Filter<T>[],
  }
}
