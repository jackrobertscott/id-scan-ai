import {z} from "zod"
import {brwConf} from "../../brwConf"
import {flatten} from "../flat"
import {EdgeDef, EdgeInput, EdgeOutput} from "./createEdgeDef"

export async function fetchEdge<E extends EdgeDef>({
  def,
  data: jsonData,
  token,
}: {
  def: E
  data?: EdgeInput<E>
  token?: string | null
}): Promise<EdgeOutput<E, Response>> {
  let requestOptions: RequestInit = {
    method: "POST",
    headers: {},
  }

  // Add token to headers
  if (token) {
    requestOptions.headers = {
      ...requestOptions.headers,
      Authorization: "Bearer " + token,
    }
  }

  // Validate and flatten input data
  const fd = new FormData()
  if (def.input) {
    const data = flatten(def.input.parse(jsonData ?? {}))
    for (const key in data) {
      if (data[key] instanceof File) fd.append(key, data[key])
      else fd.append(key, JSON.stringify(data[key]))
    }
  }
  requestOptions.body = fd

  const response = await fetch(
    brwConf.VITE_SERVER_URL + def.slug,
    requestOptions
  )

  // Empty response
  if (response.status === 204) return response

  // Parse JSON response
  if (response.headers.get("Content-Type")?.startsWith("application/json")) {
    if (response.status >= 200 && response.status < 300) {
      // Successful response
      if (def.output) {
        const raw = await response.json()
        if (typeof raw !== "object" || raw === null || !("data" in raw)) {
          throw new Error("Malformed response data")
        }
        try {
          return def.output.parse(raw.data) as EdgeOutput<E, Response>
        } catch (e) {
          console.warn("Returned value invalid for: " + def.slug)
          throw e
        }
      }
      return response
    } else {
      // Error response
      let raw: unknown
      let message: string = "Unknown error"

      try {
        raw = await response.json()
      } catch (e) {
        console.error(e)
      }

      // Parse error message
      const rawResult = z
        .object({
          data: z.union([z.string().min(1), z.object({message: z.string()})]),
        })
        .safeParse(raw)
      if (rawResult.success) {
        message =
          typeof rawResult.data.data === "string"
            ? rawResult.data.data
            : rawResult.data.data.message
      }
      const internetIssueKeys = ["load failed", "failed to fetch"]
      if (internetIssueKeys.some((a) => message.toLowerCase().startsWith(a))) {
        message = "Failed to connect to internet"
      }

      throw new StatusCodeError(response.status, message)
    }
  } else {
    return response
  }
}

export class StatusCodeError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}
