import {createId} from "@paralleldrive/cuid2"
import {AggregateOptions, Filter, FindOptions} from "mongodb"
import {z, ZodRawShape} from "zod"
import {toCapitalCase, toSpacedCase} from "../changeCase"
import {MergeObjects, OptionalKeys} from "../sharedTypes"
import {idSchema} from "../zodSchema"
import {StoreBaseSchemaType, StoreDefType} from "./baseStore"
import {getMongoCollection} from "./mongoClient"

/**
 * Mongo's lib types are bad... so don't bother getting them to work
 * use this file to overwrite the mongo types
 */

type ZodMongoStoreDef<T extends StoreBaseSchemaType> = MergeObjects<
  StoreDefType<ZodRawShape>,
  {schema: T}
>

export function createMongoStore<
  T extends StoreBaseSchemaType,
  X extends Record<string, any>
>({
  def,
  extend,
}: {
  def: ZodMongoStoreDef<T>
  extend: (store: ReturnType<typeof _createMongoStore<T>>) => X
}) {
  const data = _createMongoStore(def)
  const newData = extend?.(data)
  return {...data, ...newData}
}

export function _createMongoStore<T extends StoreBaseSchemaType>({
  colname,
  schema,
  prefix,
  ...rest
}: ZodMongoStoreDef<T>) {
  type Schema = z.infer<T>

  return {
    ...rest,
    colname,
    schema,
    prefix,

    async getCollection() {
      return getMongoCollection(colname)
    },

    validateOne(raw: Schema) {
      return schema.parse(raw)
    },

    async maybeOne(filter: Filter<Schema>): Promise<Schema | null> {
      const collection = await this.getCollection()
      return collection.findOne(this.preprocessQuery(filter))
    },

    async getOne(filter: Filter<Schema>): Promise<Schema> {
      const collection = await this.getCollection()
      const i = await collection.findOne(this.preprocessQuery(filter))
      if (!i)
        throw new Error(`Failed to find ${toSpacedCase(colname).toLowerCase()}`)
      return i
    },

    async getOneById(id: string): Promise<Schema> {
      id = idSchema().parse(id)
      return this.getOne({id} as Filter<Schema>)
    },

    async getMany(
      filter: Filter<Schema>,
      options?: FindOptions<Schema>,
      includeArchived: boolean = false
    ): Promise<Schema[]> {
      const collection = await this.getCollection()
      filter = this.preprocessQuery(filter)
      return collection
        .find(
          includeArchived ? filter : {$and: [filter, {archivedDate: null}]},
          {sort: {createdDate: -1}, ...options}
        )
        .toArray()
    },

    async aggregate(
      pipeline?: Record<string, any>[],
      options?: AggregateOptions
    ) {
      const collection = await this.getCollection()
      return collection.aggregate(pipeline, options)
    },

    async count(filter: Filter<Schema>): Promise<number> {
      const collection = await this.getCollection()
      return collection.countDocuments(this.preprocessQuery(filter))
    },

    async createOne(
      raw: Omit<OptionalKeys<Schema, "createdDate">, "id">,
      id?: string
    ): Promise<Schema> {
      const collection = await this.getCollection()
      const data = this.validateOne({
        createdDate: new Date(),
        ...raw,
        id: id ?? this.createPrefixedId(),
      })
      await collection.insertOne(data)
      return data
    },

    async createMany(
      raw: Omit<OptionalKeys<Schema, "createdDate">, "id">[]
    ): Promise<Schema[]> {
      const collection = await this.getCollection()
      const createdDate = new Date()
      const data = raw.map((i) => {
        return this.validateOne({
          createdDate,
          ...i,
          id: this.createPrefixedId(),
        })
      })
      await collection.insertMany(data)
      return data
    },

    async updateOne(
      filter: Filter<Schema>,
      raw: Partial<Schema>
    ): Promise<[Schema, number]> {
      if (raw.id) delete raw.id // don't overwrite id
      const collection = await this.getCollection()
      const old = await collection.findOne(this.preprocessQuery(filter))
      if (!old) throw new Error(`${toCapitalCase(colname)} not found`)
      const data = this.validateOne({...old, ...raw})
      const i = await collection.updateOne(filter, {$set: data})
      return [data, i.matchedCount] as const
    },

    async updateOneById(id: string, raw: Partial<Schema>) {
      id = idSchema().parse(id)
      return this.updateOne({id} as Filter<Schema>, raw)
    },

    async upsertOne(
      filter: Filter<Schema>,
      raw: Partial<Schema>
    ): Promise<Schema> {
      if (raw.id) delete raw.id // don't overwrite id
      const collection = await this.getCollection()
      const old = await collection.findOne(this.preprocessQuery(filter))
      let data: Schema
      if (old) {
        data = this.validateOne({...old, ...raw})
        await collection.updateOne(filter, {$set: data})
      } else {
        data = await this.createOne(raw as any)
      }
      return data
    },

    async archiveOne(filter: Filter<Schema>): Promise<void> {
      const collection = await this.getCollection()
      await collection.updateOne(this.preprocessQuery(filter), {
        $set: {archivedDate: new Date()},
      })
    },

    async deleteOne(filter: Filter<Schema>): Promise<void> {
      const collection = await this.getCollection()
      await collection.deleteOne(this.preprocessQuery(filter))
    },

    async deleteOneById(id: string) {
      id = idSchema().parse(id)
      return this.deleteOne({id} as Filter<Schema>)
    },

    async deleteMany(filter: Filter<Schema>): Promise<void> {
      const collection = await this.getCollection()
      await collection.deleteMany(this.preprocessQuery(filter))
    },

    createPrefixedId() {
      return [prefix, createId()].join("_")
    },

    preprocessQuery(filter: Filter<Schema>) {
      if (typeof filter !== "object") {
        return filter
      }
      for (const key in filter) {
        if (!key.startsWith("$")) continue
        if (!Array.isArray(filter[key])) continue
        if (filter[key].length === 0) {
          delete filter[key]
        } else {
          for (let i = 0; i < filter[key].length; i++) {
            filter[key][i] = this.preprocessQuery(filter[key][i])
          }
        }
      }
      return filter
    },
  }
}
