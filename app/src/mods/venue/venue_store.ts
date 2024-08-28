import {createMongoStore} from "../../utils/mongo/mongoStore"
import {VenueDef} from "./venue_storeDef.iso"

export const VenueStore = createMongoStore({
  def: VenueDef,
  extend: (store) => ({}),
})
