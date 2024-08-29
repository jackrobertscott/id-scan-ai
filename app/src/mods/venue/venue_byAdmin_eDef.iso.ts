import {z} from "zod"
import {listOptionsSchema} from "../../utils/mongo/listOptionUtils"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {UserDef} from "../user/user_storeDef.iso"
import {getVenueFormSchema, VenueDef} from "./venue_storeDef.iso"

export const venue_byAdmin_eDef = createEdgeGroupDef("venue_byAdmin", {
  create: {
    input: z.object({
      ...getVenueFormSchema().shape,
      ownerUserId: UserDef.schema.shape.id,
    }),
    output: VenueDef.schema.pick({
      id: true,
    }),
  },

  get: {
    input: z.object({
      venueId: VenueDef.schema.shape.id,
    }),
    output: z.object({
      venue: z.object({
        ...VenueDef.schema.pick({createdDate: true}).shape,
        ...getVenueFormSchema().shape,
      }),
    }),
  },

  update: {
    input: z.object({
      venueId: VenueDef.schema.shape.id,
      ...getVenueFormSchema().shape,
    }),
  },

  list: {
    input: listOptionsSchema(),
    output: z.object({
      total: z.number(),
      venues: z.array(
        VenueDef.schema.pick({
          id: true,
          name: true,
          // address: true,
          createdDate: true,
        })
      ),
    }),
  },

  delete: {
    input: z.object({
      venueId: VenueDef.schema.shape.id,
    }),
  },
})
