import {AsyncRequestListener} from "./serverUtils"

export function setCorsHeaders(
  listener: AsyncRequestListener,
  origin: string = "*",
  age: number = 60 * 60 * 24 // 24 hours
): AsyncRequestListener {
  return async (req, res) => {
    const allowedAge = age
    const allowedMethods = ["POST", "OPTIONS"]
    const allowedHeaders = [
      "Access-Control-Allow-Origin",
      "Content-Type",
      "Authorization",
      "Accept",
    ]
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", allowedMethods.join(","))
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(","))
    res.setHeader("Access-Control-Max-Age", String(allowedAge))
    return listener(req, res)
  }
}
