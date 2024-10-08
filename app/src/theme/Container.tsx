import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {gcn} from "../gcn"
import {prettyCns} from "../utils/classNames"

export const Container: FC<{
  noShrink?: boolean
  overlay?: boolean
  children?: ReactNode
  fullWidth?: boolean
  width?: string
}> = ({noShrink, overlay, children, fullWidth, width = "40rem"}) => {
  return (
    <div
      className={cn_c.root}
      style={{
        "--shrink": noShrink ? "0" : "",
        "--width": fullWidth ? "auto" : width,
      }}
      data-overlay={overlay}
      data-full={fullWidth}>
      <div className={cn_c.hideScrollbarOverflow}>{children}</div>
    </div>
  )
}

const cn_c = prettyCns("Container", {
  root: css`
    overflow: auto;
    max-width: 100%;
    width: var(--width);
    flex-shrink: var(--shrink);
    background-color: var(--bg-clr);
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      &[data-overlay="true"] {
        margin-top: 5rem;
      }
    }
    &:not([data-overlay="true"]) {
      @media (width < ${MEDIA_WIDTH_MOBILE}px) {
        flex-grow: 1;
      }
    }
    &[data-full="true"] {
      flex-grow: 1;
    }
  `,
  hideScrollbarOverflow: css`
    ${gcn.elevate}
    flex-grow: 1;
    overflow: auto;
    @media (width < ${MEDIA_WIDTH_MOBILE}px) {
      > .spacer-root {
        padding-bottom: 5rem;
      }
    }
  `,
})
