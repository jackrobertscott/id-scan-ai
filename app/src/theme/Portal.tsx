import {FC, ReactNode} from "react"
import {createPortal} from "react-dom"

const portalElement = document.getElementById("root") as HTMLElement

export const Portal: FC<{children?: ReactNode}> = ({children}) => {
  return createPortal(children, portalElement)
}
