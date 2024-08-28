import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {cnx, createCns} from "../../utils/classNames"
import {Icon} from "./Icon"
import {gcn} from "./global_cns"

export type CellProps = {
  icon?: string
  label?: string
  loading?: boolean
  disabled?: boolean
  centered?: boolean
  onClick?: () => void
}

export const Cell = ({
  icon,
  label,
  loading,
  disabled,
  centered,
  onClick,
}: CellProps) => {
  return (
    <div
      onClick={disabled || loading ? undefined : onClick}
      className={cnx([
        cn.cell,
        centered && cn.cellCenter,
        onClick && !disabled && !loading && cn.cellClick,
      ])}>
      {loading ? (
        <Icon icon={mdiLoading} animation="500ms linear infinite rotate360" />
      ) : (
        <>
          {icon && <Icon icon={icon} />}
          {label && <div>{label}</div>}
        </>
      )}
    </div>
  )
}

const cn = createCns({
  cell: css`
    flex-grow: 1;
    flex-shrink: 0;
    ${gcn.elevate}
    background-color: hsl(210, 100%, 40%);
    padding: var(--cell-size-y) var(--cell-size-x);
  `,
  cellCenter: css`
    align-items: center;
    justify-content: center;
    text-align: center;
  `,
  cellClick: css`
    cursor: pointer;
    user-select: none;
    position: relative;
    &:hover:not(:active)::before {
      content: "";
      position: absolute;
      background-color: hsl(0, 0%, 100%, 0.05);
      inset: 0;
    }
  `,
})
