import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {LivePhotoDef} from "../livePhoto/livePhoto_storeDef.iso"
import {FaceTagDef, getFaceTagFormSchema} from "./faceTag_storeDef.iso"

export const faceTag_byMember_eDef = createEdgeGroupDef("faceTag_byMember", {
  create: {
    input: z.object({
      ...FaceTagDef.schema.pick({scanId: true}).shape,
      ...getFaceTagFormSchema().shape,
    }),
    output: FaceTagDef.schema.pick({
      id: true,
    }),
  },

  get: {
    input: z.object({
      tagId: FaceTagDef.schema.shape.id,
    }),
    output: z.object({
      tag: z.object({
        ...getFaceTagFormSchema().shape,
        ...FaceTagDef.schema.pick({
          expiry: true,
          createdDate: true,
        }).shape,
        livePhotoId: LivePhotoDef.schema.shape.id.nullish(),
      }),
    }),
  },

  update: {
    input: z.object({
      tagId: FaceTagDef.schema.shape.id,
      ...getFaceTagFormSchema().shape,
    }),
  },

  list: {
    input: listOptionsSchema().extend({
      category: z.string().nullish(),
      expiresAfterDate: z.coerce.date().nullish(),
      expiresBeforeDate: z.coerce.date().nullish(),
    }),
    output: z.object({
      total: z.number(),
      tags: z.array(
        z.object({
          ...FaceTagDef.schema.pick({
            id: true,
            category: true,
            desc: true,
            expiry: true,
            createdDate: true,
          }).shape,
          photoUrl: z.string().url().optional(),
        })
      ),
    }),
  },

  delete: {
    input: z.object({
      tagId: FaceTagDef.schema.shape.id,
    }),
  },
})
