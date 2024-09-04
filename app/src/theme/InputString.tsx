import {css} from "@emotion/css"
import {gcn} from "../gcn"
import {jn_cn, prettyCns} from "../utils/classNames"

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
  return (
    <input
      value={value || ""}
      disabled={disabled}
      placeholder={placeholder}
      className={jn_cn([cn_is.root, gcn.depress])}
      onChange={({currentTarget}) => {
        if (disabled) return
        if (maxLength && currentTarget.value.length > maxLength) return
        onValue?.(currentTarget.value || null)
      }}
    />
  )
}

const cn_is = prettyCns("InputString", {
  root: css`
    width: 0; // don't use "100%" or "auto"
    min-width: 0;
    flex-grow: 1;
    padding: var(--pad-r);
    background-color: var(--drk-clr);
    &::placeholder {
      color: hsl(0, 0%, 100%, 0.25);
    }
    &:focus {
      ${gcn.greenShdw}
    }
  `,
})
