import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {getVenueFormSchema, VenueDef} from "./venue_storeDef.iso"

export const ven_byMbr_eDef = createEdgeGroupDef("ven_byMbr", {
  get: {
    output: z.object({
      venue: z.object({
        ...VenueDef.schema.pick({createdDate: true}).shape,
        ...getVenueFormSchema().shape,
      }),
    }),
  },

  update: {
    input: z.object({
      ...getVenueFormSchema().shape,
    }),
  },

  deleteCurrent: {},
})
