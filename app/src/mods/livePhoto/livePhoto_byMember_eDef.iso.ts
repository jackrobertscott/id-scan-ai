import {z} from "zod"
import {createEdgeGroupDef} from "../../utils/server/createEdgeDef"
import {ScanDef} from "../scan/scan_storeDef.iso"
import {LivePhotoDef} from "./livePhoto_storeDef.iso"

export const livePhoto_byMember_eDef = createEdgeGroupDef(
  "livePhoto_byMember_eDef",
  {
    listSimilar: {
      input: z.object({
        photoFile: z.any().nullish(),
        livePhotoId: LivePhotoDef.schema.shape.id.nullish(),
      }),
      output: z.object({
        livePhotos: z.array(
          z.object({
            ...LivePhotoDef.schema.pick({
              id: true,
              createdDate: true,
            }).shape,
            photoUrl: z.string().url(),
            scan: ScanDef.schema.nullish(),
          })
        ),
      }),
    },
  }
)
