import {createMongoStore} from "../../utils/mongo/mongoStore"
import {MembershipDef} from "./membership_storeDef.iso"

export const MembershipStore = createMongoStore({
  def: MembershipDef,
  extend: (store) => ({}),
})
