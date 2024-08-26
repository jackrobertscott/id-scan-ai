import {createMongoStore} from "../utils/mongo/mongoStore"
import {MembershipDef} from "./membership.iso"
import {UserDef} from "./user.iso"
import {VenueDef} from "./venue.iso"

export const UserStore = createMongoStore(UserDef)
export const VenueStore = createMongoStore(VenueDef)
export const MembershipStore = createMongoStore(MembershipDef)
