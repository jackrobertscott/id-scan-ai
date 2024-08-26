import {CellStatic, CellStaticProps} from "../cell/Static"
import {FormField} from "./Field"

export type FormButtonProps = CellStaticProps & {}

export const FormButton = ({...props}: FormButtonProps) => {
  return (
    <FormField>
      <CellStatic {...props} centered={props.centered ?? true} />
    </FormField>
  )
}
