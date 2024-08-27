import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"

export type VenueType = StoreValueType<typeof VenueDef>

export const VenueDef = createStoreDef({
  prefix: "ven",
  colname: "venue",
  indexes: ["id", "createdDate"],
  schema: {
    name: z.string().min(1),
    stripeCustomerId: z.string().startsWith("cus_").optional(),
  },
})
