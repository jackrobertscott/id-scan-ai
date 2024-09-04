import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {gcn} from "../gcn"
import {prettyCns} from "../utils/classNames"

export const Container: FC<{
  overlay?: boolean
  children?: ReactNode
  width?: string
}> = ({children, width = "20rem", overlay}) => {
  return (
    <div
      className={cn_c.root}
      style={{"--width": width}}
      data-overlay={overlay}>
      <div className={cn_c.hideScrollbarOverflow}>{children}</div>
    </div>
  )
}

const cn_c = prettyCns("Container", {
  root: css`
    ${gcn.elevate}
    overflow: auto;
    width: var(--width);
    background-color: hsl(0, 0%, 30%, 1);
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      width: 100%;
      &[data-overlay="true"] {
        margin-top: 5rem;
      }
    }
    &:not([data-overlay="true"]) {
      @media (width < ${MEDIA_WIDTH_MOBILE}px) {
        flex-grow: 1;
      }
    }
  `,
  hideScrollbarOverflow: css`
    flex-grow: 1;
    overflow: auto;
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      > .spacer-root {
        padding-bottom: 5rem;
      }
    }
  `,
})
