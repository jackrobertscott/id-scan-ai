import {StoreValueType, createStoreDef} from "../utils/mongo/baseStore"
import {AccountDef} from "./account.iso"
import {VenueDef} from "./venue.iso"

export type ScanType = StoreValueType<typeof ScanDef>

export const ScanDef = createStoreDef("scn", "Scan", {
  venueId: VenueDef.schema.shape.id,
  createdByAccId: AccountDef.schema.shape.id,
})
