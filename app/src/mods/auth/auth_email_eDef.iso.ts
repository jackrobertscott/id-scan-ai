import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {AuthDataSchema} from "./auth_schemas"

export const auth_email_eDef = createEdgeGroupDef("auth_email", {
  sendAuthCode: {
    input: z.object({
      email: z.string().email(),
    }),
    output: z.object({
      email: z.string().email(),
    }),
  },

  verifyAuthCode: {
    input: z.object({
      email: z.string().email(),
      authCode: z.string().min(1),
      userAgent: z.string().nullish(),
    }),
    output: z.object({
      payload: z.object({
        token: z.string().min(1),
        data: AuthDataSchema,
      }),
    }),
  },
})
