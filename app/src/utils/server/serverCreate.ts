import busboy from "busboy"
import chalk from "chalk"
import cluster from "cluster"
import http, {IncomingMessage, ServerResponse} from "http"
import {srvConf} from "../../srvConf"
import {unflatten} from "../flat"
import {setCorsHeaders} from "./corsHeaders"
import {Edge} from "./createEdge"
import {EdgeDef} from "./createEdgeDef"
import {captureRequestErrors} from "./errorCapture"
import {setSecurityHeaders} from "./securityHeaders"
import {serverFileSchema} from "./serverSchemas"
import {AsyncRequestListener, sendJsonResponse} from "./serverUtils"

let __requestCount = 0

export function createEdgeServer(edges: Edge<EdgeDef>[]) {
  let listener: AsyncRequestListener = async (req, res) => {
    // Handle OPTIONS requests
    if (req.method === "OPTIONS") {
      res.end()
      return
    }

    // Handle GET requests
    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          sendJsonResponse(res, 200, {now: Date.now()})
          return
        case "/robots.txt":
          res.end()
          return
        case "/favicon.ico":
          res.end()
          return
      }
    }

    // Avoid unsafe request methods
    if (req.method !== "POST") {
      throw new Error("Server only accepts POST requests, got: " + req.method)
    }

    // Only allow multipart/form-data requests
    if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
      throw new Error(
        "Server only accepts multipart/form-data, got: " +
          req.headers["content-type"]
      )
    }

    // Handle requests without a url
    if (!req.url) {
      throw new Error("Request url not present")
    }

    // Find the corresponding server egde
    const edge = edges.find((i) => i.def.slug === req.url)
    if (!edge) {
      sendJsonResponse(res, 404, "Route not supported")
      return
    }

    // Ensure the request origin is valid for private edges
    const requestOrigin = req.headers["origin"]
    if (!edge.def.public && requestOrigin !== srvConf.URL_CLIENT)
      throw new Error(`Origin not valid (${requestOrigin})`)

    // Extract the request payload
    let raw = await parseRequestBody(req)
    raw = unflatten(raw) // unflatten data from frontend
    const body = edge.def.input ? edge.def.input.parse(raw) : undefined

    // Process the request using the edge handler
    let result
    let timeStart = performance.now()
    try {
      result = await edge.handler({
        request: req,
        response: res,
        body: body as any,
      })
    } catch (e) {
      throw e
    } finally {
      const timeDiff = (performance.now() - timeStart).toFixed(3)
      const colorCb = getPastelColorCb(__requestCount)
      const dateString = new Date()
        .toLocaleString("en-au", {
          timeStyle: "medium",
          timeZone: "Australia/Perth",
        })
        .toUpperCase()
      const cid = cluster.worker?.id ? `W${cluster.worker.id}` : "MASTER"
      const message = `[${dateString}] ${cid} ${req.url}: ${timeDiff}ms`
      console.log(colorCb(message))
      __requestCount += 1
    }

    // Validate and filter the final output
    if (edge.def.output) {
      result = edge.def.output.parse(result)
    }

    if (result instanceof ServerResponse) {
      // Do nothing...
    } else {
      // Send the response
      sendJsonResponse(res, 200, result)
    }
  }

  // Attach security headers and handle errors
  listener = setCorsHeaders(listener)
  listener = setSecurityHeaders(listener)
  listener = captureRequestErrors(listener)

  // Return the server
  return new http.Server(listener)
}

function parseRequestBody(req: IncomingMessage) {
  return new Promise((good, bad) => {
    const raw = {} as Record<string, any>
    const bb = busboy({headers: req.headers})
    bb.on("file", (name, file, {filename, encoding, mimeType}) => {
      const chunks: Uint8Array[] = []
      file
        .on("data", (data) => chunks.push(data))
        .on("close", () => {
          const buffer = Buffer.concat(chunks)
          raw[name] = serverFileSchema().parse({
            buffer,
            filename,
            encoding,
            mimeType,
          })
        })
    })
    bb.on("field", (name, value) => {
      if (value === "undefined") raw[name] = undefined
      else raw[name] = JSON.parse(value)
    })
    bb.on("close", () => {
      good(raw)
    })
    bb.on("error", bad)
    req.pipe(bb)
  })
}

function getPastelColorCb(requestCount: number) {
  const pastelColors: [number, number, number][] = [
    [255, 179, 186], // Pastel Pink
    [186, 255, 201], // Pastel Green
    [186, 225, 255], // Pastel Blue
    [255, 255, 186], // Pastel Yellow
    [255, 223, 186], // Pastel Orange
    [224, 187, 228], // Pastel Purple
    [212, 240, 240], // Pastel Turquoise
    [255, 198, 255], // Pastel Magenta
    [220, 220, 220], // Pastel Gray
    [255, 228, 225], // Pastel Peach
    [240, 230, 140], // Pastel Khaki
    [230, 230, 250], // Pastel Lavender
  ]
  const index = requestCount % pastelColors.length
  const [r, g, b] = pastelColors[index]
  return chalk.rgb(r, g, b)
}
