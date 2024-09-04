import {css} from "@emotion/css"
import {mdiContentCopy} from "@mdi/js"
import {ReactNode} from "react"
import {gcn} from "../gcn"
import {useAlertManager} from "../mods/alert/alert_manager"
import {jn_cn, prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"
import {InputButton} from "./InputButton"

export type InputStaticProps = {
  icon?: string
  label?: string | number | null | Date
  children?: ReactNode
  canCopy?: boolean
}

export const InputStatic = ({
  icon,
  label,
  children,
  canCopy,
}: InputStaticProps): ReactNode => {
  const alertManager = useAlertManager()

  return (
    <div className={jn_cn(cn_is.root, gcn.elevate)}>
      <div className={cn_is.body}>
        {children}
        {icon && <Icon icon={icon} />}
        {label !== undefined && (
          <div className={cn_is.label}>
            {label instanceof Date
              ? label.toLocaleString("en-au", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })
              : label === null
              ? ""
              : label}
          </div>
        )}
      </div>
      {label && canCopy && navigator.clipboard && (
        <InputButton
          icon={mdiContentCopy}
          label="Copy"
          onClick={() => {
            navigator.clipboard.writeText(label.toString()).then(() => {
              alertManager.create("Copied to clipboard")
            })
          }}
        />
      )}
    </div>
  )
}

const cn_is = prettyCns("InputStatic", {
  root: css`
    flex-grow: 1;
    overflow: auto;
  `,
  body: css`
    flex-grow: 1;
    overflow: auto;
    flex-direction: row;
    gap: var(--gap-r);
    padding: var(--pad-r);
  `,
  label: css`
    min-height: calc(var(--line-height) * 1rem);
  `,
})
