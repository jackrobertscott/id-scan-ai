import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {AlbumDef, getAlbumFormSchema} from "./album_storeDef.iso"

export const album_byMember_eDef = createEdgeGroupDef("album_byMember", {
  create: {
    input: getAlbumFormSchema(),
    output: AlbumDef.schema.pick({
      id: true,
    }),
  },

  get: {
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

  update: {
    input: z.object({
      albumId: AlbumDef.schema.shape.id,
      ...getAlbumFormSchema().shape,
    }),
  },

  list: {
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

  delete: {
    input: z.object({
      albumId: AlbumDef.schema.shape.id,
    }),
  },
})
