import {z} from "zod"

export function serverFileSchema() {
  return z.object({
    buffer: z.instanceof(Buffer),
    filename: z.string().min(1),
    encoding: z.string().min(1),
    mimeType: z.string().min(1),
  })
}
