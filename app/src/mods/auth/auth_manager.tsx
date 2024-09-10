import {createContext, useContext} from "react"
import {AuthDataType} from "./auth_schemas"

export type AuthPayloadType = {
  data: AuthDataType
  token: string
}

export const AuthManagerContext = createContext<{
  lastTimeStamp: number
  isAuthed: () => boolean
  getPayload: () => AuthPayloadType | null
  setPayload: (payload: AuthPayloadType | null) => void
  refresh: () => Promise<void>
}>({
  lastTimeStamp: Date.now(),
  isAuthed: () => false,
  getPayload: () => null,
  setPayload: () => console.log("Auth provider not initialized yet"),
  refresh: async () => console.log("Auth provider not initialized yet"),
})

export const useAuthManager = (required?: boolean) => {
  return useContext(AuthManagerContext)
}
