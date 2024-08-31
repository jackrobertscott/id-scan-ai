import {createContext, useContext, useState} from "react"
import {createRandomString} from "../utils/randomString"

const LayerStackContext = createContext<{
  layerIds: string[]
}>({
  layerIds: [],
})

export function useLayerStack() {
  const layerContext = useContext(LayerStackContext)
  const [id] = useState(() => createRandomString(8))
  const [mountSize, setMountSize] = useState<number>(-1)
  const turnOn = () => {
    if (!layerContext.layerIds.includes(id)) {
      const length = layerContext.layerIds.push(id)
      setMountSize(length)
    }
  }
  const turnOff = () => {
    if (layerContext.layerIds.includes(id)) {
      layerContext.layerIds = layerContext.layerIds.filter((i) => i !== id)
      setMountSize(0)
    }
  }
  return {
    ...layerContext,
    turnOn,
    turnOff,
    getIndex: () => mountSize,
    isCurrent() {
      return layerContext.layerIds[layerContext.layerIds.length - 1] === id
    },
  }
}
