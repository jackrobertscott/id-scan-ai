import {css} from "@emotion/css"
import {gcn} from "../../gcn"
import {createCns} from "../../utils/classNames"

export type CellInputProps = {
  disabled?: boolean
  placeholder?: string
  value?: string | null
  maxLength?: number
  content?: "password"
  onValue?: (value: string | null) => void
}

export const CellInput = ({
  disabled,
  placeholder,
  value,
  maxLength,
  content,
  onValue,
}: CellInputProps) => {
  return (
    <input
      value={value || ""}
      type={content === "password" ? "password" : "text"}
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

const cn = createCns("CellInput", {
  root: css`
    width: 0; // don't use "100%" or "auto"
    min-width: 0;
    flex-grow: 1;
    ${gcn.depressShadow}
    background-color: hsl(0, 0%, 0%, 0.25);
    padding: var(--cell-size-y) var(--cell-size-x);
    &::placeholder {
      color: hsl(0, 0%, 100%, 0.25);
    }
    &:focus-within {
      background-color: hsl(0, 0%, 0%, 0.5);
    }
  `,
})
