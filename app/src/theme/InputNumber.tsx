import {ComponentProps, FC} from "react"
import {MergeObjects} from "../utils/sharedTypes"
import {useNumStr} from "../utils/useNumStr"
import {InputString} from "./InputString"

export const InputNumber: FC<
  MergeObjects<
    ComponentProps<typeof InputString>,
    {
      value?: number | null
      onValue?: (value: number | null) => void
      decimals?: number
      min?: number
      max?: number
    }
  >
> = ({...data}) => {
  const props = useNumStr(data)

  return <InputString {...props} />
}
