import {useMemo} from "react"
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

export function useCnStatic<T extends Record<string, string>>(
  prefix: string,
  data: () => T
) {
  return useMemo(() => {
    return Object.entries(data()).reduce((acc, [key, value]) => {
      acc[key as keyof T] = `${toKebabCase(prefix)}-${toKebabCase(
        key
      )} ${value}`
      return acc
    }, {} as {[K in keyof T]: string})
  }, [])
}
