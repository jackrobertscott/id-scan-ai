import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {ReactNode} from "react"
import {createCns} from "../utils/classNames"
import {Icon} from "./Icon"

export const EmptyListWrap = <T extends any[]>({
  label,
  ready,
  data,
  render,
  nested,
}: {
  label: string
  ready: boolean
  data?: T | null
  render?: (data: T) => ReactNode
  nested?: boolean
}): ReactNode => {
  if (data?.length && data.length > 0) {
    return render?.(data)
  }

  return (
    <div className={cn.emptyListWrap} data-nested={nested}>
      {ready ? (
        label
      ) : (
        <Icon icon={mdiLoading} animation="500ms linear infinite rotate360" />
      )}
    </div>
  )
}

const cn = createCns({
  emptyListWrap: css`
    text-align: center;
    color: hsl(0, 0%, 100%, 0.5);
    [data-nested] {
      flex-grow: 1;
    }
    &:not([data-nested]) {
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
})
