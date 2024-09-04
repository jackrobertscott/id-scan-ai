import {css} from "@emotion/css"
import {mdiClose} from "@mdi/js"
import {toSentenceCase, toSpacedCase} from "../utils/changeCase"
import {prettyCns} from "../utils/classNames"
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

  return (
    <div className={cn_ims.root}>
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

const cn_ims = prettyCns("InputMultiSelect", {
  root: css`
    flex-grow: 1;
  `,
})
