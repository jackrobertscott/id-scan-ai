import {
  createScanFilterQuery,
  populatePhotosOnScans,
} from "../../utils/listScanQueryUtils"
import {createListOptions} from "../../utils/mongo/listOptionUtils"
import {createListSearchQuery} from "../../utils/mongo/listSearchQueryUtils"
import {getSignedUrlOfBucketObject} from "../../utils/s3BucketUtils"
import {createEdgeGroup} from "../../utils/server/createEdge"
import {ensureUserOfAlbum} from "../auth/auth_jwt"
import {DocPhotoStore} from "../docPhoto/docPhoto_store"
import {LivePhotoStore} from "../livePhoto/livePhoto_store"
import {scan_byAlb_eDef} from "./scan_byAlb_eDef.iso"
import {ScanStore} from "./scan_store"
import {ScanType} from "./scan_storeDef.iso"

export default createEdgeGroup(scan_byAlb_eDef, {
  list: async ({request, body}) => {
    const auth = await ensureUserOfAlbum(request, body.albumId)

    const query = createListSearchQuery<ScanType>({
      ...body,
      searchKeys: ["detectedText"],
      filter: {
        venueId: auth.album.venueId,
      },
    })

    query.$and = [
      ...query.$and,
      ...(createScanFilterQuery(body).$and ?? []),
      ...(createScanFilterQuery(auth.album.filters).$and ?? []),
    ]

    const [total, scans] = await Promise.all([
      ScanStore.count(query),
      ScanStore.getMany(query, createListOptions(body)),
    ])

    // Get the photo images from the scans
    const scansAndPhotos = await populatePhotosOnScans(scans)

    return {
      total,
      scans: scansAndPhotos,
    }
  },

  get: async ({request, body}) => {
    const auth = await ensureUserOfAlbum(request, body.albumId)

    // Ensure the scan is from the user's venue
    const scan = await ScanStore.getOne({
      ...createScanFilterQuery(auth.album.filters),
      venueId: auth.album.venueId,
      id: body.scanId,
    })

    // Get the photo images from the scan
    const [livePhoto, docPhoto] = await Promise.all([
      LivePhotoStore.getOne({
        venueId: auth.album.venueId,
        id: scan.livePhotoId,
      }),
      DocPhotoStore.getOne({
        venueId: auth.album.venueId,
        id: scan.docPhotoId,
      }),
    ])

    // Get signed URLs for the photos
    const [livePhotoUrl, docPhotoUrl] = await Promise.all([
      getSignedUrlOfBucketObject(livePhoto.s3FaceImage),
      getSignedUrlOfBucketObject(docPhoto.s3FaceImage),
    ])

    // Return the scan and tags
    return {
      scan: {
        ...scan,
        livePhotoUrl,
        docPhotoUrl,
      },
    }
  },
})
