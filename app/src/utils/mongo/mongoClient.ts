import {Db, MongoClient} from "mongodb"
import {srvConf} from "../../srvConf"

let __client = new MongoClient(srvConf.MONGO_URI)
let __db: Db

export function getMongoClient() {
  return __client
}

export async function getMongoDatabase() {
  if (!__db) {
    await __client.connect()
    __db = __client.db(srvConf.MONGO_DB)
  }
  return __db
}

export async function getMongoCollection<D extends Record<string, any> = any>(
  name: string
) {
  const db = await getMongoDatabase()
  return db.collection<D>(name) // use "any" as mongodb types are awful
}

export async function createIdIndexOnCollections() {
  const db = await getMongoDatabase()
  const collections = await db.listCollections().toArray()
  for (const collection of collections) {
    const $ = await getMongoCollection(collection.name)
    await $.createIndex({id: 1}, {unique: true})
  }
}
