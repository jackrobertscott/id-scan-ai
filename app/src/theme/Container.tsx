import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {useCnStatic} from "../utils/classNames"

export const Container: FC<{
  overlay?: boolean
  children?: ReactNode
  width?: string
}> = ({children, width = "20rem", overlay}) => {
  const cn = useCnStatic("container", () => ({
    root: css`
      overflow: auto;
      width: ${width};
      border: var(--border-regular);
      border-radius: var(--radius-large);
      background-color: hsl(0, 0%, 100%, 0.1);
      @media (width < ${MEDIA_WIDTH_MOBILE}px) {
        width: 100%;
        border: none;
        border-radius: 0;
      }
      ${overlay
        ? css`
            background-color: var(--bg-color-container);
            box-shadow: 0 0 1rem 0 hsla(0, 0%, 0%, 0.15);
            @media (width < ${MEDIA_WIDTH_MOBILE}px) {
              margin-top: 5rem;
              border-top: var(--border-regular);
              border-top-left-radius: var(--radius-large);
              border-top-right-radius: var(--radius-large);
              /* animation: slideUpAnimation 150ms ease-out; */
            }
          `
        : css`
            @media (width < ${MEDIA_WIDTH_MOBILE}px) {
              flex-grow: 1;
            }
          `}
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
  }))

  return (
    <div className={cn.root}>
      <div className={cn.hideScrollbarOverflow}>{children}</div>
    </div>
  )
}
