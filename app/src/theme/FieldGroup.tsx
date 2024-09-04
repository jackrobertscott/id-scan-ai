import {css} from "@emotion/css"
import {mdiChevronDown, mdiChevronUp} from "@mdi/js"
import {FC, Fragment, ReactNode, useState} from "react"
import {gcn} from "../gcn"
import {toKebabCase} from "../utils/changeCase"
import {jn_cn, prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"
import {InputButton} from "./InputButton"
import {Spacer} from "./Spacer"

export const FieldGroup: FC<{
  label?: string
  children?: ReactNode
  init?: boolean
}> = ({label, children, init = true}) => {
  const [open, setOpen] = useState(init)

  return (
    <div
      className={cn_fg.root}
      data-name={label ? toKebabCase(label) : undefined}>
      {label && (
        <div className={cn_fg.head}>
          <label className={cn_fg.label}>{label}</label>
          <div onClick={() => setOpen(!open)} className={cn_fg.action}>
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
      <div className={jn_cn(cn_fg.body, gcn.elevate)}>
        {open ? (
          <Spacer>{children}</Spacer>
        ) : (
          <InputButton label="Click to expand" onClick={() => setOpen(true)} />
        )}
      </div>
    </div>
  )
}

const cn_fg = prettyCns("FieldGroup", {
  root: css`
    flex-shrink: 0;
    gap: calc(0.5rem - var(--pad-s-y));
  `,
  head: css`
    flex-direction: row;
    padding: 0 calc(1rem - var(--pad-s-x));
    color: hsl(0, 0%, 100%, 0.5);
  `,
  label: css`
    flex-grow: 1;
    padding: var(--pad-s);
  `,
  action: css`
    user-select: none;
    flex-direction: row;
    gap: var(--gap-s);
    padding: var(--pad-s);
    transition: var(--hover-timing);
    :hover:not(:active) {
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
  body: css`
    flex-shrink: 0;
    overflow: hidden;
    transition: var(--hover-timing);
  `,
})
