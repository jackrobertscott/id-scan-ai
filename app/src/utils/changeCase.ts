/**
 * Example output: "helloWorld"
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "")
}

/**
 * Example output: "Hello World"
 */
export function toCapitalCase(str: string): string {
  return str
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Example output: "HELLO_WORLD"
 */
export function toConstantCase(str: string): string {
  return str.toUpperCase().replace(/\s+/g, "_")
}

/**
 * Example output: "hello.world"
 */
export function toDotCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ".")
}

/**
 * Example output: "hello world"
 */
export function toSpacedCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase()
}

/**
 * Example output: "HelloWorld"
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, "")
}

/**
 * Example output: "Hello world"
 */
export function toSentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Example output: "hello_world"
 */
export function toSnakeCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "_")
}

/**
 * Example output: "hello-world"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase()
}

/**
 * Example output: "Hello-World"
 */
export function toTrainCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-")
}
