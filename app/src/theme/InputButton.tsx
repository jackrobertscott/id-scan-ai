import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {FC} from "react"
import {useCnStatic} from "../utils/classNames"
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
  const cn = useCnStatic("input-button", () => ({
    container: css`
      flex-shrink: 0;
      flex-grow: ${grow ? 1 : 0};
      flex-basis: ${grow ? 0 : "auto"};
      user-select: none;
      flex-direction: row;
      justify-content: center;
      text-align: center;
      gap: var(--gap-regular);
      padding: var(--padding-regular);
      transition: var(--hover-timing);
      color: hsl(0, 0%, 100%, ${disabled ? 0.5 : 1});
    `,
  }))

  return (
    <button
      onClick={disabled || loading ? undefined : onClick}
      className={[cn.container, className].filter(Boolean).join(" ")}>
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
