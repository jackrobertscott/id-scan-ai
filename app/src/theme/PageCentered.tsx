import {css} from "@emotion/css"
import {ReactNode} from "react"
import {gcn} from "../gcn"
import {createCns} from "../utils/classNames"

export type PageCenteredProps = {
  title: string
  children?: ReactNode
}

export const PageCentered = ({title, children}: PageCenteredProps) => {
  return (
    <div className={cn.root}>
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

const cn = createCns("PageCentered", {
  root: css`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    ${gcn.noiseBackground}
  `,
  container: css`
    width: 15rem;
  `,
  top: css`
    flex-direction: row;
    gap: var(--cell-size-x);
    padding: var(--cell-size-y) var(--cell-size-x);
    background-color: var(--body-bg-color);
    ${gcn.elevateShadow};
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
    ${gcn.elevateShadow}
  `,
})
