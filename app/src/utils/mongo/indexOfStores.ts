import {IndexDescription} from "mongodb"
import {AlbumStore} from "../../mods/album/album_store"
import {DeviceStore} from "../../mods/device/device_store"
import {DocPhotoStore} from "../../mods/docPhoto/docPhoto_store"
import {FaceTagStore} from "../../mods/faceTag/faceTag_store"
import {LivePhotoStore} from "../../mods/livePhoto/livePhoto_store"
import {LogEventStore} from "../../mods/logEvent/logEvent_store"
import {MemberStore} from "../../mods/member/member_store"
import {PdfExportStore} from "../../mods/pdfExport/pdfExport_store"
import {ScanStore} from "../../mods/scan/scan_store"
import {UserStore} from "../../mods/user/user_store"
import {VenueStore} from "../../mods/venue/venue_store"

export const createMongoStoreIndexes = async () => {
  const stores = [
    AlbumStore,
    DeviceStore,
    DocPhotoStore,
    FaceTagStore,
    LivePhotoStore,
    LogEventStore,
    MemberStore,
    PdfExportStore,
    ScanStore,
    VenueStore,
    UserStore,
  ]
  await Promise.all(
    stores.map(async (store) => {
      const col = await store.getCollection()
      await col.createIndexes(
        store.indexes.map((index): IndexDescription => {
          if (index === "id") {
            return {key: {id: 1}, unique: true}
          }
          return {key: {[index]: 1}}
        })
      )
    })
  )
}
