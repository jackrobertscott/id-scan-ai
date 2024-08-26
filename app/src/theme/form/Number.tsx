import {useNumStr, UseNumStrProps} from "../../utils/useNumStr"
import {CellInput, CellInputProps} from "../cell/Input"
import {FormField, FormFieldProps} from "./Field"

export type FormNumberProps = FormFieldProps & {
  input: UseNumStrProps<CellInputProps>
}

export const FormNumber = ({input: _input, ...props}: FormNumberProps) => {
  const input = useNumStr(_input)
  return (
    <FormField {...props}>
      <CellInput {...input} />
    </FormField>
  )
}
