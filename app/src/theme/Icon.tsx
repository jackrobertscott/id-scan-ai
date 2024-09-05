import {css} from "@emotion/css"
import {CSSProperties, FC} from "react"
import {prettyCns} from "../utils/classNames"

export const Icon: FC<{
  icon: string
  spinning?: boolean
  animation?: string
  className?: string
  style?: CSSProperties
  scale?: number
}> = ({icon, spinning, className, style, animation, scale}) => {
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
          "--scale": scale,
        }}>
        <path d={icon} />
      </svg>
    </div>
  )
}

const cn_i = prettyCns("Icon", {
  root: css`
    user-select: none;
    text-align: center;
    align-items: center;
    justify-content: end;
    height: calc(var(--line-height) * 1em);
  `,
  svg: css`
    fill: currentcolor;
    stroke: transparent;
    animation: var(--anim);
    width: calc(var(--line-height) * 1em);
    height: calc(var(--line-height) * 1em);
    scale: var(--scale, 1);
  `,
})
