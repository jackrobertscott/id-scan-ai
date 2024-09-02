import {
  createScanFilterQuery,
  populatePhotosOnScans,
} from "../../utils/listScanQueryUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureMemberOfVenue} from "../auth/auth_jwt"
import {MEMBER_PERMISSIONS_OBJ} from "../member/member_storeDef.iso"
import {PdfExportStore} from "../pdfExport/pdfExport_store"
import {scan_byPdf_eDef} from "./scan_byPdf_eDef.iso"
import {ScanStore} from "./scan_store"
import {ScanType} from "./scan_storeDef.iso"

export default createEdgeGroup(scan_byPdf_eDef, {
  list: async ({request, body}) => {
    const auth = await ensureMemberOfVenue(request, [
      MEMBER_PERMISSIONS_OBJ.PDF_EXPORT_CREATE,
    ])

    const pdfExport = await PdfExportStore.getOne({
      venueId: auth.venue.id,
      id: body.pdfExportId,
    })

    const query = createListSearchQuery<ScanType>({
      ...body,
      searchKeys: ["detectedText"],
      filter: {
        venueId: pdfExport.venueId,
      },
    })

    query.$and = [
      ...query.$and,
      ...(createScanFilterQuery(pdfExport.filters).$and ?? []),
    ]

    const [total, scans] = await Promise.all([
      ScanStore.count(query),
      ScanStore.getMany(query),
    ])

    // Get the photo images from the scans
    const scansAndPhotos = await populatePhotosOnScans(scans)

    return {
      total,
      scans: scansAndPhotos,
    }
  },
})
