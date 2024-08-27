import {z, ZodObject} from "zod"
import {toKebabCase} from "../changeCase"

export interface EdgeDef {
  slug: string
  public?: boolean
  input?: ZodObject<any>
  output?: ZodObject<any>
}

export type EdgeInput<E extends EdgeDef> = E["input"] extends ZodObject<any>
  ? z.infer<E["input"]>
  : undefined

export type EdgeOutput<
  E extends EdgeDef,
  F
> = E["output"] extends ZodObject<any> ? z.infer<E["output"]> : F

export type EdgeInputSchema<E extends EdgeDef> = NonNullable<
  E["input"]
>["shape"]

const __globalSlugs = new Set<string>()

export function createEdgeDef<E extends EdgeDef>(data: E) {
  if (__globalSlugs.has(data.slug))
    throw new Error(`The slug ${data.slug} was registered multiple times.`)
  else __globalSlugs.add(data.slug)
  if (!data.slug.startsWith("/")) data.slug = "/" + data.slug
  data.slug = toKebabCase(data.slug.replace(/Def$/, ""))
  return data
}

export function createEdgeDefGroup<
  R extends Record<string, Omit<EdgeDef, "slug">>
>(prefix: string, routes: R): {[K in keyof R]: R[K] & Pick<EdgeDef, "slug">} {
  return Object.keys(routes).reduce((all, key) => {
    const route = routes[key as keyof typeof routes]
    if (!prefix.startsWith("/")) prefix = "/" + prefix
    return {
      ...all,
      [key]: {...route, slug: prefix + "/" + key},
    }
  }, {} as any)
}
