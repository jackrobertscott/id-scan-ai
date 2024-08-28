import {useNumStr, UseNumStrProps} from "../../utils/useNumStr"
import {Input, InputProps} from "./Input"

export type InpNumProps = UseNumStrProps<InputProps> & {}

export const InpNum = ({...props}: InpNumProps) => {
  const inputStrProps = useNumStr(props)
  return <Input {...inputStrProps} />
}
