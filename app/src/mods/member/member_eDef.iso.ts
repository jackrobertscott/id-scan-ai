import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeDefGroup} from "../../utils/server/createEdgeDef"
import {getMemberByMemberFormSchema, MemberDef} from "./member_storeDef.iso"

export const member_eDef = createEdgeDefGroup("member", {
  create_byMember: {
    input: getMemberByMemberFormSchema().extend({
      userEmail: z.string().email(),
    }),
    output: MemberDef.schema.pick({
      id: true,
    }),
  },

  get_byMember: {
    input: z.object({
      memberId: MemberDef.schema.shape.id,
    }),
    output: z.object({
      member: z.object({
        ...MemberDef.schema.pick({
          createdDate: true,
        }).shape,
        ...getMemberByMemberFormSchema().shape,
        userFullName: z.string().min(1),
        userEmail: z.string().min(1),
      }),
    }),
  },

  update_byMember: {
    input: z.object({
      memberId: MemberDef.schema.shape.id,
      ...getMemberByMemberFormSchema().shape,
    }),
  },

  list_byMember: {
    input: listOptionsSchema().extend({
      fullAccess: z.string().nullish(),
      hasPermission: z.string().nullish(),
    }),
    output: z.object({
      total: z.number(),
      members: z.array(
        z.object({
          ...MemberDef.schema.pick({
            id: true,
            permissions: true,
            createdDate: true,
          }).shape,
          userFullName: z.string().min(1),
          userEmail: z.string().min(1),
        })
      ),
    }),
  },

  delete_byMember: {
    input: z.object({
      memberId: MemberDef.schema.shape.id,
    }),
  },
})
