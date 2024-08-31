import {Cell, CellProps} from "./Cell"

export type ButtonProps = CellProps & {}

export const Button = ({...props}: ButtonProps) => {
  return <Cell {...props} />
}
