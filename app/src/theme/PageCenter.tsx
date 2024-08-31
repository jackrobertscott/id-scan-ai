import {css} from "@emotion/css"
import {ReactNode} from "react"
import {gcn} from "./gcn.css"
import {cn_jn, createCns} from "../utils/classNames"

export type PageCenterProps = {
  title: string
  children?: ReactNode
}

export const PageCenter = ({title, children}: PageCenterProps) => {
  return (
    <div className={cn.pageCenter}>
      <div className={cn.container}>
        <div className={cn_jn([cn.top, gcn.elevate])}>
          <div className={cn.grab} />
          <div>{title}</div>
          <div className={cn.grab} />
        </div>
        <div className={cn_jn([cn.body, gcn.elevate])}>{children}</div>
      </div>
    </div>
  )
}

const cn = createCns({
  pageCenter: css`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  `,
  container: css`
    width: 20rem;
  `,
  top: css`
    flex-direction: row;
    gap: var(--cell-size-x);
    padding: var(--cell-size-yx);
  `,
  grab: css`
    opacity: 0.1;
    flex-grow: 1;
    margin: var(--cell-size-y) 0;
    background: repeating-linear-gradient(
      to bottom,
      white 0,
      white 2px,
      transparent 2px,
      transparent 4px
    );
    background-position-y: 1px;
  `,
  body: css`
    gap: 0.5rem;
    padding: 0.75rem;
  `,
})
