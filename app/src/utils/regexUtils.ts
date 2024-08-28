export const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const HSLA_REGEX =
  /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)$/

export function escapeRegex(value: string = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function createRegex(value: string = "") {
  return new RegExp(escapeRegex(value), "i")
}

export function normalizeRegex(value: string = "") {
  return new RegExp(`^${escapeRegex(value.trim())}$`, "i")
}
