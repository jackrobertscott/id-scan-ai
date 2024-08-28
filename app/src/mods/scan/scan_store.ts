import {createMongoStore} from "../../utils/mongo/mongoStore"
import {ScanDef} from "./scan_storeDef.iso"

export const ScanStore = createMongoStore({
  def: ScanDef,
  extend: (store) => ({}),
})
