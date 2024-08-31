import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {MEDIA_WIDTH_MOBILE} from "../consts/MEDIA_SIZES"
import {useCnStatic} from "../utils/classNames"

export const Center: FC<{
  children: ReactNode
}> = ({children}) => {
  const cn = useCnStatic("center", () => ({
    root: css`
      flex-grow: 1;
      align-items: safe center;
      justify-content: safe center;
      @media (width < ${MEDIA_WIDTH_MOBILE}px) {
        gap: 0;
        padding: 0;
        align-items: stretch;
        justify-content: stretch;
      }
    `,
  }))

  return <div className={cn.root}>{children}</div>
}
