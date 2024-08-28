import {createMongoStore} from "../../utils/mongo/mongoStore"
import {LogEventDef} from "./logEvent_storeDef.iso"

export const LogEventStore = createMongoStore({
  def: LogEventDef,
  extend: (store) => ({}),
})
