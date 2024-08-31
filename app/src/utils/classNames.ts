import {toKebabCase} from "./changeCase"

export const createCns = <T extends Record<string, string>>(data: T) => {
  return Object.entries(data).reduce((all, [key, value]) => {
    if (!value.startsWith("css-")) throw new Error("Invalid css value")
    return {
      ...all,
      [key]: [toKebabCase(key), value].join(" "),
    }
  }, {} as T)
}

export const cn_jn = (classNames: Array<string | undefined | null | false>) => {
  return classNames.filter(Boolean).join(" ")
}
