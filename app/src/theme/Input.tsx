import {css} from "@emotion/css"
import {cn_jn, createCns} from "../../utils/classNames"
import {gcn} from "./gcn.css"

export type InputProps = {
  disabled?: boolean
  placeholder?: string
  value?: string | null
  maxLength?: number
  content?: "password"
  onValue?: (value: string | null) => void
}

export const Input = ({
  disabled,
  placeholder,
  value,
  maxLength,
  content,
  onValue,
}: InputProps) => {
  return (
    <input
      value={value || ""}
      type={content === "password" ? "password" : "text"}
      disabled={disabled}
      placeholder={placeholder}
      className={cn_jn([cn.input, gcn.depress])}
      onChange={({currentTarget}) => {
        if (disabled) return
        if (maxLength && currentTarget.value.length > maxLength) return
        onValue?.(currentTarget.value || null)
      }}
    />
  )
}

const cn = createCns({
  input: css`
    width: 0; // don't use "100%" or "auto"
    min-width: 0;
    flex-grow: 1;
    padding: var(--cell-size-yx);
    background-color: hsl(0, 0%, 0%, 0.25);
    &::placeholder {
      color: hsl(0, 0%, 100%, 0.25);
    }
  `,
})
