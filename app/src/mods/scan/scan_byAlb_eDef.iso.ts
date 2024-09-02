import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {AlbumDef} from "../album/album_storeDef.iso"
import {ScanDef} from "./scan_storeDef.iso"

export const scan_byAlb_eDef = createEdgeGroupDef("scan_byAlb", {
  list: {
    input: listOptionsSchema().extend({
      albumId: AlbumDef.schema.shape.id,
    }),
    output: z.object({
      total: z.number(),
      scans: z.array(
        z.object({
          ...ScanDef.schema.pick({
            id: true,
            createdDate: true,
          }).shape,
          livePhotoUrl: z.string().url().optional(),
          docPhotoUrl: z.string().url().optional(),
        })
      ),
    }),
  },

  get: {
    input: z.object({
      scanId: ScanDef.schema.shape.id,
      albumId: AlbumDef.schema.shape.id,
    }),
    output: z.object({
      scan: z.object({
        ...ScanDef.schema.pick({
          id: true,
          livePhotoId: true,
          createdDate: true,
          faceSimilarity: true,
          liveFaceMeta: true,
          docMeta: true,
          detectedText: true,
        }).shape,
        livePhotoUrl: z.string().url(),
        docPhotoUrl: z.string().url(),
      }),
    }),
  },
})
