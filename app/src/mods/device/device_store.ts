import {createMongoStore} from "../../utils/mongo/mongoStore"
import {DeviceDef} from "./device_storeDef.iso"

export const DeviceStore = createMongoStore({
  def: DeviceDef,
  extend: (store) => ({}),
})
