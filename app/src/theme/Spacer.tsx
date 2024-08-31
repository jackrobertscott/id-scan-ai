import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {createCns} from "../utils/classNames"

export const Spacer: FC<{
  children?: ReactNode
  direction?: "row" | "column"
  nested?: boolean
}> = ({children, direction, nested}) => {
  return (
    <div data-nested={nested} data-direction={direction} className={cn_s.root}>
      {children}
    </div>
  )
}

const cn_s = createCns("Spacer", {
  root: css`
    gap: 1rem;
    flex-grow: 1;
    overflow: auto;
    flex-direction: "column";
    &[data-direction="row"] {
      flex-direction: row;
    }
    &:not([data-nested="true"]) {
      padding: 1rem;
      flex-grow: 0;
    }
  `,
})
