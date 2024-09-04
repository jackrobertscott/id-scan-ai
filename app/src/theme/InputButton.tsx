import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {FC} from "react"
import {gcn} from "../gcn"
import {jn_cn, prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"

export const InputButton: FC<{
  grow?: boolean
  icon?: string
  label?: string
  loading?: boolean
  disabled?: boolean
  bgColor?: string
  onClick?: () => void
}> = ({grow, icon, label, disabled, loading, bgColor, onClick}) => {
  const canClick = !(disabled || loading)
  return (
    <button
      onClick={canClick ? onClick : undefined}
      className={jn_cn([
        cn_ib.container,
        grow && gcn.grow,
        grow && gcn.zeroBasis,
        canClick && gcn.hoverClick,
      ])}
      style={{
        "--bg-color": bgColor,
        "--text-opacity": disabled ? 0.5 : 1,
      }}>
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

const cn_ib = prettyCns("InputButton", {
  container: css`
    flex-shrink: 0;
    user-select: none;
    flex-direction: row;
    justify-content: center;
    text-align: center;
    gap: var(--gap-r);
    padding: var(--pad-r);
    transition: var(--hover-timing);
    color: hsl(0, 0%, 100%, var(--text-opacity));
    background-color: var(--bg-color, var(--lgt-clr));
  `,
})
