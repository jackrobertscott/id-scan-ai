import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {LivePhotoDef} from "../livePhoto/livePhoto_storeDef.iso"
import {FaceTagDef, getFaceTagSchema} from "./faceTag_storeDef.iso"

export const faceTag_eDef = createEdgeDefGroup("faceTag", {
  create_byMember: {
    input: z.object({
      ...FaceTagDef.schema.pick({scanId: true}).shape,
      ...getFaceTagSchema().shape,
    }),
    output: FaceTagDef.schema.pick({
      id: true,
    }),
  },

  get_byMember: {
    input: z.object({
      tagId: FaceTagDef.schema.shape.id,
    }),
    output: z.object({
      tag: z.object({
        ...getFaceTagSchema().shape,
        ...FaceTagDef.schema.pick({
          expiry: true,
          createdDate: true,
        }).shape,
        livePhotoId: LivePhotoDef.schema.shape.id.nullish(),
      }),
    }),
  },

  update_byMember: {
    input: z.object({
      tagId: FaceTagDef.schema.shape.id,
      ...getFaceTagSchema().shape,
    }),
  },

  list_byMember: {
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

  delete_byMember: {
    input: z.object({
      tagId: FaceTagDef.schema.shape.id,
    }),
  },
})
