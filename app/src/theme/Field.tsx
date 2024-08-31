import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {gcn} from "../gcn"
import {toKebabCase} from "../utils/changeCase"
import {createCns, jn_cns} from "../utils/classNames"

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
      className={jn_cns([
        className,
        cn_f.root,
        grow && gcn.grow,
        overflow && gcn.overAuto,
      ])}
      data-name={label ? toKebabCase(label) : undefined}>
      {label && (
        <div className={cn_f.head}>
          <label className={cn_f.label}>{label}</label>
          {/* {icon && <Icon icon={icon} />} */}
        </div>
      )}
      <div
        className={jn_cns([
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

const cn_f = createCns("Field", {
  root: css`
    gap: 0.25rem;
  `,
  head: css`
    padding: 0 1rem;
    flex-direction: row;
    color: hsl(0, 0%, 100%, 0.5);
  `,
  label: css`
    flex-grow: 1;
  `,
  input: css`
    overflow: auto;
    transition: var(--hover-timing);
    :focus-within {
      border-color: hsl(220, 100%, 50%);
      > * {
        border-color: hsl(220, 100%, 50%);
      }
    }
  `,
  foot: css`
    padding: 0 1rem;
    color: hsl(0, 0%, 100%, 0.5);
    font-size: var(--font-size-small);
    text-align: center;
  `,
})
