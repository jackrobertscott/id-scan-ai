import {useContext} from "react"
import {AlertManagerContext} from "./AlertManagerContext"

export const useAlertManager = () => {
  return useContext(AlertManagerContext)
}
