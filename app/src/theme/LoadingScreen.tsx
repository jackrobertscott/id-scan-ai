import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {ReactNode} from "react"
import {prettyCns} from "../utils/classNames"
import {Icon} from "./Icon"

export const LoadingScreen = <T extends any>({
  data,
  render,
}: {
  data?: T
  render?: (data: T) => ReactNode
}): ReactNode => {
  if (data) {
    return render?.(data)
  }

  return (
    <div className={cn_ls.root}>
      <Icon icon={mdiLoading} spinning />
    </div>
  )
}

const cn_ls = prettyCns("LoadingScreen", {
  root: css`
    flex-grow: 1;
    font-size: 2rem;
    color: var(--fnt-clr-3rd);
    justify-content: center;
    align-items: center;
    text-align: center;
  `,
})
