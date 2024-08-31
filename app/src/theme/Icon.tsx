import {css} from "@emotion/css"
import {createCns} from "../utils/classNames"

export type IconProps = {
  icon: string
  animation?: string
  spinning?: boolean
}

export const Icon = ({icon, animation, spinning}: IconProps) => {
  return (
    <div className={cn.icon}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn.svg}
        style={{
          "--animation": spinning
            ? "500ms linear infinite rotate360"
            : animation,
        }}>
        <path d={icon} />
      </svg>
    </div>
  )
}

export const cn = createCns({
  icon: css`
    user-select: none;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: calc(var(--line-height) * 1em);
  `,
  svg: css`
    width: 1em;
    height: 1em;
    fill: currentcolor;
    stroke: transparent;
    animation: var(--animation);
  `,
})
