import {css} from "@emotion/css"
import {FC} from "react"
import {useCnStatic} from "../utils/classNames"

export const Divider: FC<{
  thickness?: string
}> = ({thickness = "0.5rem"}) => {
  const cn = useCnStatic("divider", () => ({
    root: css`
      height: 1px;
      margin: 0 1rem;
      flex-shrink: 0;
      background-position-x: 0;
      background-size: calc(2 * ${thickness}) 100%;
      background-image: linear-gradient(
        90deg,
        hsl(0, 0%, 100%, 0) 0,
        hsl(0, 0%, 100%, 0) ${thickness},
        var(--border-regular-color) ${thickness},
        var(--border-regular-color) calc(1 * ${thickness})
      );
    `,
  }))

  return <div className={cn.root} />
}
