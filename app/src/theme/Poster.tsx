import {css} from "@emotion/css"
import {useCn} from "../utils/classNames"
import {Icon} from "./Icon"

export type PosterProps = {
  icon: string
  title: string
  description: string
  grow?: boolean
}

export const Poster = ({icon, title, description, grow}: PosterProps) => {
  const cn = useCn("poster", {
    root: css`
      padding: 1rem;
      flex-grow: ${grow ? 1 : 0};
      border-radius: var(--radius-regular);
      border: var(--border-regular);
      text-align: center;
    `,
    icon: css`
      font-size: 2rem;
      margin-bottom: 0.25rem;
    `,
    title: css`
      color: hsl(0, 0%, 100%);
      font-size: 1.25rem;
    `,
    description: css`
      color: hsl(0, 0%, 100%, 0.5);
      font-size: var(--font-size-small);
    `,
  })

  return (
    <div className={cn.root}>
      <Icon icon={icon} className={cn.icon} />
      <div className={title}>{title}</div>
      <div className={cn.description}>{description}</div>
    </div>
  )
}
