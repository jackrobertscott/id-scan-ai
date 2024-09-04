import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {ReactNode} from "react"
import {prettyCns} from "../utils/classNames"
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
    <div className={cn_elw.root} data-nested={nested}>
      {ready ? label : <Icon icon={mdiLoading} spinning />}
    </div>
  )
}

const cn_elw = prettyCns("EmptyListWrap", {
  root: css`
    text-align: center;
    color: hsl(0, 0%, 100%, 0.5);
    padding: var(--pad-r);
    &[data-nested] {
      flex-grow: 1;
    }
    &:not([data-nested]) {
      background-color: hsl(0, 0%, 100%, 0.05);
    }
  `,
})
