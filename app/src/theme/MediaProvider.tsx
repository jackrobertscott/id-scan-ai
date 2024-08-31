import {ReactNode, useEffect, useState} from "react"
import {useDebounce} from "../../hooks/useDebounce"
import {createListenerMap} from "../../utils/createListenerMap"
import {
  getMedia,
  MediaContext,
  MediaContextType,
} from "../contexts/MediaContext"

export type MediaProviderProps = {
  children: ReactNode
}

export const MediaProvider = ({children}: MediaProviderProps) => {
  const [state, _setState] = useState<MediaContextType>(getMedia)
  const setState = useDebounce(100, _setState)

  useEffect(() => {
    return createListenerMap(window, {
      resize: () => setState(getMedia()),
    })
  }, [])

  return <MediaContext.Provider value={state}>{children}</MediaContext.Provider>
}
