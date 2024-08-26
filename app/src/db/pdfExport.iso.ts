import {z} from "zod"
import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {s3FileSchema} from "../utils/s3SchemaUtils"
import {shortStrSchema} from "../utils/zodSchema"
import {UserDef} from "./user.iso"
import {VenueDef} from "./venue.iso"

export type PdfExportType = StoreValueType<typeof PdfExportDef>

export const PdfExportDef = createStoreDef("pdx", "pdfExport", {
  user_id: UserDef.schema.shape.id,
  venue_id: VenueDef.schema.shape.id,
  s3PdfFile: s3FileSchema().optional(),
  name: shortStrSchema(),
  filters: z.object({
    createdAfterDate: z.coerce.date(),
    createdBeforeDate: z.coerce.date(),
    gender: shortStrSchema().nullish(),
    postCode: shortStrSchema().nullish(),
    hasFaceMismatch: z.boolean().nullish(),
  }),
})
