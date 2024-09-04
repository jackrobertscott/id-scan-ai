import {css} from "@emotion/css"
import {mdiClose, mdiPlus} from "@mdi/js"
import {useState} from "react"
import {z} from "zod"
import {prettyCns} from "../utils/classNames"
import {EmptyListWrap} from "./EmptyListWrap"
import {InputButton} from "./InputButton"
import {InputString} from "./InputString"
import {SimpleList} from "./SimpleList"

export type InputStringArrayProps = {
  value?: string[] | null
  onValue?: (value: string[]) => void
  placeholder?: string
  validate?: {
    schema: z.ZodString
    errorMessage: string
  }
}

export const InputStringArray = ({
  value,
  onValue,
  placeholder,
  validate,
}: InputStringArrayProps) => {
  value ||= []
  const [inputValue, setInputValue] = useState<string | null>("")
  const validationResult = validate?.schema.safeParse(inputValue)
  const inputValid = validationResult?.success ?? inputValue?.trim()?.length

  return (
    <div className={cn_isa.root}>
      <div className={cn_isa.head}>
        <InputString
          value={inputValue}
          onValue={setInputValue}
          placeholder={placeholder}
        />

        {inputValid && (
          <InputButton
            label="Add"
            icon={mdiPlus}
            onClick={() => {
              if (!inputValue) return
              onValue?.([...value, inputValue])
              setInputValue("")
            }}
          />
        )}
      </div>

      <EmptyListWrap
        ready={true}
        label="No Values Yet"
        data={value}
        render={() => (
          <SimpleList
            options={value.map((i, index) => ({
              key: index.toString(),
              label: i,
              actions: [
                {
                  icon: mdiClose,
                  onClick: () => onValue?.(value.filter((j) => j !== i)),
                },
              ],
            }))}
          />
        )}
      />
    </div>
  )
}

const cn_isa = prettyCns("InputStringArray", {
  root: css`
    flex-grow: 1;
  `,
  head: css`
    flex-direction: row;
  `,
})
