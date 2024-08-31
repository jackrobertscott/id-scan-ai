import {css} from "@emotion/css"
import {mdiCheck} from "@mdi/js"
import {ReactNode} from "react"
import {useCnStatic} from "../utils/classNames"
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
  const cn = useCnStatic("input-toggle", () => ({
    root: css`
      flex-grow: 1;
      flex-direction: row;
      gap: var(--gap-regular);
      padding: var(--padding-regular);
      padding-left: var(--padding-regular-y);
      user-select: none;
      &:not([data-disabled]) {
        transition: var(--hover-timing);
        &:hover:not(:active) {
          background-color: hsl(0, 0%, 100%, 0.05);
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
      border-radius: var(--radius-regular);
      justify-content: center;
      align-items: center;
      font-size: 0.75rem;
    `,
    label: css`
      min-height: calc(var(--line-height) * 1rem);
      color: ${value ? "hsl(0, 0%, 100%)" : "hsl(0, 0%, 100%, 0.5)"};
    `,
  }))

  return (
    <div
      onClick={() => onValue?.(!value)}
      className={cn.root}
      data-disabled={disabled}>
      <div className={cn.checkbox}>{value && <Icon icon={mdiCheck} />}</div>
      <div className={cn.label}>
        {getLabel?.(!!value) ?? (value ? "On" : "Off")}
      </div>
    </div>
  )
}
