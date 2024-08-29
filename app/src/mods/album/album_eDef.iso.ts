import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {VenueDef} from "../venue/venue_storeDef.iso"
import {AlbumDef, getAlbumFormSchema} from "./album_storeDef.iso"

export const album_eDef = createEdgeDefGroup("album", {
  create_byMember: {
    input: getAlbumFormSchema(),
    output: AlbumDef.schema.pick({
      id: true,
    }),
  },

  get_byMember: {
    input: z.object({
      albumId: AlbumDef.schema.shape.id,
    }),
    output: z.object({
      album: z.object({
        ...AlbumDef.schema.pick({
          id: true,
          createdDate: true,
        }).shape,
        ...getAlbumFormSchema().shape,
      }),
    }),
  },

  update_byMember: {
    input: z.object({
      albumId: AlbumDef.schema.shape.id,
      ...getAlbumFormSchema().shape,
    }),
  },

  list_byMember: {
    input: listOptionsSchema().extend({
      status: z.string().nullish(),
    }),
    output: z.object({
      total: z.number(),
      albums: z.array(
        AlbumDef.schema.pick({
          id: true,
          emails: true,
          name: true,
          isActive: true,
          createdDate: true,
        })
      ),
    }),
  },

  list_byUser: {
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

  delete_byMember: {
    input: z.object({
      albumId: AlbumDef.schema.shape.id,
    }),
  },
})
