import {toKebabCase} from "./changeCase"

const __cn_set__ = new Set<string>()

export const createCns = <T extends Record<string, string>>(
  prefix: string,
  data: T
) => {
  return Object.entries(data).reduce((all, [key, value]) => {
    if (!value.startsWith("css-")) throw new Error("Invalid css value")
    const cn_prefix = toKebabCase(prefix)
    if (__cn_set__.has(cn_prefix))
      throw new Error(`Duplicate prefix: ${cn_prefix}`)
    __cn_set__.add(cn_prefix)
    return {
      ...all,
      [key]: [toKebabCase([prefix, key].join("-")), value].join(" "),
    }
  }, {} as T)
}

export const jn_cns = (
  classNames: Array<string | undefined | null | false>
) => {
  return classNames.filter(Boolean).join(" ")
}
