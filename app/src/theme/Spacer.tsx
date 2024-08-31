import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {useCnStatic} from "../utils/classNames"

export const Spacer: FC<{
  children?: ReactNode
  direction?: "row" | "column"
  nested?: boolean
}> = ({children, direction, nested}) => {
  const cn = useCnStatic("spacer", () => ({
    root: css`
      gap: 1rem;
      overflow: auto;
      flex-grow: ${nested ? 0 : 1};
      flex-direction: ${direction === "row" ? "row" : "column"};
      padding: ${nested ? 0 : "1rem"};
    `,
  }))

  return <div className={cn.root}>{children}</div>
}
