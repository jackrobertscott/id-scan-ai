import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {jn_cn, prettyCns} from "../utils/classNames"

export const Spacer: FC<{
  children?: ReactNode
  direction?: "row" | "column"
  className?: string
  nested?: boolean
  collapse?: boolean
}> = ({children, direction, className, nested, collapse}) => {
  return (
    <div
      data-nested={nested}
      data-direction={direction}
      data-collapse={collapse}
      className={jn_cn(cn_s.root, className)}>
      {children}
    </div>
  )
}

const cn_s = prettyCns("Spacer", {
  root: css`
    gap: 1rem;
    flex-grow: 1;
    flex-shrink: 0;
    overflow: auto;
    flex-direction: "column";
    &[data-direction="row"] {
      flex-direction: row;
    }
    &:not([data-nested="true"]) {
      padding: 1rem;
      flex-grow: 0;
    }
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      &[data-collapse="true"][data-direction="row"] {
        flex-direction: column;
      }
    }
    @media (width >= ${MEDIA_WIDTH_MOBILE}px) {
      &[data-collapse="true"] {
        & > * {
          flex-basis: 0;
        }
        &[data-direction="row"] > * {
          flex-grow: 1;
        }
      }
    }
  `,
})
