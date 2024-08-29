import {createMongoStore} from "../../utils/mongo/mongoStore"
import {MemberDef} from "./member_storeDef.iso"

export const MemberStore = createMongoStore({
  def: MemberDef,
  extend: (store) => ({}),
})
