import {css} from "@emotion/css"
import {ReactNode} from "react"
import {createCns} from "../../utils/classNames"

export type FormFieldProps = {
  label?: string
  children?: ReactNode
  direction?: "row" | "column"
}

export const FormField = ({label, children, direction}: FormFieldProps) => {
  return (
    <div className={cn.field} data-direction={direction}>
      {label && (
        <div className={cn.label} data-direction={direction}>
          {label}
        </div>
      )}
      <div className={cn.body}>{children}</div>
    </div>
  )
}

const cn = createCns({
  field: css`
    flex-direction: column;
    &[data-direction="row"] {
      flex-direction: row;
    }
  `,
  label: css`
    padding: var(--cell-size-yx);
    &:not([data-direction]) {
      padding-top: 0;
    }
    &[data-direction="row"] {
      padding-left: 0;
    }
  `,
  body: css`
    flex-grow: 1;
    flex-direction: row;
  `,
})
