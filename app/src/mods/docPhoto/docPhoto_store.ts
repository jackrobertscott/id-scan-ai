import {createMongoStore} from "../../utils/mongo/mongoStore"
import {DocPhotoDef} from "./docPhoto_storeDef.iso"

export const DocPhotoStore = createMongoStore({
  def: DocPhotoDef,
  extend: (store) => ({}),
})
