import {z} from "zod"

export type S3ImageSchema = z.infer<ReturnType<typeof s3ImageSchema>>

export const s3ImageSchema = () =>
  z.object({
    key: z.string().min(1),
    bucket: z.string().min(1),
    region: z.string().min(1),
    bytes: z.number().gt(0),
    height: z.number().gt(0),
    width: z.number().gt(0),
  })

export type S3FileSchema = z.infer<ReturnType<typeof s3ImageSchema>>

export const s3FileSchema = () =>
  z.object({
    key: z.string().min(1),
    bucket: z.string().min(1),
    region: z.string().min(1),
    bytes: z.number().gt(0),
  })
