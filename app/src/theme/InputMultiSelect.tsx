import {css} from "@emotion/css"
import {mdiClose} from "@mdi/js"
import {toSentenceCase, toSpacedCase} from "../utils/changeCase"
import {InputSelect, InputSelectOption} from "./InputSelect"
import {SimpleList} from "./SimpleList"
import {useCn} from "../utils/classNames"

export type InputMultiSelectProps = {
  value?: string[] | null
  onValue?: (value: string[] | null) => void
  options: InputSelectOption[]
  placeholder?: string
}

export const InputMultiSelect = ({
  value,
  onValue,
  options,
  placeholder,
}: InputMultiSelectProps) => {
  value ||= []

  const cn = useCn("input-multi-select", {
    root: css`
      flex-grow: 1;
      ${value.length > 0 &&
      css`
        > *:not(:last-child) {
          border-bottom: var(--border-regular);
        }
      `}
    `,
  })

  return (
    <div className={cn.root}>
      <InputSelect
        placeholder={placeholder ?? "Select"}
        options={options.filter((option) => {
          if (value.includes(option.value)) return false
          return true
        })}
        onValue={(i) => {
          if (i) onValue?.([...new Set([...value, i])])
        }}
      />
      <SimpleList
        options={value.map((a) => ({
          label: toSentenceCase(toSpacedCase(a)),
          actions: [
            {
              icon: mdiClose,
              onClick: () => onValue?.(value.filter((b) => b !== a)),
            },
          ],
        }))}
      />
    </div>
  )
}
