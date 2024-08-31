import {useState} from "react"

export const useLocalState = <T>(key: string, defaultValue: T) => {
  const getState = () => {
    const localValue = localStorage.getItem(key)
    let outputValue
    try {
      if (localValue) {
        outputValue = JSON.parse(localValue).data as T
      }
    } catch (e) {
      console.warn(e)
      localStorage.removeItem(key)
    } finally {
      outputValue ??= defaultValue
    }
    return outputValue
  }
  const [state, setState] = useState<T>(getState)
  const setLocalState = (data: T) => {
    localStorage.setItem(key, JSON.stringify({data}))
    setState(data)
  }
  return [state, setLocalState] as const
}
