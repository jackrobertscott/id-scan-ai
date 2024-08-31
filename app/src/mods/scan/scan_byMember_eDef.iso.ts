import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {DocPhotoDef} from "../docPhoto/docPhoto_storeDef.iso"
import {FaceTagDef} from "../faceTag/faceTag_storeDef.iso"
import {LivePhotoDef} from "../livePhoto/livePhoto_storeDef.iso"
import {ScanDef} from "./scan_storeDef.iso"

export const scan_byMember_eDef = createEdgeGroupDef("scan_byMember", {
  get: {
    input: z.object({
      scanId: ScanDef.schema.shape.id,
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
        patronPhotoUrl: z.string().url(),
        documentPhotoUrl: z.string().url(),
      }),
      tags: z.array(
        FaceTagDef.schema.pick({
          id: true,
          category: true,
          desc: true,
          expiry: true,
        })
      ),
    }),
  },

  uploadLivePhoto: {
    input: z.object({
      livePhotoFile: z.any(),
    }),
    output: z.object({
      livePhotoId: LivePhotoDef.schema.shape.id,
      livePhotoUrl: z.string().url(),
    }),
  },

  uploadDocPhotoAndCreate: {
    input: z.object({
      livePhotoId: LivePhotoDef.schema.shape.id,
      docPhotoFile: z.any(),
    }),
    output: ScanDef.schema.pick({
      id: true,
    }),
  },

  createFromPreviousDocPhoto: {
    input: z.object({
      livePhotoId: LivePhotoDef.schema.shape.id,
      docPhotoId: DocPhotoDef.schema.shape.id,
    }),
    output: ScanDef.schema.pick({
      id: true,
    }),
  },

  listSimilarDocPhotos: {
    input: z.object({
      livePhotoId: LivePhotoDef.schema.shape.id,
    }),
    output: z.object({
      docPhotos: z.array(
        z.object({
          ...DocPhotoDef.schema.pick({
            id: true,
            createdDate: true,
          }).shape,
          scan: ScanDef.schema.nullish(),
          photoUrl: z.string().url(),
        })
      ),
    }),
  },
})
