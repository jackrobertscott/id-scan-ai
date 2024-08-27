import {z} from "zod"
import {faceMetaSchema} from "../utils/faceMetaSchema"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {shortStrSchema} from "../utils/zodSchema"
import {DocPhotoDef} from "./docPhoto.iso"
import {LivePhotoDef} from "./livePhoto.iso"
import {UserDef} from "./user.iso"
import {VenueDef} from "./venue.iso"

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
    patronFaceMeta: faceMetaSchema(),
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
