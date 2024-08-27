/**
 * Checks if an object is a buffer.
 */
function checkIfBuffer(obj: any): boolean {
  return (
    obj &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === "function" &&
    obj.constructor.isBuffer(obj)
  )
}

/**
 * Identity function that returns the input key.
 */
const defaultKeyTransform = (key: string): string => key

/**
 * Flattens an object into a single-level object with dot-separated keys.
 */
export function flatten(
  target: any,
  opts: {
    delimiter?: string
    maxDepth?: number
    transformKey?: (key: string) => string
    safe?: boolean
  } = {}
): Record<string, any> {
  const {
    delimiter = ".",
    maxDepth,
    transformKey = defaultKeyTransform,
    safe = false,
  } = opts
  const output: Record<string, any> = {}

  function step(
    object: Record<string, any>,
    prev?: string,
    currentDepth = 1
  ): void {
    Object.keys(object).forEach((key) => {
      const value = object[key]
      const isArray = safe && Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isBuffer = checkIfBuffer(value)
      const isObject = type === "[object Object]" || type === "[object Array]"

      const newKey = prev
        ? `${prev}${delimiter}${transformKey(key)}`
        : transformKey(key)

      if (
        !isArray &&
        !isBuffer &&
        isObject &&
        Object.keys(value).length &&
        (!maxDepth || currentDepth < maxDepth)
      ) {
        step(value, newKey, currentDepth + 1)
      } else {
        output[newKey] = value
      }
    })
  }

  step(target)

  return output
}

/**
 * Unflattens a flattened object back into its original nested structure.
 */
export function unflatten(
  target: any,
  opts: {
    delimiter?: string
    overwrite?: boolean
    transformKey?: (key: string) => string
    object?: boolean
  } = {}
): Record<string, any> {
  const {
    delimiter = ".",
    overwrite = false,
    transformKey = defaultKeyTransform,
    object = false,
  } = opts
  const result: Record<string, any> = {}

  if (
    checkIfBuffer(target) ||
    Object.prototype.toString.call(target) !== "[object Object]"
  ) {
    return target
  }

  function getKey(key: string): string | number {
    const parsedKey = Number(key)
    return isNaN(parsedKey) || key.indexOf(".") !== -1 || object
      ? key
      : parsedKey
  }

  function addKeys(
    keyPrefix: string,
    recipient: Record<string, any>,
    targetObj: Record<string, any>
  ): Record<string, any> {
    return Object.keys(targetObj).reduce((acc, key) => {
      acc[`${keyPrefix}${delimiter}${key}`] = targetObj[key]
      return acc
    }, recipient)
  }

  function isEmpty(val: any): boolean {
    const type = Object.prototype.toString.call(val)
    const isArray = type === "[object Array]"
    const isObject = type === "[object Object]"

    if (!val) {
      return true
    } else if (isArray) {
      return val.length === 0
    } else if (isObject) {
      return Object.keys(val).length === 0
    }
    return false
  }

  const flattenedTarget = Object.keys(target).reduce((acc, key) => {
    const type = Object.prototype.toString.call(target[key])
    const isObject = type === "[object Object]" || type === "[object Array]"
    if (!isObject || isEmpty(target[key])) {
      acc[key] = target[key]
    } else {
      addKeys(key, acc, flatten(target[key], opts))
    }
    return acc
  }, {} as Record<string, any>)

  Object.keys(flattenedTarget).forEach((key) => {
    const split = key.split(delimiter).map(transformKey)
    let key1 = getKey(split.shift()!)
    let key2 = getKey(split[0])
    let recipient = result

    while (key2 !== undefined) {
      if (key1 === "__proto__") {
        return
      }

      const type = Object.prototype.toString.call(recipient[key1])
      const isObject = type === "[object Object]" || type === "[object Array]"

      if (!overwrite && !isObject && typeof recipient[key1] !== "undefined") {
        return
      }

      if ((overwrite && !isObject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = typeof key2 === "number" && !object ? [] : {}
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getKey(split.shift()!)
        key2 = getKey(split[0])
      }
    }

    recipient[key1] = unflatten(flattenedTarget[key], opts)
  })

  return result
}
