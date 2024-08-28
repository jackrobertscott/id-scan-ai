import {createEdgeGroup} from "../../utils/server/createEdge"
import {root_eDef} from "./root_eDef.iso"

export const root_edge = createEdgeGroup(root_eDef, {
  ping: async ({body}) => {
    return {
      timeAndOne: body.time + 1,
    }
  },
})
