import {css} from "@emotion/css"
import {ComponentProps} from "react"
import {gcn} from "../gcn"
import {jn_cn, prettyCns} from "../utils/classNames"
import {InputButton} from "./InputButton"

export type ButtonProps = ComponentProps<typeof InputButton>

export const Button = ({...props}: ButtonProps) => {
  return (
    <div className={jn_cn([cn_b.root, props.grow && gcn.grow])}>
      <InputButton {...props} />
    </div>
  )
}

const cn_b = prettyCns("Button", {
  root: css`
    flex-shrink: 0;
    overflow: hidden;
  `,
})
