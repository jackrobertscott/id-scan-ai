import {createEdgeGroup} from "../../utils/server/createEdge"
import {album_eDef} from "./album_eDef.iso"

export default createEdgeGroup(album_eDef, {
  example: async ({body}) => {
    console.log(body.hello)
  },
})
