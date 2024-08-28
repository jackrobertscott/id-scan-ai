import {setErrorMap} from "zod"
import {toSpacedCase} from "./changeCase"

export function formatZodErrors() {
  setErrorMap((issue, ctx) => {
    const propertyName =
      issue.path.length > 0
        ? ` "${toSpacedCase(issue.path.join(" ")).toLowerCase()}"`
        : " this field"
    switch (issue.code) {
      case "invalid_type":
        return {
          message:
            `Oops! The value for${propertyName} ` +
            (issue.received === "undefined" || issue.received === "null"
              ? `should not be empty.`
              : `should be a ${issue.expected}, but I got ${issue.received}.`),
        }
      case "too_small":
        const sizeType = issue.type === "string" ? "characters" : "items"
        return {
          message: `Just a bit more needed! ${propertyName} should be at least ${issue.minimum} ${sizeType} long.`,
        }
      case "too_big":
        const sizeTypeBig = issue.type === "string" ? "characters" : "items"
        return {
          message: `Less is more! ${propertyName} should be no more than ${issue.maximum} ${sizeTypeBig} long.`,
        }
      case "invalid_string":
        return {
          message: `Hmm, the text in${propertyName} doesn't seem right.`,
        }
      case "invalid_date":
        return {
          message: `The date in${propertyName} isn't valid.`,
        }
      case "invalid_enum_value":
        return {
          message: `The value for${propertyName} isn't one of the expected options.`,
        }
      case "custom":
        return {
          message: `There's something special about${propertyName} that needs fixing: ${issue.message}`,
        }
      default:
        return {
          message: `There's an issue with${propertyName}: ${ctx.defaultError}`,
        }
    }
  })
}
