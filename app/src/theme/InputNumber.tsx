import {UseNumStrProps, useNumStr} from "../utils/useNumStr"
import {Input, InputProps} from "./Input"

export type InputNumberProps = UseNumStrProps<InputProps> & {}

export const InputNumber = ({...props}: InputNumberProps) => {
  const inputStrProps = useNumStr(props)
  return <Input {...inputStrProps} />
}
