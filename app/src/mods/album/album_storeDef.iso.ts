import {z} from "zod"
import {StoreValueType, createStoreDef} from "../../utils/mongo/baseStore"
import {shortStrSchema} from "../../utils/zodSchema"
import {UserDef} from "../user/user_storeDef.iso"
import {VenueDef} from "../venue/venue_storeDef.iso"
import {getScanFilterFormSchema} from "../scan/scan_storeDef.iso"

export type AlbumType = StoreValueType<typeof AlbumDef>

export const AlbumDef = createStoreDef({
  prefix: "abm",
  colname: "album",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    createdByUserId: UserDef.schema.shape.id,
    isActive: z.boolean().nullish(),
    emails: z.array(z.string().email()),
    name: shortStrSchema(),
    filters: getScanFilterFormSchema(),
  },
})

export type AlbumFormSchema = ReturnType<typeof getAlbumFormSchema>["shape"]

export const getAlbumFormSchema = () =>
  AlbumDef.schema.pick({
    isActive: true,
    emails: true,
    name: true,
    filters: true,
  })
