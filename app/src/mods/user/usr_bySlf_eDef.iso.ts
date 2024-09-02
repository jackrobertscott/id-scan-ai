import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {getUserFaceAuthSchema, UserDef} from "./user_storeDef.iso"

export const usr_bySlf_eDef = createEdgeGroupDef("user_bySelf", {
  get: {
    output: z.object({
      user: UserDef.schema.pick({
        email: true,
        firstName: true,
        lastName: true,
        faceAuth: true,
      }),
    }),
  },

  update: {
    input: UserDef.schema.pick({
      firstName: true,
      lastName: true,
    }),
  },

  updateFace: {
    input: z.object({
      photoFile: z.any(),
      ...getUserFaceAuthSchema().pick({
        passcode: true,
      }).shape,
    }),
  },
})
