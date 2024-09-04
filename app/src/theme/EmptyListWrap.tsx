import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {ReactNode} from "react"
import {gcn} from "../gcn"
import {prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"

export const EmptyListWrap = <T extends any[]>({
  label,
  ready,
  data,
  render,
}: {
  label: string
  ready: boolean
  data?: T | null
  render?: (data: T) => ReactNode
}): ReactNode => {
  if (data?.length && data.length > 0) {
    return render?.(data)
  }

  return (
    <div className={cn_elw.root}>
      {ready ? label : <Icon icon={mdiLoading} spinning />}
    </div>
  )
}

const cn_elw = prettyCns("EmptyListWrap", {
  root: css`
    ${gcn.elevate}
    text-align: center;
    padding: var(--pad-r);
    color: var(--fnt-clr-3rd);
  `,
})
