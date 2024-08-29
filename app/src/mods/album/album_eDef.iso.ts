import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {VenueDef} from "../venue/venue_storeDef.iso"
import {AlbumDef, getAlbumFormSchema} from "./album_storeDef.iso"

export const album_eDef = createEdgeDefGroup("album", {
  createByMember: {
    input: getAlbumFormSchema(),
    output: AlbumDef.schema.pick({
      id: true,
    }),
  },

  getByMember: {
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

  updateByMember: {
    input: z.object({
      albumId: AlbumDef.schema.shape.id,
      ...getAlbumFormSchema().shape,
    }),
  },

  listByMember: {
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

  listByUser: {
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

  deleteByMember: {
    input: z.object({
      albumId: AlbumDef.schema.shape.id,
    }),
  },
})
