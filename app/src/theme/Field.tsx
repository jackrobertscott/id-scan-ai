import {css} from "@emotion/css"
import {mdiAsterisk, mdiLock} from "@mdi/js"
import {FC, ReactNode} from "react"
import {toKebabCase} from "../utils/changeCase"
import {cn_jn, createCns} from "../utils/classNames"
import {Icon} from "./Icon"
import {gcn} from "./gcn.css"

export const Field: FC<{
  grow?: boolean
  label?: string
  children?: ReactNode
  variant?: "locked" | "required"
  footNote?: string
  className?: string
  isAdmin?: boolean
  overflow?: "auto"
  direction?: "row" | "column"
}> = ({
  grow,
  label,
  children,
  variant,
  className,
  footNote,
  overflow,
  direction = "row",
}) => {
  let icon: string | undefined
  switch (variant) {
    case "locked":
      icon = mdiLock
      break
    case "required":
      icon = mdiAsterisk
      break
  }

  return (
    <div
      className={cn_jn([
        className,
        cn.field,
        overflow && gcn.overflow_auto,
        grow && gcn.grow,
      ])}
      data-name={label ? toKebabCase(label) : undefined}>
      {label && (
        <div className={cn.head}>
          <label className={cn.label}>{label}</label>
          {icon && <Icon icon={icon} />}
        </div>
      )}
      <div
        className={cn_jn([cn.input, grow && gcn.grow])}
        data-direction={direction}>
        {children}
      </div>
      {footNote && <div className={cn.foot}>{footNote}</div>}
    </div>
  )
}

const cn = createCns({
  field: css`
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
    border-radius: var(--radius-regular);
    &:focus-within {
      border-color: hsl(220, 100%, 50%);
      & > * {
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
