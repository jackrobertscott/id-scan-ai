import {css} from "@emotion/css"
import {createCns} from "../utils/classNames"

export type IconProps = {
  icon: string
  animation?: string
}

export const Icon = ({icon, animation}: IconProps) => {
  return (
    <div className={cn.root}>
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn.svg}
        style={{
          "--animation": animation,
        }}>
        <path d={icon} />
      </svg>
    </div>
  )
}

export const cn = createCns("Icon", {
  root: css`
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
