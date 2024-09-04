import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {gcn} from "../gcn"
import {toKebabCase} from "../utils/changeCase"
import {jn_cn, prettyCns} from "../utils/classNames"

export const Field: FC<{
  grow?: boolean
  label?: string
  children?: ReactNode
  footNote?: string
  className?: string
  isAdmin?: boolean
  overflow?: "auto"
  direction?: "row" | "column"
  variant?: string // flag strings separated by spaces
}> = ({
  grow,
  label,
  children,
  className,
  footNote,
  overflow,
  direction = "row",
}) => {
  return (
    <div
      data-name={label ? toKebabCase(label) : undefined}
      className={jn_cn([
        className,
        cn_f.root,
        grow && gcn.grow,
        overflow && gcn.overAuto,
      ])}>
      {label && (
        <div className={cn_f.head}>
          <label className={cn_f.label}>{label}</label>
          {/* {icon && <Icon icon={icon} />} */}
        </div>
      )}
      <div
        className={jn_cn([
          cn_f.input,
          grow && gcn.grow,
          direction === "row" ? gcn.row : gcn.column,
        ])}>
        {children}
      </div>
      {footNote && <div className={cn_f.foot}>{footNote}</div>}
    </div>
  )
}

const cn_f = prettyCns("Field", {
  root: css`
    gap: 0.25rem;
  `,
  head: css`
    flex-direction: row;
    color: var(--fnt-clr-3rd);
    padding: 0 var(--pad-r-x);
  `,
  label: css`
    flex-grow: 1;
  `,
  input: css`
    overflow: auto;
    transition: var(--hover-timing);
  `,
  foot: css`
    padding: 0 1rem;
    color: var(--fnt-clr-3rd);
    font-size: var(--fnt-s);
    text-align: center;
  `,
})
