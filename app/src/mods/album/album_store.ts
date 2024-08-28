import {createMongoStore} from "../../utils/mongo/mongoStore"
import {AlbumDef} from "./album_storeDef.iso"

export const AlbumStore = createMongoStore({
  def: AlbumDef,
  extend: (store) => ({}),
})
