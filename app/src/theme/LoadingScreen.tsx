import {css} from "@emotion/css"
import {mdiLoading} from "@mdi/js"
import {ReactNode} from "react"
import {useCnStatic} from "../utils/classNames"
import {Icon} from "./Icon"

export const LoadingScreen = <T extends any>({
  data,
  render,
}: {
  data?: T
  render?: (data: T) => ReactNode
}): ReactNode => {
  const cn = useCnStatic("loading-screen", () => ({
    root: css`
      flex-grow: 1;
      font-size: 2rem;
      color: hsl(0, 0%, 100%, 0.5);
      justify-content: center;
      align-items: center;
      text-align: center;
    `,
  }))

  if (data) {
    return render?.(data)
  }

  return (
    <div className={cn.root}>
      <Icon icon={mdiLoading} spinning />
    </div>
  )
}
