import {createMongoStore} from "../../utils/mongo/mongoStore"
import {PdfExportDef} from "./pdfExport_storeDef.iso"

export const PdfExportStore = createMongoStore({
  def: PdfExportDef,
  extend: (store) => ({}),
})
