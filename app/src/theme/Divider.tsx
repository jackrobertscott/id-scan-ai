import {css} from "@emotion/css"
import {FC} from "react"
import {prettyCns} from "../utils/classNames"

export const Divider: FC<{
  thickness?: string
}> = ({thickness = "0.5rem"}) => {
  return (
    <div
      className={cn_d.root}
      style={{
        "--thickness": thickness,
      }}
    />
  )
}

const cn_d = prettyCns("Divider", {
  root: css`
    height: 1px;
    margin: 0 1rem;
    flex-shrink: 0;
    background-position-x: 0;
    background-size: calc(2 * var(--thickness)) 100%;
    background-image: linear-gradient(
      90deg,
      hsl(0, 0%, 100%, 0) 0,
      hsl(0, 0%, 100%, 0) var(--thickness),
      yellow var(--thickness),
      yellow calc(1 * var(--thickness))
    );
  `,
})
