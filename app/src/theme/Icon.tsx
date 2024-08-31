import {css} from "@emotion/css"
import {CSSProperties, FC} from "react"
import {createCns} from "../utils/classNames"

export const Icon: FC<{
  icon: string
  spinning?: boolean
  animation?: string
  className?: string
  style?: CSSProperties
}> = ({icon, spinning, className, style, animation}) => {
  return (
    <div
      style={style}
      className={[cn_i.root, className].filter(Boolean).join(" ")}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn_i.svg}
        style={{
          "--anim": spinning ? `500ms linear infinite rotate360` : animation,
        }}>
        <path d={icon} />
      </svg>
    </div>
  )
}

const cn_i = createCns("Icon", {
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
    animation: var(--anim);
  `,
})
