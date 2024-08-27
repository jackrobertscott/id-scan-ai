import {IncomingMessage, ServerResponse} from "http"

export function sendJsonResponse(
  res: ServerResponse,
  statusCode: number,
  data: any
) {
  res.statusCode = statusCode
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({data}))
}

export type AsyncRequestListener = (
  req: IncomingMessage,
  res: ServerResponse
) => Promise<void>
