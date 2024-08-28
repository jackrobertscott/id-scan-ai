import {css} from "@emotion/css"
import {ReactNode} from "react"
import {createCns} from "../../utils/classNames"
import {gcn} from "./global_cns"

export type PageCenterProps = {
  title: string
  children?: ReactNode
}

export const PageCenter = ({title, children}: PageCenterProps) => {
  return (
    <div className={cn.pageCenter}>
      <div className={cn.container}>
        <div className={cn.top}>
          <div className={cn.grab} />
          <div>{title}</div>
          <div className={cn.grab} />
        </div>
        <div className={cn.body}>{children}</div>
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
    width: 15rem;
  `,
  top: css`
    flex-direction: row;
    gap: var(--cell-size-x);
    padding: var(--cell-size-y) var(--cell-size-x);
    background-color: var(--body-bg-color);
    ${gcn.elevate};
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
    background-color: var(--body-bg-color);
    ${gcn.elevate}
  `,
})
