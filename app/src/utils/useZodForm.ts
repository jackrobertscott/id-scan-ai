import {useEffect, useRef, useState} from "react"
import {ZodObject, ZodType, z} from "zod"
import {useAlertManager} from "../mods/alert/alert_manager"
import {areSame} from "./compareUtils"
import {useDebounce} from "./useDebounce"

export type ZodNullish<T extends ZodType> = T extends ZodObject<infer Q>
  ? ZodObject<{[K in keyof Q]: ZodNullish<Q[K]>}>
  : z.ZodNullable<z.ZodOptional<T>>

export type ZodFormValue<R extends Record<string, ZodType>> = z.infer<
  ZodObject<{[K in keyof R]: ZodNullish<R[K]>}>
>

export type ZodFormHookProps<R extends Record<string, ZodType>> = {
  schema: ZodObject<R>
  pushValue?: ZodFormValue<R>
  onValue?: (value: ZodFormValue<R>) => void
  disabled?: boolean
}

export function useZodForm<R extends Record<string, ZodType>>({
  schema = z.object({}) as ZodObject<R>,
  pushValue: _pushValue = {} as ZodFormValue<R>,
  onValue,
  disabled,
}: ZodFormHookProps<R>) {
  type ErrorObj = Partial<Record<keyof R, string>>
  type TouchedObj = Partial<Record<keyof R, boolean>>

  const alertManager = useAlertManager()
  const pushRef = useRef<{[key: string]: any}>({})
  const dataRef = useRef(_pushValue)
  const [_dataObj, _setDataObj] = useState(dataRef.current)
  const [errorObj, _setErrorObj] = useState<ErrorObj>({})
  const [touchedObj, _setTouchedObj] = useState<TouchedObj>({})

  // save previous pushValue states and only update when it changes
  for (const key in {..._pushValue, ...pushRef.current}) {
    if (!schema.shape[key]) continue
    if (!areSame(_pushValue[key], pushRef.current[key])) {
      pushRef.current = {...pushRef.current, [key]: _pushValue[key]}
    }
  }

  // Update internal data when pushValue changes
  useEffect(() => {
    setDataObj(() => ({...pushRef.current} as any))
    const map: typeof errorObj = {}
    for (const key in schema.shape)
      map[key] = validateKey(key as keyof R, dataRef.current[key])
    setErrorObj(map)
  }, [pushRef.current])

  // Send to onValue when internal data changes
  useEffect(() => {
    onValue?.(dataRef.current) // use ref, not state
  }, [_dataObj])

  const setErrorObj = useDebounce(500, _setErrorObj)
  const setTouchedObj = useDebounce(500, _setTouchedObj)
  const setDataObj = (cb: (prevValue: ZodFormValue<R>) => ZodFormValue<R>) => {
    if (disabled) return
    const oldData = dataRef.current
    const newData = cb(dataRef.current)
    const hasChanged = !areSame(newData, oldData) // prevent infinite loop
    if (hasChanged) {
      dataRef.current = newData
      _setDataObj(dataRef.current)
    }
    return hasChanged
  }

  function validateKey<K extends keyof R>(key: K, value: ZodFormValue<R>[K]) {
    const result = schema.shape[key].safeParse(value)
    return result.success ? undefined : result.error.issues[0].message
  }

  function isValid() {
    return schema.safeParse(dataRef.current).success
  }

  function getData() {
    return dataRef.current
  }

  function patchData(value: ZodFormValue<R>) {
    setDataObj((prev) => ({...prev, ...value}))
  }

  function getValueOf<K extends keyof R>(key: K) {
    return dataRef.current[key]
  }

  function setValueOf<K extends keyof R>(key: K, value: ZodFormValue<R>[K]) {
    setDataObj((prev) => ({...prev, [key]: value}))
    setErrorObj((prev) => ({...prev, [key]: validateKey(key, value)}))
    setTouchedObj((prev) => ({...prev, [key]: true}))
  }

  function getErrorOf<K extends keyof R>(key: K) {
    return errorObj[key]
  }

  function getTouchedOf<K extends keyof R>(key: K) {
    return touchedObj[key]
  }

  function getPropsOf<K extends keyof R>(key: K) {
    return {
      value: getValueOf(key),
      onValue: (value: ZodFormValue<R>[K]) => setValueOf(key, value),
    }
  }

  function submit(cb: (data: z.infer<ZodObject<R>>) => void) {
    const i = schema.safeParse(dataRef.current)
    if (i.error) {
      alertManager.create(i.error.issues[0]?.message, "warning")
    } else {
      cb(i.data)
    }
  }

  function reset() {
    setDataObj(() => _pushValue)
    _setErrorObj({})
    _setTouchedObj({})
  }

  return {
    hasChanged: !areSame(dataRef.current, pushRef.current),
    submit,
    getData,
    patchData,
    isValid,
    getValueOf,
    setValueOf,
    getErrorOf,
    getTouchedOf,
    getPropsOf,
    reset,
  }
}
