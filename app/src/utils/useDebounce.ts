import {useCallback, useRef} from "react"
import {debounce} from "./debounce"

export function useDebounce<T extends (...args: any[]) => void>(
  wait: number,
  cb: T
): T {
  const callbackRef = useRef(cb)
  callbackRef.current = cb
  return useCallback(
    debounce((...args: any[]) => callbackRef.current(...args), wait),
    [wait]
  ) as T
}
