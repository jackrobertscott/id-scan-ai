import {createMongoStore} from "../../utils/mongo/mongoStore"
import {LivePhotoDef} from "./livePhoto_storeDef.iso"

export const LivePhotoStore = createMongoStore({
  def: LivePhotoDef,
  extend: (store) => ({}),
})
