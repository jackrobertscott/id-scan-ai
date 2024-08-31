import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {VenueDef} from "../venue/venue_storeDef.iso"
import {AlbumDef} from "./album_storeDef.iso"

export const album_byUser_eDef = createEdgeGroupDef("album_byUser", {
  list: {
    input: listOptionsSchema(),
    output: z.object({
      total: z.number(),
      albums: z.array(
        z.object({
          ...AlbumDef.schema.pick({
            id: true,
            name: true,
            createdDate: true,
          }).shape,
          venue: VenueDef.schema.pick({
            id: true,
            name: true,
          }),
        })
      ),
    }),
  },
})
