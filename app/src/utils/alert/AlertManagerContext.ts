import {createContext} from "react"

export type Alert = {
  id: string
  message: string
  variant?: "success" | "warning" | "failure"
}

export const AlertManagerContext = createContext<{
  alerts: Alert[]
  create: (message: string, variant: Alert["variant"]) => void
  close: (id: string) => void
}>({
  alerts: [],
  create: () => console.log("Alert provider not initialized yet"),
  close: () => console.log("Alert provider not initialized yet"),
})
