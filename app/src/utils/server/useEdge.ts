import {useEffect, useRef, useState} from "react"
import {ZodError} from "zod"
import {useAlertManager} from "../../mods/alert/alertManager"
import {useAuthManager} from "../../mods/auth/auth_manager"
import {useDebounce} from "../useDebounce"
import {ZodFormValue, useZodForm} from "../useZodForm"
import {EdgeDef, EdgeInput, EdgeInputSchema, EdgeOutput} from "./createEdgeDef"
import {StatusCodeError} from "./errorClasses"
import {fetchEdge} from "./fetchEdge.brw"

export const useEdge = <E extends EdgeDef>(
  edgeDef: E,
  options: {
    timeStamp?: number
    fetchOnMount?: boolean
    fetchOnChangeDebounce?: number
    successMessage?: string
    pushValue?: ZodFormValue<NonNullable<EdgeInput<E>>>
    silent?: boolean
  } = {}
) => {
  const authManager = useAuthManager()
  const alertManager = useAlertManager()
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(options.fetchOnMount ?? false)
  const [output, setOutput] = useState<EdgeOutput<E, undefined>>()
  const resultDateRef = useRef(Date.now())
  const loadingDateRef = useRef(Date.now())
  const input = useZodForm<EdgeInputSchema<E>>({
    schema: edgeDef.input as any,
    pushValue: options.pushValue as any,
  })

  function wrapLoadingEffect<A extends any[], R>(
    fn: (...args: A) => Promise<R>
  ): (...args: A) => Promise<R> {
    return async (...args: A) => {
      setLoading(true)
      const lastest = Date.now()
      loadingDateRef.current = lastest
      return fn(...args).finally(() => {
        if (loadingDateRef.current === lastest) setLoading(false)
      })
    }
  }

  const unwrappedFetch = async (
    payload?: EdgeInput<E>,
    token?: string
  ): Promise<EdgeOutput<E, Response>> => {
    const lastest = Date.now()
    resultDateRef.current = lastest

    let result: EdgeOutput<E, Response>
    try {
      result = await fetchEdge({
        def: edgeDef,
        data: payload ?? (input.getData() as any),
        token: token ?? authManager.getPayload()?.token,
      })

      if (lastest === resultDateRef.current && edgeDef.output) {
        if (result && !(result instanceof Response)) {
          setOutput(result as any)
        }
      }

      if (options.successMessage) {
        alertManager.create(options.successMessage, "success")
      }
    } catch (error) {
      if (error instanceof StatusCodeError) {
        switch (error.statusCode) {
          case 401:
            console.warn("Unauthorized (401)")
            authManager.setPayload(null)
            break
          case 403:
            console.warn("Forbidden (403)")
            break
          default:
            console.warn("Status code error: " + error.statusCode)
        }
      }

      let message =
        error instanceof ZodError
          ? error.issues[0]?.message
          : error instanceof Error
          ? error.message
          : "An error occured"

      console.warn(message)
      if (!options.silent) {
        alertManager.create(message, "failure")
      }

      throw error
    } finally {
      if (!ready) setReady(true)
    }

    return result
  }

  // Wrap fetch with loading effect
  const fetch = wrapLoadingEffect(unwrappedFetch)
  const debouncedFetch = useDebounce(
    options.fetchOnChangeDebounce ?? 500,
    fetch
  )

  function getSubmitProps(
    onSuccess?: (result: EdgeOutput<E, Response>) => void
  ) {
    return {
      loading,
      onClick: () => fetch().then(onSuccess),
    }
  }

  function reset() {
    input.reset()
    setOutput(undefined)
  }

  useEffect(() => {
    if (typeof options.timeStamp === "number") {
      fetch()
    } else if (options.fetchOnMount) {
      if (!ready) fetch()
    }
  }, [options.timeStamp])

  useEffect(() => {
    if (typeof options.fetchOnChangeDebounce === "number") {
      if (ready) debouncedFetch()
    }
  }, [input.getData()])

  return {
    input,
    output,
    loading,
    ready,
    fetch,
    getSubmitProps,
    reset,

    // perform custom loading management (e.g. multi-step submit task)
    unwrappedFetch,
    wrapLoadingEffect,
  }
}
