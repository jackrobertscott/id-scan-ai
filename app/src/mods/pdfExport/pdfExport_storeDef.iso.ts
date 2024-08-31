import {z} from "zod"
import {StoreValueType, createStoreDef} from "../../utils/mongo/baseStore"
import {s3FileSchema} from "../../utils/s3SchemaUtils"
import {shortStrSchema} from "../../utils/zodSchema"
import {getScanFilterFormSchema} from "../scan/scan_storeDef.iso"
import {UserDef} from "../user/user_storeDef.iso"
import {VenueDef} from "../venue/venue_storeDef.iso"

export type PdfExportType = StoreValueType<typeof PdfExportDef>

export const PdfExportDef = createStoreDef({
  prefix: "pdx",
  colname: "pdfExport",
  indexes: ["id", "createdDate", "venueId"],
  schema: {
    venueId: VenueDef.schema.shape.id,
    createdByUserId: UserDef.schema.shape.id,
    name: shortStrSchema(),
    s3PdfFile: s3FileSchema().optional(),
    filters: getScanFilterFormSchema(),
  },
})

export type PdfExportFormSchema = ReturnType<
  typeof getPdfExportFormSchema
>["shape"]

export const getPdfExportFormSchema = () =>
  z.object({
    ...PdfExportDef.schema.pick({
      name: true,
      filters: true,
    }).shape,
  })
