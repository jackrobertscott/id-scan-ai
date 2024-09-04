import {css} from "@emotion/css"
import {mdiCheck} from "@mdi/js"
import {ReactNode} from "react"
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
      data-disabled={disabled}>
      <div className={cn_it.checkbox}>{value && <Icon icon={mdiCheck} />}</div>
      <div
        className={cn_it.label}
        style={{
          "--color-text": value ? "hsl(0, 0%, 100%)" : "var(--fnt-clr-3rd)",
        }}>
        {getLabel?.(!!value) ?? (value ? "On" : "Off")}
      </div>
    </div>
  )
}

const cn_it = prettyCns("InputToggle", {
  root: css`
    flex-grow: 1;
    flex-direction: row;
    gap: var(--gap-r);
    padding: var(--pad-r);
    padding-left: var(--pad-r-y);
    user-select: none;
    &:not([data-disabled]) {
      transition: var(--hover-timing);
      &:hover:not(:active) {
        background-color: var(--lgt-clr);
        .input-toggle-checkbox {
          background-color: blue;
        }
      }
    }
  `,
  checkbox: css`
    transition: var(--hover-timing);
    width: calc(var(--line-height) * 1rem);
    height: calc(var(--line-height) * 1rem);
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
  `,
  label: css`
    min-height: calc(var(--line-height) * 1rem);
    color: var(--color-text);
  `,
})
