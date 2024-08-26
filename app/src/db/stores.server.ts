import {createMongoStore} from "../utils/mongo/mongoStore"
import {AccountDef} from "./account.iso"
import {MembershipDef} from "./membership.iso"
import {VenueDef} from "./venue.iso"

export const AccountStore = createMongoStore(AccountDef)
export const VenueStore = createMongoStore(VenueDef)
export const MembershipStore = createMongoStore(MembershipDef)
