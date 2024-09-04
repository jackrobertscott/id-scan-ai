import {css} from "@emotion/css"
import {mdiCheck, mdiClose} from "@mdi/js"
import {ReactNode} from "react"
import {gcn} from "../gcn"
import {prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"

export type InputToggleProps = {
  disabled?: boolean
  value?: boolean | null
  onValue?: (value: boolean | null) => void
  getLabel?: (value: boolean) => string
}

export const InputToggle = ({
  value,
  onValue,
  disabled,
  getLabel,
}: InputToggleProps): ReactNode => {
  return (
    <div
      onClick={() => onValue?.(!value)}
      className={cn_it.root}
      data-disabled={disabled}
      style={{
        "--color-text": value ? "hsl(0, 0%, 100%)" : "var(--fnt-clr-3rd)",
      }}>
      <div className={cn_it.checkbox} data-checked={!!value}>
        <Icon icon={value ? mdiCheck : mdiClose} />
      </div>
      <div className={cn_it.label}>
        {getLabel?.(!!value) ?? (value ? "On" : "Off")}
      </div>
    </div>
  )
}

const cn_it = prettyCns("InputToggle", {
  root: css`
    ${gcn.depress}
    flex-grow: 1;
    flex-direction: row;
    gap: var(--gap-r);
    padding: var(--pad-r);
    padding-left: var(--pad-r-y);
    color: var(--color-text);
    user-select: none;
    &:not([data-disabled]) {
      transition: var(--hover-timing);
      &:hover:not(:active) {
        background-color: var(--lgt-clr);
      }
    }
  `,
  checkbox: css`
    transition: var(--hover-timing);
    width: calc(var(--line-height) * 1rem);
    height: calc(var(--line-height) * 1rem);
    justify-content: center;
    align-items: center;
    font-size: 0.7rem;
    box-shadow: inset 0 0 0 var(--shdw-thck) hsl(0, 0%, 0%, 0.5);
    &[data-checked="true"] {
      background-color: hsl(var(--hsl-blu));
    }
  `,
  label: css`
    min-height: calc(var(--line-height) * 1rem);
  `,
})
