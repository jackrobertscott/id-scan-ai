import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {PdfExportDef} from "../pdfExport/pdfExport_storeDef.iso"
import {ScanDef} from "./scan_storeDef.iso"

export const scan_byPdf_eDef = createEdgeGroupDef("scan_byPdf", {
  list: {
    input: z.object({
      pdfExportId: PdfExportDef.schema.shape.id,
    }),
    output: z.object({
      total: z.number(),
      scans: z.array(
        z.object({
          ...ScanDef.schema.pick({
            id: true,
            docMeta: true,
            createdDate: true,
          }).shape,
          livePhotoUrl: z.string().url().optional(),
          docPhotoUrl: z.string().url().optional(),
        })
      ),
    }),
  },
})
