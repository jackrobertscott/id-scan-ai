import {css} from "@emotion/css"
import {ReactNode} from "react"
import {createCns} from "../utils/classNames"

export type DashboardProps = {
  children?: ReactNode
}

export const Dashboard = ({children}: DashboardProps) => {
  return <div className={cn.root}>{children}</div>
}

const cn = createCns("Dashboard", {
  root: css`
    gap: 1em;
    padding: 1em;
  `,
})
