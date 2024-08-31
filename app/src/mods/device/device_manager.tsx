import {createContext, ReactNode, useContext} from "react"
import {useLocalState} from "../../utils/useLocalState"
import {DeviceAuthType} from "../auth/auth_device.iso"

export type DeviceAuthData = {
  token: string
  payload: DeviceAuthType
}

export type DeviceManagerContextType = {
  data: null | DeviceAuthData
  setData: (authData: DeviceAuthData | null) => void
}

export const DeviceManagerContext = createContext<DeviceManagerContextType>({
  data: null,
  setData: () => console.warn("no DeviceManagerProvider"),
})

export type DeviceManagerProviderProps = {
  children: ReactNode
}

export const DeviceManagerProvider = ({
  children,
}: DeviceManagerProviderProps) => {
  type T = DeviceAuthData | null
  const [data, setData] = useLocalState<T>("deviceAuth", null)

  return (
    <DeviceManagerContext.Provider value={{data, setData}}>
      {children}
    </DeviceManagerContext.Provider>
  )
}

export const useDeviceManager = () => {
  return useContext(DeviceManagerContext)
}
