import {z} from "zod"

export function shortStrSchema() {
  return z.string().min(1).max(255).trim()
}

export function enumStrSchema(values: readonly string[]) {
  return z
    .string()
    .min(1)
    .max(255)
    .trim()
    .refine((val) => values.includes(val), {message: "Invalid value"})
}

export function idSchema(prefix?: string) {
  return z
    .string()
    .trim()
    .length(28) // prefix + 24 char hex
    .startsWith(prefix || "")
}

export function unencryptedPasswordSchema() {
  return z.string().min(5)
}

export function encryptedPasswordSchema() {
  const ARGON2_REGEX =
    /^\$argon2[di]{1,2}\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+={0,2}\$[A-Za-z0-9+/]+={0,2}$/
  return z.string().trim().regex(ARGON2_REGEX)
}

export function numberStringSchema(length: number) {
  return z.string().length(length).regex(/^\d+$/) // e.g. 025354
}

export function fileSchema() {
  return z.custom((data) => data instanceof File)
}

export function zodRefineEnum(values: readonly string[]) {
  return [
    (val: any) => typeof val === "string" && values.includes(val as any),
    {message: "Invalid value"},
  ] as const
}
