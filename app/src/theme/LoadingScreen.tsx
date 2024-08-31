import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {ReactNode} from "react"
import {createCns} from "../utils/classNames"
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

const cn_ls = createCns("LoadingScreen", {
  root: css`
    flex-grow: 1;
    font-size: 2rem;
    color: hsl(0, 0%, 100%, 0.5);
    justify-content: center;
    align-items: center;
    text-align: center;
  `,
})
