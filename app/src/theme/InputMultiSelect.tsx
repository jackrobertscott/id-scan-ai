import {css} from "@emotion/css"
import {mdiClose} from "@mdi/js"
import {toSentenceCase, toSpacedCase} from "../utils/changeCase"
import {useCnStatic} from "../utils/classNames"
import {InputSelect, InputSelectOption} from "./InputSelect"
import {SimpleList} from "./SimpleList"

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

  const cn = useCnStatic("input-multi-select", () => ({
    root: css`
      flex-grow: 1;
    `,
  }))

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
