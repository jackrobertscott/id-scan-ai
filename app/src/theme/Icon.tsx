import {css} from "@emotion/css"
import {CSSProperties, FC} from "react"
import {useCn} from "../utils/classNames"

export const Icon: FC<{
  icon: string
  spinning?: boolean
  className?: string
  style?: CSSProperties
}> = ({icon, spinning, className, style}) => {
  const cn = useCn("icon", {
    root: css`
      user-select: none;
      align-items: center;
      justify-content: end;
      text-align: center;
      height: calc(var(--line-height) * 1em);
    `,
    svg: css`
      width: 1.2em;
      height: 1.2em;
      fill: currentcolor;
      stroke: transparent;
      animation: ${spinning ? `500ms linear infinite rotate360` : "none"};
    `,
  })

  return (
    <div
      style={style}
      className={[cn.root, className].filter(Boolean).join(" ")}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn.svg}>
        <path d={icon} />
      </svg>
    </div>
  )
}
