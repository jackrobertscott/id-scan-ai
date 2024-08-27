import {IndexDescription} from "mongodb"
import {createMongoStore} from "../utils/mongo/mongoStore"
import {AlbumDef} from "./album_storeDef.iso"
import {DeviceDef} from "./device_storeDef.iso"
import {DocPhotoDef} from "./docPhoto_storeDef.iso"
import {FaceTagDef} from "./faceTag_storeDef.iso"
import {LivePhotoDef} from "./livePhoto_storeDef.iso"
import {LogEventDef} from "./logEvent_storeDef.iso"
import {MembershipDef} from "./membership_storeDef.iso"
import {PdfExportDef} from "./pdfExport_storeDef.iso"
import {ScanDef} from "./scan_storeDef.iso"
import {UserDef} from "./user_storeDef.iso"
import {VenueDef} from "./venue_storeDef.iso"

export const AlbumStore = createMongoStore(AlbumDef)
export const DeviceStore = createMongoStore(DeviceDef)
export const DocPhotoStore = createMongoStore(DocPhotoDef)
export const FaceTagStore = createMongoStore(FaceTagDef)
export const LivePhotoStore = createMongoStore(LivePhotoDef)
export const LogEventStore = createMongoStore(LogEventDef)
export const MembershipStore = createMongoStore(MembershipDef)
export const PdfExportStore = createMongoStore(PdfExportDef)
export const ScanStore = createMongoStore(ScanDef)
export const VenueStore = createMongoStore(VenueDef)
export const UserStore = createMongoStore(UserDef)

export const createMongoStoreIndexes = async () => {
  const stores = [
    AlbumStore,
    DeviceStore,
    DocPhotoStore,
    FaceTagStore,
    LivePhotoStore,
    LogEventStore,
    MembershipStore,
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
