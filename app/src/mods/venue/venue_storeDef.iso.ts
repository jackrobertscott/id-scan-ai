import {z} from "zod"
import {StoreValueType, createStoreDef} from "../../utils/mongo/baseStore"
import {UserDef} from "../user/user_storeDef.iso"

export type VenueType = StoreValueType<typeof VenueDef>

export const VenueDef = createStoreDef({
  prefix: "ven",
  colname: "venue",
  indexes: ["id", "createdDate"],
  schema: {
    createdByUserId: UserDef.schema.shape.id,
    name: z.string().min(1),
    stripeCustomerId: z.string().startsWith("cus_").optional(),
  },
})

export type VenueFormSchema = ReturnType<typeof getVenueFormSchema>["shape"]

export const getVenueFormSchema = () =>
  VenueDef.schema.pick({
    name: true,
    // maxCapacity: true,
    // invoiceEmail: true,
    // address: true,
  })
