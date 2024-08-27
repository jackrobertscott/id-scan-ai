import {ZodError} from "zod"
import {StatusCodeError} from "./errorClasses"
import {AsyncRequestListener, sendJsonResponse} from "./serverUtils"

export function captureRequestErrors(
  listener: AsyncRequestListener
): AsyncRequestListener {
  return async (req, res) => {
    try {
      await listener(req, res)
    } catch (error) {
      if (error instanceof ZodError) {
        error = new Error(error.issues[0].message)
      }
      if (error instanceof Error) {
        console.log(`Error [${req.url}]: ${error.message}`)
      }
      sendJsonResponse(
        res,
        error instanceof StatusCodeError ? error.statusCode : 500,
        error instanceof Error ? error.message : "Unknown error occurred"
      )
    }
  }
}
