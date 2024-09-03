import {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {createListenerMap} from "../utils/createListenerMap"
import {useDebounce} from "../utils/useDebounce"

export type MediaContextType = {
  width: number
  height: number
  isMobile: () => boolean
}

export const getMedia = (): MediaContextType => {
  const w = window.innerWidth
  const h = window.innerHeight
  return {
    width: w,
    height: h,
    isMobile: () => w < MEDIA_WIDTH_MOBILE,
  }
}

export const MediaContext = createContext<MediaContextType>(getMedia())

export const useMedia = () => {
  return useContext(MediaContext)
}

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
