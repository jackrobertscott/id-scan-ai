import {css} from "@emotion/css"
import {FC} from "react"
import {createCns} from "../utils/classNames"

export const Divider: FC<{
  thickness?: string
}> = ({thickness = "0.5rem"}) => {
  return (
    <div
      className={cn.divider}
      style={{
        "--thickness": thickness,
      }}
    />
  )
}

const cn = createCns({
  divider: css`
    --thickness: 0.5rem;
    height: 1px;
    margin: 0 1rem;
    flex-shrink: 0;
    background-position-x: 0;
    background-size: calc(2 * var(--thickness)) 100%;
    background-image: linear-gradient(
      90deg,
      hsl(0, 0%, 100%, 0) 0,
      hsl(0, 0%, 100%, 0) var(--thickness),
      red var(--thickness),
      red calc(1 * var(--thickness))
    );
  `,
})
