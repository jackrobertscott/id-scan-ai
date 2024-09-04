import {css} from "@emotion/css"
import {gcn} from "../gcn"
import {jn_cn, prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"

export type PosterProps = {
  icon: string
  title: string
  description: string
  grow?: boolean
}

export const Poster = ({icon, title, description, grow}: PosterProps) => {
  return (
    <div className={jn_cn([cn_p.root, grow && gcn.grow])}>
      <Icon icon={icon} className={cn_p.icon} />
      <div className={title}>{title}</div>
      <div className={cn_p.description}>{description}</div>
    </div>
  )
}

const cn_p = prettyCns("Poster", {
  root: css`
    ${gcn.elevate}
    padding: 1rem;
    text-align: center;
    gap: var(--pad-s-y);
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
    color: var(--fnt-clr-3rd);
    font-size: var(--fnt-s);
  `,
})
