import {css} from "@emotion/css"
import {mdiChevronDown, mdiChevronUp} from "@mdi/js"
import {FC, Fragment, ReactNode, useState} from "react"
import {toKebabCase} from "../utils/changeCase"
import {useCnStatic} from "../utils/classNames"
import {Icon} from "./Icon"
import {InputButton} from "./InputButton"
import {Spacer} from "./Spacer"

export const FieldGroup: FC<{
  label?: string
  children?: ReactNode
  init?: boolean
}> = ({label, children, init = true}) => {
  const [open, setOpen] = useState(init)

  const cn = useCnStatic("field-group", () => ({
    root: css`
      flex-shrink: 0;
      gap: calc(0.5rem - var(--padding-small-y));
    `,
    head: css`
      flex-direction: row;
      padding: 0 calc(1rem - var(--padding-small-x));
      color: hsl(0, 0%, 100%, 0.5);
    `,
    label: css`
      flex-grow: 1;
      padding: var(--padding-small);
    `,
    action: css`
      user-select: none;
      flex-direction: row;
      gap: var(--gap-small);
      padding: var(--padding-small);
      border-radius: var(--radius-regular);
      transition: var(--hover-timing);
      :hover:not(:active) {
        background-color: hsl(0, 0%, 100%, 0.05);
      }
    `,
    body: css`
      flex-shrink: 0;
      overflow: hidden;
      transition: var(--hover-timing);
      border-radius: var(--radius-regular);
      border: var(--border-regular);
    `,
  }))

  return (
    <div className={cn.root} data-name={label ? toKebabCase(label) : undefined}>
      {label && (
        <div className={cn.head}>
          <label className={cn.label}>{label}</label>
          <div onClick={() => setOpen(!open)} className={cn.action}>
            {open ? (
              <Fragment>
                <div>Hide</div>
                <Icon icon={mdiChevronUp} />
              </Fragment>
            ) : (
              <Fragment>
                <div>Show</div>
                <Icon icon={mdiChevronDown} />
              </Fragment>
            )}
          </div>
        </div>
      )}
      <div className={cn.body}>
        {open ? (
          <Spacer>{children}</Spacer>
        ) : (
          <InputButton label="Click to expand" onClick={() => setOpen(true)} />
        )}
      </div>
    </div>
  )
}
