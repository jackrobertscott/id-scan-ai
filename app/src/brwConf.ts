import {z} from "zod"

let _config

try {
  _config = z
    .object({
      IS_PROD: z.boolean(),
      VITE_SERVER_URL: z.string().url(),
      VITE_BROWSER_URL: z.string().url(),
      VITE_STRIPE_KEY: z.string().startsWith("pk_"),
    })
    .parse({
      ...import.meta.env,
      IS_PROD: !location.href.includes("localhost"),
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

export const brwConf = _config
