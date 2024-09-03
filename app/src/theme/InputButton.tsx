import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {FC} from "react"
import {gcn} from "../gcn"
import {createCns, jn_cns} from "../utils/classNames"
import {Icon} from "./Icon"

export const InputButton: FC<{
  grow?: boolean
  icon?: string
  label?: string
  className?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}> = ({grow, icon, label, className, disabled, loading, onClick}) => {
  return (
    <button
      onClick={disabled || loading ? undefined : onClick}
      className={jn_cns([
        className,
        cn_ib.container,
        grow && gcn.grow,
        grow && gcn.zeroBasis,
        gcn.elevate,
      ])}
      style={{"--text-opacity": disabled ? 0.5 : 1}}>
      {loading ? (
        <>
          <div>Loading</div>
          <Icon icon={mdiLoading} spinning />
        </>
      ) : (
        <>
          {label && <div>{label}</div>}
          {icon && <Icon icon={icon} />}
        </>
      )}
    </button>
  )
}

const cn_ib = createCns("InputButton", {
  container: css`
    flex-shrink: 0;
    user-select: none;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    gap: var(--gap-regular);
    padding: var(--padding-regular);
    transition: var(--hover-timing);
    color: hsl(0, 0%, 100%, var(--text-opacity));
  `,
})
