import {AccountDef, MembershipDef, VenueDef} from "./db.shared"
import {createMongoStore} from "./utils/mongo/mongoStore"

export const AccountStore = createMongoStore(AccountDef)
export const VenueStore = createMongoStore(VenueDef)
export const MembershipStore = createMongoStore(MembershipDef)
