import {createEdgeGroup} from "../../utils/server/createEdge"
import {auth_email_edgeDef} from "./auth_email_edgeDef.iso"

export const auth_email_edge = createEdgeGroup(auth_email_edgeDef, {
  ping: async ({body}) => {
    return {timeAndOne: body.time + 1}
  },
})
