import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {idSchema} from "../../utils/zodSchema"
import {getPdfExportFormSchema, PdfExportDef} from "./pdfExport_storeDef.iso"

export const pdfExport_byMember_eDef = createEdgeGroupDef("pdfExport", {
  create: {
    input: getPdfExportFormSchema(),
    output: PdfExportDef.schema.pick({
      id: true,
    }),
  },

  get: {
    input: z.object({
      pdfExportId: PdfExportDef.schema.shape.id,
    }),
    output: z.object({
      pdfExport: z.object({
        ...PdfExportDef.schema.pick({
          createdDate: true,
        }).shape,
        ...getPdfExportFormSchema().shape,
        pdfUrl: z.string().url().optional(),
      }),
    }),
  },

  download: {
    input: z.object({
      pdfExportId: idSchema(),
    }),
  },

  list: {
    input: listOptionsSchema(),
    output: z.object({
      total: z.number(),
      pdfExports: z.array(
        PdfExportDef.schema.pick({
          id: true,
          name: true,
          createdDate: true,
        })
      ),
    }),
  },

  delete: {
    input: z.object({
      pdfExportId: PdfExportDef.schema.shape.id,
    }),
  },
})
