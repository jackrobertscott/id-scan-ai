import {css} from "@emotion/css"
import {FC, ReactNode} from "react"
import {toKebabCase} from "../utils/changeCase"
import {useCnStatic} from "../utils/classNames"

export const Field: FC<{
  grow?: boolean
  label?: string
  children?: ReactNode
  footNote?: string
  className?: string
  isAdmin?: boolean
  overflow?: "auto"
  direction?: "row" | "column"
}> = ({
  grow,
  label,
  children,
  className,
  footNote,
  overflow,
  direction = "row",
}) => {
  const cn = useCnStatic("field", () => ({
    root: css`
      gap: 0.25rem;
      overflow: ${overflow};
      flex-grow: ${grow ? 1 : 0};
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
      flex-grow: ${grow ? 1 : 0};
      flex-direction: ${direction};
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
  }))

  return (
    <div
      className={[cn.root, className].filter(Boolean).join(" ")}
      data-name={label ? toKebabCase(label) : undefined}>
      {label && (
        <div className={cn.head}>
          <label className={cn.label}>{label}</label>
          {/* {icon && <Icon icon={icon} />} */}
        </div>
      )}
      <div className={cn.input}>{children}</div>
      {footNote && <div className={cn.foot}>{footNote}</div>}
    </div>
  )
}
