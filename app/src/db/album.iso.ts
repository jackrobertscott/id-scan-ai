import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {shortStrSchema} from "../utils/zodSchema"
import {AccountDef} from "./account.iso"
import {VenueDef} from "./venue.iso"

export type AlbumType = StoreValueType<typeof AlbumDef>

export const AlbumDef = createStoreDef("abm", "album", {
  venueId: VenueDef.schema.shape.id,
  createdByAccId: AccountDef.schema.shape.id,
  isActive: z.boolean().nullish(),
  emails: z.array(z.string().email()),
  name: shortStrSchema(),
  filters: z.object({
    createdAfterDate: z.coerce.date(),
    createdBeforeDate: z.coerce.date(),
    gender: shortStrSchema().nullish(),
    postCode: shortStrSchema().nullish(),
    hasFaceMismatch: z.boolean().nullish(),
  }),
})
