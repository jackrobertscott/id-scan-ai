import {ReactNode} from "react"
import {useLocalState} from "../../utils/useLocalState"
import {DeviceAuthData, DeviceManagerContext} from "./device_manager"

export type DeviceManagerProviderProps = {
  children: ReactNode
}

export const DeviceManagerProvider = ({
  children,
}: DeviceManagerProviderProps) => {
  const [data, setData] = useLocalState<DeviceAuthData | null>(
    "deviceAuth",
    null
  )

  return (
    <DeviceManagerContext.Provider
      value={{
        data,
        setData,
      }}>
      {children}
    </DeviceManagerContext.Provider>
  )
}
