import {useState} from "react"
import {InputToggle, InputToggleProps} from "./InputToggle"
import {PosterProps} from "./Poster"
import {QuestionModal} from "./QuestionModal"

export type InputToggleConfirmProps = InputToggleProps & {
  getPoster?: (value: boolean) => Partial<PosterProps>
}

export const InputToggleConfirm = ({
  getPoster,
  value,
  onValue,
  ...props
}: InputToggleConfirmProps) => {
  const [preValue, setPreValue] = useState(value)

  return (
    <QuestionModal
      poster={getPoster?.(!!value)}
      getButtons={(doHide) => [
        {
          label: "Yes",
          variant: "yellow",
          onClick: () => {
            onValue?.(!!preValue)
            doHide()
          },
        },
        {
          label: "Cancel",
          onClick: () => doHide(),
        },
      ]}
      render={(doShow) => (
        <InputToggle
          {...props}
          value={value}
          onValue={(i) => {
            setPreValue(i)
            doShow()
          }}
        />
      )}
    />
  )
}
