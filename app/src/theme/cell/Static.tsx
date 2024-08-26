import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {gcn} from "../../gcn"
import {cnx, createCns} from "../../utils/classNames"
import {Icon} from "../Icon"

export type CellStaticProps = {
  icon?: string
  label?: string
  loading?: boolean
  disabled?: boolean
  centered?: boolean
  onClick?: () => void
}

export const CellStatic = ({
  icon,
  label,
  loading,
  disabled,
  centered,
  onClick,
}: CellStaticProps) => {
  return (
    <button
      className={cnx([
        cn.root,
        centered && cn.rootCentered,
        onClick && !disabled && !loading && cn.rootClickable,
      ])}
      onClick={disabled || loading ? undefined : onClick}>
      {loading ? (
        <Icon icon={mdiLoading} animation="500ms linear infinite rotate360" />
      ) : (
        <>
          {icon && <Icon icon={icon} />}
          {label && <div>{label}</div>}
        </>
      )}
    </button>
  )
}

const cn = createCns("CellStatic", {
  root: css`
    flex-grow: 1;
    flex-shrink: 0;
    ${gcn.elevateShadow}
    background-color: hsl(210, 100%, 40%);
    padding: var(--cell-size-y) var(--cell-size-x);
  `,
  rootCentered: css`
    align-items: center;
    justify-content: center;
    text-align: center;
  `,
  rootClickable: css`
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
