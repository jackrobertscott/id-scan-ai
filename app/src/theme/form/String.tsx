import {CellInput, CellInputProps} from "../cell/Input"
import {FormField, FormFieldProps} from "./Field"

export type FormStringProps = FormFieldProps & {
  input: CellInputProps
}

export const FormString = ({input, ...props}: FormStringProps) => {
  return (
    <FormField {...props}>
      <CellInput {...input} />
    </FormField>
  )
}
