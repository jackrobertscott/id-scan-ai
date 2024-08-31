import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {cn_jn, createCns} from "../utils/classNames"
import {gcn} from "./gcn.css"

export const Spacer: FC<{
  children?: ReactNode
  direction?: "row" | "column"
  nested?: boolean
}> = ({children, direction, nested}) => {
  return (
    <div
      data-nested={nested}
      className={cn_jn([
        cn.spacer,
        direction === "row" ? gcn.row : gcn.column,
      ])}>
      {children}
    </div>
  )
}

const cn = createCns({
  spacer: css`
    gap: 1rem;
    overflow: auto;
    &[data-nested] {
      flex-grow: 0;
      padding: 1rem;
    }
    &:not([data-nested]) {
      flex-grow: 1;
    }
  `,
})
