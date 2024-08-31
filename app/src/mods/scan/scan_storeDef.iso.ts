import {z} from "zod"
import {faceMetaSchema} from "../../utils/faceMetaSchema"
import {createStoreDef, StoreValueType} from "../../utils/mongo/baseStore"
import {shortStrSchema} from "../../utils/zodSchema"
import {DocPhotoDef} from "../docPhoto/docPhoto_storeDef.iso"
import {LivePhotoDef} from "../livePhoto/livePhoto_storeDef.iso"
import {UserDef} from "../user/user_storeDef.iso"
import {VenueDef} from "../venue/venue_storeDef.iso"

export type ScanType = StoreValueType<typeof ScanDef>

export const ScanDef = createStoreDef({
  prefix: "scn",
  colname: "Scan",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    createdByUserId: UserDef.schema.shape.id,
    livePhotoId: LivePhotoDef.schema.shape.id,
    docPhotoId: DocPhotoDef.schema.shape.id,
    faceSimilarity: z.number().gte(0).lte(100),
    liveFaceMeta: faceMetaSchema(),
    detectedText: z.string(),
    docMeta: z.object({
      docType: shortStrSchema().nullish(),
      docRegion: shortStrSchema().nullish(),
      licenceNo: shortStrSchema().nullish(),
      postCode: shortStrSchema().nullish(),
      suburb: shortStrSchema().nullish(),
      birthDate: z.coerce.date().nullish(),
    }),
  },
})

export type ScanLargeFilterFormSchema = ReturnType<
  typeof getScanFilterFormSchema
>

export const getScanLargeFilterFormSchema = () => {
  return z.object({
    createdAfterDate: z.coerce.date().nullish(),
    createdBeforeDate: z.coerce.date().nullish(),
    primaryEmotion: z.string().nullish(),
    postCode: z.string().nullish(),
    bornAfterDate: z.coerce.date().nullish(),
    bornBeforeDate: z.coerce.date().nullish(),
    gender: z.string().nullish(),
    hasFaceMismatch: z.boolean().nullish(),
    hasGlasses: z.boolean().nullish(),
    hasSunglasses: z.boolean().nullish(),
    hasBeard: z.boolean().nullish(),
    hasMustache: z.boolean().nullish(),
    hasSmile: z.boolean().nullish(),
  })
}

export type ScanFilterFormSchema = ReturnType<typeof getScanFilterFormSchema>

export const getScanFilterFormSchema = () =>
  getScanLargeFilterFormSchema().pick({
    createdAfterDate: true,
    createdBeforeDate: true,
    gender: true,
    postCode: true,
    hasFaceMismatch: true,
  })
