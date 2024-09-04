import {toKebabCase} from "./changeCase"

const __cn_set__ = new Set<string>()

export const prettyCns = <T extends Record<string, string>>(
  prefix: string,
  data: T
) => {
  if (false) {
    const cn_prefix = toKebabCase(prefix)
    if (__cn_set__.has(cn_prefix))
      throw new Error(`Duplicate prefix: ${cn_prefix}`)
    __cn_set__.add(cn_prefix)
  }
  return Object.entries(data).reduce((all, [key, value]) => {
    if (!value.startsWith("css-")) throw new Error("Invalid css value")
    return {
      ...all,
      [key]: [toKebabCase([prefix, key].join("-")), value].join(" "),
    }
  }, {} as T)
}

export type Cns = string | undefined | null | false | Cns[]
export function jn_cn(...classNames: Cns[]): string {
  return classNames
    .map((i) => (Array.isArray(i) ? jn_cn(...i) : i))
    .filter(Boolean)
    .join(" ")
}
