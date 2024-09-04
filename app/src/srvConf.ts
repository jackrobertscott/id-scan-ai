import dotenv from "dotenv"
import {resolve} from "path"
import {z} from "zod"

dotenv.config({
  path: resolve(import.meta.dirname, "../.env"),
})

let _config

try {
  _config = z
    .object({
      PORT: z.coerce.number(),
      APP_NAME: z.string().min(1),
      JWT_SECRET: z.string().min(1),
      URL_CLIENT: z.string().min(1),
      MONGO_URI: z.string().min(1),
      MONGO_DB: z.string().min(1),
      AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
      AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
      AWS_DEFAULT_REGION: z.string().min(1),
      AWS_S3_BUCKET: z.string().min(1),
      AWS_S3_BUCKET_FOLDER: z.string().min(1),
      AWS_SES_FROM_EMAIL: z.string().min(1),
      AWS_REKOG_COLNAME_PREFIX: z.string().min(1),
      STRIPE_SECRET_KEY: z.string().min(1).startsWith("sk_"),
      STRIPE_ENABLED: z.boolean().optional(),
      IS_DEV: z.boolean().optional(),
    })
    .parse({
      ...process.env,
      IS_DEV: process.env.URL_CLIENT?.includes("localhost"),
      STRIPE_ENABLED: (process.env.STRIPE_SECRET_KEY || "").length > 10,
    })
} catch (e) {
  if (e instanceof z.ZodError) {
    const message = ["Invalid environment variables"]
      .concat(e.errors.map((e) => [e.path.join("."), e.message].join(": ")))
      .join("\n")
    throw new Error(message)
  }
  throw e
}

export const srvConf = _config
