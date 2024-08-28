import {createMongoStore} from "../../utils/mongo/mongoStore"
import {SessionDef} from "./session_storeDef.iso"

export const SessionStore = createMongoStore({
  def: SessionDef,
  extend: (store) => ({}),
})
