import {css} from "@emotion/css"
import {useCn} from "../utils/classNames"

export type InputStringProps = {
  disabled?: boolean
  placeholder?: string
  value?: string | null
  onValue?: (value: string | null) => void
  maxLength?: number
}

export const InputString = ({
  value,
  onValue,
  placeholder,
  disabled,
  maxLength,
}: InputStringProps) => {
  const cn = useCn("input-string", {
    root: css`
      width: 0; // don't use "100%" or "auto"
      min-width: 0;
      flex-grow: 1;
      padding: var(--padding-regular);
      ::placeholder {
        color: hsl(0, 0%, 100%, 0.25);
      }
    `,
  })

  return (
    <input
      value={value || ""}
      disabled={disabled}
      placeholder={placeholder}
      className={cn.root}
      onChange={({currentTarget}) => {
        if (disabled) return
        if (maxLength && currentTarget.value.length > maxLength) return
        onValue?.(currentTarget.value || null)
      }}
    />
  )
}
