import {IncomingMessage, ServerResponse} from "http"
import {EdgeDef, EdgeInput, EdgeOutput} from "./createEdgeDef"

export type EdgeHandler<E extends EdgeDef> = ({
  request,
  response,
  body,
}: {
  request: IncomingMessage
  response: ServerResponse
  body: EdgeInput<E>
}) => Promise<EdgeOutput<E, void | ServerResponse>>

export interface Edge<E extends EdgeDef> {
  def: E
  handler: EdgeHandler<E>
}

export function createEdge<E extends EdgeDef>(data: Edge<E>) {
  return data
}

export function createEdgeGroup<R extends Record<string, EdgeDef>>(
  edgeGroup: R,
  handlers: Partial<{[K in keyof R]: EdgeHandler<R[K]>}>
) {
  return Object.keys(handlers).reduce((all, key: keyof typeof handlers) => {
    const def = edgeGroup[key]
    const handler = handlers[key]
    if (!def || !handler) return all
    return {
      ...all,
      [key]: createEdge({def, handler}),
    }
  }, {} as Record<string, Edge<any>>)
}
