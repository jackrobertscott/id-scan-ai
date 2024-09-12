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
  if (data.slug.startsWith("/")) data.slug = data.slug.substring(1)
  data.slug =
    "/" +
    toKebabCase(data.slug.replace(/Def$/, ""))
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
  if (__globalSlugs.has(data.slug))
    throw new Error(`The slug ${data.slug} was registered multiple times.`)
  else __globalSlugs.add(data.slug)
  return data
}

export function createEdgeGroupDef<
  R extends Record<string, Omit<EdgeDef, "slug">>
>(prefix: string, routes: R): {[K in keyof R]: R[K] & Pick<EdgeDef, "slug">} {
  return Object.keys(routes).reduce((all, key) => {
    return {
      ...all,
      [key]: createEdgeDef({
        ...routes[key as keyof typeof routes],
        slug: [prefix, key].join(),
      }),
    }
  }, {} as any)
}
