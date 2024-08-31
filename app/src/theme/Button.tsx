import {css} from "@emotion/css"
import {ComponentProps} from "react"
import {useCnStatic} from "../utils/classNames"
import {InputButton} from "./InputButton"

export type ButtonProps = ComponentProps<typeof InputButton>

export const Button = ({...props}: ButtonProps) => {
  const cn = useCnStatic("button", () => ({
    root: css`
      flex-shrink: 0;
      overflow: hidden;
      flex-grow: ${props.grow ? 1 : 0};
    `,
  }))

  return (
    <div className={cn.root}>
      <InputButton {...props} />
    </div>
  )
}
