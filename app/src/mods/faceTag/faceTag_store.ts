import {createMongoStore} from "../../utils/mongo/mongoStore"
import {FaceTagDef} from "./faceTag_storeDef.iso"

export const FaceTagStore = createMongoStore({
  def: FaceTagDef,
  extend: (store) => ({}),
})
