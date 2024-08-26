import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"

export type VenueType = StoreValueType<typeof VenueDef>

export const VenueDef = createStoreDef("ven", "venue", {
  name: z.string().min(1),
  stripeCustomerId: z.string().startsWith("cus_").optional(),
})
