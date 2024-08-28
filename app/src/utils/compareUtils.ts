export function areSame(obj1: any, obj2: any, stack = new WeakMap()): boolean {
  // Handle non-object types
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }

  // Check for circular references
  if (stack.has(obj1)) {
    return stack.get(obj1) === obj2
  }
  stack.set(obj1, obj2)

  // Check for Date objects
  if (obj1 instanceof Date) {
    if (obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime()
    }
    return false
  } else if (obj2 instanceof Date) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // Check if the objects have the same number of properties
  if (keys1.length !== keys2.length) {
    return false
  }

  // Compare each property
  for (const key of keys1) {
    const val1 = obj1[key]
    const val2 = obj2[key]

    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      return false
    }

    if (isObject(val1) && isObject(val2)) {
      // Recursively compare nested objects
      if (!areSame(val1, val2, stack)) {
        return false
      }
    } else if (Array.isArray(val1) && Array.isArray(val2)) {
      // Compare arrays
      if (!areSameArrays(val1, val2, stack)) {
        return false
      }
    } else if (val1 !== val2) {
      // Compare primitive values
      return false
    }
  }

  return true
}

function areSameArrays(
  arr1: any[],
  arr2: any[],
  stack = new WeakMap()
): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!areSame(arr1[i], arr2[i], stack)) {
      return false
    }
  }

  return true
}

function isObject(item: any): item is {[key: string]: any} {
  return item !== null && typeof item === "object" && !Array.isArray(item)
}
