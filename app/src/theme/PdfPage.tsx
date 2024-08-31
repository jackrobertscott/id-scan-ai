import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {createCns} from "../utils/classNames"

const A4_PDF_SIZES = {
  WIDTH: 794,
  HEIGHT: 1123,
  PADDING: 96,
}

export const PdfPage: FC<{
  children: ReactNode
  inAppPreview?: boolean
}> = ({children, inAppPreview}) => {
  return (
    <div className={cn_pp.root}>
      <div
        className={cn_pp.sheet}
        style={{
          "--padding": inAppPreview
            ? `${A4_PDF_SIZES.PADDING}px`
            : `0 ${A4_PDF_SIZES.PADDING}px`,
          "--width": inAppPreview ? `${A4_PDF_SIZES.WIDTH}px` : "100%",
          "--min-height": inAppPreview ? `${A4_PDF_SIZES.HEIGHT}px` : "auto",
        }}>
        {children}
      </div>
    </div>
  )
}

const cn_pp = createCns("PdfPage", {
  root: css`
    width: 100%;
    flex-grow: 1;
    background-color: hsl(0, 0%, 50%);
  `,
  sheet: css`
    gap: 1rem;
    flex-grow: 1;
    margin: 0 auto;
    color: hsl(0, 0%, 0%);
    background-color: hsl(0, 0%, 100%);
    padding: var(--padding);
    width: var(--width);
    min-height: var(--min-height);
  `,
})
